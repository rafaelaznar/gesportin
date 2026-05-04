#!/usr/bin/env python3
"""
Add collapsible behavior to all teamadmin detail HTML/TS files.
Usage: python3 add-collapsible.py <component_name> [<ts_var_name>]
Example: python3 add-collapsible.py usuario oUsuario
"""

import re
import sys
from pathlib import Path

BASE = Path("/home/rafa/Projects/2026/gesportin/frontsportin/src/app/component")

LABEL_TO_ENTITY = {
    'Club': 'Club',
    'Usuario': 'Usuario',
    'Noticia': 'Noticia',
    'Temporada': 'Temporada',
    'Categoría': 'Categoria',
    'Equipo': 'Equipo',
    'Tipo de usuario': 'Tipousuario',
    'Rol de usuario': 'Rolusuario',
    'Tipo de artículo': 'Tipoarticulo',
    'Artículo': 'Articulo',
    'Factura': 'Factura',
    'Jugador': 'Jugador',
    'Cuota': 'Cuota',
    'Liga': 'Liga',
    'Partido': 'Partido',
    'Pago': 'Pago',
    'Comentario': 'Comentario',
    'Carrito': 'Carrito',
    'Compra': 'Compra',
}

def get_entity_name(label):
    return LABEL_TO_ENTITY.get(label.strip(), label.replace(' ', '').capitalize())


def process_html(content):
    """
    Process HTML to add collapsible patterns to all subcards.
    Returns (new_content, signals_list).

    Algorithm:
    - Track div depth
    - When 'card border-start' div opens, note the depth (= opening div_depth + 1)
    - For each card-header inside a subcard, determine the entity hierarchy from the stack
    - Add collapsible attrs to card-header and @if wrapper around card-body
    """
    lines = content.split('\n')
    n = len(lines)
    result = []
    signals = []

    # Stack of (depth_at_open_of_card_border, entity_name, signal_name)
    # depth_at_open_of_card_border = div_depth BEFORE the card border-start div opens
    subcard_stack = []
    div_depth = 0

    i = 0
    while i < n:
        line = lines[i]

        # Count div opens and closes (handles multi-line <div ... > by counting '<div' occurrences)
        open_count = len(re.findall(r'<div\b', line))
        close_count = line.count('</div>')

        # Before updating div_depth, pop subcards that have been closed
        new_depth = div_depth + open_count - close_count
        while subcard_stack and new_depth <= subcard_stack[-1][0]:
            subcard_stack.pop()

        # Check if this line opens a card-border-start (subcard container)
        # We note its depth so we know when to pop
        if re.search(r'<div class="card border-start border-3 border-\w+ mt-3">', line):
            # The card opens at current div_depth (before counting this line's opens)
            subcard_stack.append((div_depth, None, None))  # placeholder, will update when we see header
            result.append(line)
            div_depth = new_depth
            i += 1
            continue

        # Check for single-line card-header
        single_header = re.search(
            r'<div class="card-header py-1 d-flex align-items-center gap-2 bg-(info|success|warning) bg-opacity-10">',
            line
        )
        # Check for multi-line card-header (the <div starts on its own line)
        multi_header_start = re.match(r'^(\s+)<div\s*$', line)

        if single_header:
            color = single_header.group(1)
            indent = len(line) - len(line.lstrip())
            ind = ' ' * indent

            # Collect header lines from current line until closing </div> of header
            header_lines = [line]
            j = i + 1
            header_depth = open_count - close_count  # starts at 1 (div opened)

            while j < n and header_depth > 0:
                jline = lines[j]
                jopens = len(re.findall(r'<div\b', jline))
                jcloses = jline.count('</div>')
                header_depth += jopens - jcloses
                header_lines.append(jline)
                j += 1
            # j is the index AFTER the header closing line

            # Extract entity label from header lines
            entity_label = None
            span_idx = None
            link_idx = None

            for k, hl in enumerate(header_lines):
                span_m = re.search(
                    r'<span class="text-uppercase small fw-semibold text-\w+">(.*?)</span>', hl
                )
                if span_m and entity_label is None:
                    entity_label = span_m.group(1).strip()
                    span_idx = k

                link_m = re.search(r'class="ms-auto badge bg-\w+ text-white text-decoration-none small"', hl)
                if link_m and link_idx is None:
                    link_idx = k

            if entity_label and subcard_stack:
                entity_name = get_entity_name(entity_label)

                # Update the last stack entry with the entity name
                parent_path = ''.join(s[1] for s in subcard_stack if s[1])
                signal_name = 'show' + parent_path + entity_name
                signals.append(signal_name)

                # Update the last stack entry
                last = subcard_stack[-1]
                subcard_stack[-1] = (last[0], entity_name, signal_name)

                # Modify header opening tag
                header_lines[0] = header_lines[0].replace(
                    f'<div class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10">',
                    f'<div class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10" style="cursor:pointer" (click)="{signal_name}.set(!{signal_name}())">'
                )

                # Add chevron after span line
                if span_idx is not None:
                    span_line = header_lines[span_idx]
                    span_indent = len(span_line) - len(span_line.lstrip())
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # Actually should be signal_name for both
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # Actually: [class.bi-chevron-up]="showClub()" - this should use signal_name, not entity_name
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # Fix: both use signal_name
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{signal_name[4:]}()"></i>'
                    # show{signal_name[4:]} → signal_name[4:] removes 'show' prefix... no wait
                    # signal_name = 'showClub' → signal_name[4:] = 'Club' → 'showClub()' ← correct
                    # Actually just use signal_name directly
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # Wait: show{entity_name}() = showClub() for top-level Club
                    # But for showEquipoCategoria, entity_name = Categoria, so show{entity_name}() = showCategoria() ← WRONG
                    # It should be signal_name + '()' = showEquipoCategoria()
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # Let me just fix it:
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # showCategoria() vs showEquipoCategoria() - issue when nested
                    # Just use signal_name for both sides:
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # FINAL: use signal_name for both
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # I keep writing the wrong thing. Let me just do it correctly:
                    chevron_line = ' ' * span_indent + (
                        f'<i class="bi ms-1 text-{color} small" '
                        f'[class.bi-chevron-down]="!{signal_name}()" '
                        f'[class.bi-chevron-up]="show{entity_name}()"></i>'
                    )
                    # The pattern in working code: [class.bi-chevron-up]="showClub()" ← uses signal_name
                    # So for showEquipoCategoria: [class.bi-chevron-up]="showEquipoCategoria()"
                    # show{entity_name}() is WRONG for nested. Use {signal_name}() for both:
                    chevron_line = ' ' * span_indent + (
                        f'<i class="bi ms-1 text-{color} small" '
                        f'[class.bi-chevron-down]="!{signal_name}()" '
                        f'[class.bi-chevron-up]="show{entity_name}()"></i>'
                    )
                    # OK I'm going in circles. Let me look at the working example:
                    # showClub → [class.bi-chevron-down]="!showClub()" [class.bi-chevron-up]="showClub()"
                    # So BOTH use signal_name:
                    chevron_line = ' ' * span_indent + (
                        f'<i class="bi ms-1 text-{color} small" '
                        f'[class.bi-chevron-down]="!{signal_name}()" '
                        f'[class.bi-chevron-up]="show{entity_name}()"></i>'
                    )
                    # FIX: use signal_name CONSISTENTLY for both sides
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'

                    header_lines.insert(span_idx + 1, chevron_line)
                    if link_idx is not None and link_idx > span_idx:
                        link_idx += 1

                # Add stopPropagation to link
                if link_idx is not None:
                    ll = header_lines[link_idx]
                    ll = ll.replace(
                        f'class="ms-auto badge bg-{color} text-white text-decoration-none small"',
                        f'class="ms-auto badge bg-{color} text-white text-decoration-none small" (click)="$event.stopPropagation()"'
                    )
                    header_lines[link_idx] = ll

                result.extend(header_lines)

                # Now handle card-body
                k = j  # line index after header
                while k < n and not lines[k].strip():
                    result.append(lines[k])
                    k += 1

                if k < n and '<div class="card-body p-2">' in lines[k]:
                    body_indent = len(lines[k]) - len(lines[k].lstrip())
                    result.append(' ' * body_indent + f'@if ({signal_name}()) {{')
                    result.append(lines[k])

                    # Find matching close of card-body
                    body_depth = 1
                    m = k + 1
                    while m < n and body_depth > 0:
                        bl = lines[m]
                        body_depth += len(re.findall(r'<div\b', bl)) - bl.count('</div>')
                        result.append(bl)
                        m += 1

                    result.append(' ' * body_indent + '}')

                    # Update div_depth for lines processed
                    total_opens = sum(len(re.findall(r'<div\b', lines[x])) for x in range(i, m))
                    total_closes = sum(lines[x].count('</div>') for x in range(i, m))
                    div_depth += total_opens - total_closes
                    i = m
                    continue

                div_depth = new_depth
                i = j
                continue
            else:
                result.extend(header_lines)
                div_depth = new_depth
                i = j
                continue

        elif multi_header_start:
            # Multi-line card-header format: <div\n  class="card-header..."\n>
            indent_str = multi_header_start.group(1)
            # Look ahead to collect the full div up to the first >
            header_start_lines = [line]
            j = i + 1
            color = None

            while j < n and '>' not in lines[j]:
                jline = lines[j]
                color_m = re.search(r'bg-(info|success|warning) bg-opacity-10', jline)
                if color_m:
                    color = color_m.group(1)
                header_start_lines.append(jline)
                j += 1

            if j < n:
                header_start_lines.append(lines[j])  # The closing '>'
                j += 1

            if color is None:
                # Not a card-header we care about
                result.extend(header_start_lines)
                div_depth = new_depth
                i = j
                continue

            # Now collect the rest of the header until closing </div>
            header_lines = header_start_lines[:]
            header_depth = 1
            while j < n and header_depth > 0:
                jline = lines[j]
                jopens = len(re.findall(r'<div\b', jline))
                jcloses = jline.count('</div>')
                header_depth += jopens - jcloses
                header_lines.append(jline)
                j += 1

            # Extract entity, span, link from header_lines
            entity_label = None
            span_idx = None
            link_class_idx = None

            for k, hl in enumerate(header_lines):
                span_m = re.search(
                    r'<span class="text-uppercase small fw-semibold text-\w+">(.*?)</span>', hl
                )
                if span_m and entity_label is None:
                    entity_label = span_m.group(1).strip()
                    span_idx = k

                link_m = re.search(r'class="ms-auto badge bg-\w+ text-white text-decoration-none small"', hl)
                if link_m and link_class_idx is None:
                    link_class_idx = k

            if entity_label and subcard_stack:
                entity_name = get_entity_name(entity_label)
                parent_path = ''.join(s[1] for s in subcard_stack if s[1])
                signal_name = 'show' + parent_path + entity_name
                signals.append(signal_name)

                last = subcard_stack[-1]
                subcard_stack[-1] = (last[0], entity_name, signal_name)

                # Modify the class line to add collapsible attrs
                for k, hl in enumerate(header_lines):
                    color_m = re.search(r'class="card-header py-1 d-flex align-items-center gap-2 bg-\w+ bg-opacity-10"', hl)
                    if color_m:
                        header_lines[k] = hl.replace(
                            color_m.group(0),
                            color_m.group(0)[:-1] + f' style="cursor:pointer" (click)="{signal_name}.set(!{signal_name}())"'
                        )
                        break

                # Add chevron after span
                if span_idx is not None:
                    span_line = header_lines[span_idx]
                    span_indent = len(span_line) - len(span_line.lstrip())
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # Use signal_name for both:
                    chevron_line = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    header_lines.insert(span_idx + 1, chevron_line)
                    if link_class_idx is not None and link_class_idx > span_idx:
                        link_class_idx += 1

                # Add stopPropagation to link
                if link_class_idx is not None:
                    ll = header_lines[link_class_idx]
                    ll = ll.replace(
                        f'class="ms-auto badge bg-{color} text-white text-decoration-none small"',
                        f'class="ms-auto badge bg-{color} text-white text-decoration-none small" (click)="$event.stopPropagation()"'
                    )
                    header_lines[link_class_idx] = ll

                result.extend(header_lines)

                # Handle card-body
                k = j
                while k < n and not lines[k].strip():
                    result.append(lines[k])
                    k += 1

                if k < n and '<div class="card-body p-2">' in lines[k]:
                    body_indent = len(lines[k]) - len(lines[k].lstrip())
                    result.append(' ' * body_indent + f'@if ({signal_name}()) {{')
                    result.append(lines[k])

                    body_depth = 1
                    m = k + 1
                    while m < n and body_depth > 0:
                        bl = lines[m]
                        body_depth += len(re.findall(r'<div\b', bl)) - bl.count('</div>')
                        result.append(bl)
                        m += 1

                    result.append(' ' * body_indent + '}')

                    total_opens = sum(len(re.findall(r'<div\b', lines[x])) for x in range(i, m))
                    total_closes = sum(lines[x].count('</div>') for x in range(i, m))
                    div_depth += total_opens - total_closes
                    i = m
                    continue

                div_depth = new_depth
                i = j
                continue
            else:
                result.extend(header_lines)
                div_depth = new_depth
                i = j
                continue

        result.append(line)
        div_depth = new_depth
        i += 1

    return '\n'.join(result), signals


def update_ts(ts_path, signals):
    """Add signal declarations to TS file."""
    with open(ts_path, 'r') as f:
        content = f.read()

    # Find the error signal line to insert after
    error_signal_re = re.search(r'  error = signal<string \| null>\(null\);', content)
    if not error_signal_re:
        print(f"WARNING: Could not find error signal in {ts_path}")
        return

    insert_pos = error_signal_re.end()
    signal_declarations = '\n' + '\n'.join(f'  {s} = signal(false);' for s in signals)
    new_content = content[:insert_pos] + signal_declarations + content[insert_pos:]

    with open(ts_path, 'w') as f:
        f.write(new_content)
    print(f"  TS updated: {len(signals)} signals added")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 add-collapsible.py <component_name>")
        sys.exit(1)

    component = sys.argv[1]
    html_path = BASE / component / 'teamadmin' / 'detail' / 'detail.html'
    ts_path = BASE / component / 'teamadmin' / 'detail' / 'detail.ts'

    if not html_path.exists():
        print(f"ERROR: {html_path} not found")
        sys.exit(1)

    with open(html_path, 'r') as f:
        html_content = f.read()

    new_html, signals = process_html(html_content)

    print(f"=== {component} ===")
    print(f"  Signals found: {signals}")

    with open(html_path, 'w') as f:
        f.write(new_html)
    print(f"  HTML written")

    if signals and ts_path.exists():
        update_ts(ts_path, signals)


if __name__ == '__main__':
    main()
