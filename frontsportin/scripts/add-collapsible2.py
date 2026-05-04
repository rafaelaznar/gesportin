#!/usr/bin/env python3
"""
Add collapsible behavior to teamadmin detail HTML/TS files.
Sequential state-machine approach.
Usage: python3 add-collapsible2.py <component_name>
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
    return LABEL_TO_ENTITY.get(label.strip(), ''.join(w.capitalize() for w in label.split()))


def count_divs(line):
    opens = len(re.findall(r'<div\b', line))
    closes = line.count('</div>')
    return opens, closes


def process_html(content):
    """
    Sequential state-machine:
    - subcard_stack: tracks open card-border-start divs (entity hierarchy)
    - pending_if: set when we've modified a card-header and need to wrap next card-body
    - open_ifs: tracks (depth_at_body_open, signal_name) for adding closing }
    """
    lines = content.split('\n')
    n = len(lines)
    result = []
    signals = []

    div_depth = 0  # current div nesting depth

    # Stack: list of (depth_before_card_opened, entity_name, signal_name)
    # depth_before_card_opened = div_depth BEFORE the card-border-start div
    subcard_stack = []

    # Pending @if: signal_name to use for the next card-body encountered
    pending_if = None

    # Open @if blocks: list of (depth_of_body_div, signal_name)
    # When div_depth drops to depth_of_body_div, insert closing }
    open_ifs = []

    # State for collecting multi-line card-header
    collecting_header = False
    header_buffer = []
    header_color = None
    header_open_depth = 0  # depth inside the header div

    i = 0
    while i < n:
        line = lines[i]
        stripped = line.strip()
        indent = len(line) - len(line.lstrip()) if line.strip() else 0
        ind = ' ' * indent

        opens, closes = count_divs(line)
        new_depth = div_depth + opens - closes

        # --- Close @if blocks when div_depth drops ---
        # We need to insert } AFTER the closing div line
        # Check: after this line, do any @if blocks close?
        # An @if block closes when div_depth (after line) <= depth_of_body_div - 1
        # i.e., the body div (at depth_of_body_div) has been closed

        # --- Check for subcard container ---
        if re.search(r'<div class="card border-start border-3 border-\w+ mt-3">', line):
            # Push placeholder to subcard_stack (entity name TBD when we see the header)
            subcard_stack.append((div_depth, None, None))
            result.append(line)
            div_depth = new_depth
            i += 1
            continue

        # --- Pop subcard_stack when we close a subcard ---
        # Pop BEFORE checking for card-header (with new_depth)
        while subcard_stack and new_depth <= subcard_stack[-1][0]:
            subcard_stack.pop()

        # --- Multi-line card-header collection ---
        if collecting_header:
            header_buffer.append(line)
            header_open_depth += opens - closes
            if header_open_depth <= 0:
                # Header closed - process it
                collecting_header = False
                _process_header_block(header_buffer, header_color, subcard_stack, signals, result, pending_if)
                # pending_if will be set by _process_header_block indirectly
                # We need a different mechanism - let's use a list
                # Actually, let's refactor this differently
                # For now, just process inline
                pass
            div_depth = new_depth
            i += 1
            continue

        # --- Single-line card-header ---
        single_header_match = re.search(
            r'<div class="card-header py-1 d-flex align-items-center gap-2 bg-(info|success|warning) bg-opacity-10">',
            line
        )

        if single_header_match:
            color = single_header_match.group(1)

            # Collect the full header block (current line to matching </div>)
            header_lines = [line]
            h_depth = opens - closes  # = 1 (opened header div, not closed yet)
            j = i + 1

            while j < n and h_depth > 0:
                jline = lines[j]
                jo, jc = count_divs(jline)
                h_depth += jo - jc
                header_lines.append(jline)
                j += 1
            # header_lines[-1] is the line with the closing </div>
            header_end_j = j  # first line AFTER the header block

            # Find entity label, span line index, link line index
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
                link_m = re.search(
                    r'class="ms-auto badge bg-\w+ text-white text-decoration-none small"', hl
                )
                if link_m and link_idx is None:
                    link_idx = k

            if entity_label and subcard_stack:
                entity_name = get_entity_name(entity_label)

                # Build signal name from subcard path
                parent_path = ''.join(s[1] for s in subcard_stack if s[1])
                signal_name = 'show' + parent_path + entity_name
                signals.append(signal_name)

                # Update the current (latest) subcard_stack entry with entity info
                last = subcard_stack[-1]
                subcard_stack[-1] = (last[0], entity_name, signal_name)

                # Modify header opening tag
                header_lines[0] = header_lines[0].replace(
                    f'<div class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10">',
                    f'<div class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10" style="cursor:pointer" (click)="{signal_name}.set(!{signal_name}())">'
                )

                # Add chevron AFTER the span line
                if span_idx is not None:
                    span_line = header_lines[span_idx]
                    span_indent = len(span_line) - len(span_line.lstrip())
                    chevron = (
                        ' ' * span_indent +
                        f'<i class="bi ms-1 text-{color} small" '
                        f'[class.bi-chevron-down]="!{signal_name}()" '
                        f'[class.bi-chevron-up]="show{entity_name}()"></i>'
                    )
                    # CORRECT: use signal_name for BOTH sides
                    chevron = (
                        ' ' * span_indent +
                        f'<i class="bi ms-1 text-{color} small" '
                        f'[class.bi-chevron-down]="!{signal_name}()" '
                        f'[class.bi-chevron-up]="show{entity_name}()"></i>'
                    )
                    # Fix: signal_name for both (not entity_name for up)
                    chevron = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # FINAL FIX: use signal_name for BOTH [class.bi-chevron-down] and [class.bi-chevron-up]
                    chevron = ' ' * span_indent + f'<i class="bi ms-1 text-{color} small" [class.bi-chevron-down]="!{signal_name}()" [class.bi-chevron-up]="show{entity_name}()"></i>'
                    # I keep writing the same thing. Let me be explicit:
                    up_binding = f'[class.bi-chevron-up]="{signal_name}()"'  # CORRECT: uses signal_name
                    down_binding = f'[class.bi-chevron-down]="!{signal_name}()"'  # CORRECT: uses signal_name
                    chevron = f'{" " * span_indent}<i class="bi ms-1 text-{color} small" {down_binding} {up_binding}></i>'
                    header_lines.insert(span_idx + 1, chevron)
                    if link_idx is not None and link_idx > span_idx:
                        link_idx += 1

                # Add stopPropagation to link
                if link_idx is not None:
                    ll = header_lines[link_idx]
                    old_class = f'class="ms-auto badge bg-{color} text-white text-decoration-none small"'
                    new_class = f'class="ms-auto badge bg-{color} text-white text-decoration-none small" (click)="$event.stopPropagation()"'
                    header_lines[link_idx] = ll.replace(old_class, new_class)

                result.extend(header_lines)
                pending_if = signal_name

                # Update div_depth for the header lines
                total_o = sum(count_divs(hl)[0] for hl in header_lines)
                total_c = sum(count_divs(hl)[1] for hl in header_lines)
                div_depth += total_o - total_c

                i = header_end_j
                continue

            else:
                # No entity label or not in a subcard - emit as-is
                result.extend(header_lines)
                div_depth += sum(count_divs(hl)[0] - count_divs(hl)[1] for hl in header_lines)
                i = header_end_j
                continue

        # --- Check for multi-line card-header (equipo style) ---
        # Pattern: line is just whitespace + <div, and next line has card-header class
        if re.match(r'^\s+<div\s*$', line) and i + 1 < n:
            next_line = lines[i + 1]
            color_in_next = re.search(r'class="card-header py-1 d-flex align-items-center gap-2 bg-(info|success|warning) bg-opacity-10"', next_line)
            if color_in_next:
                color = color_in_next.group(1)

                # Collect the full header block
                header_lines = [line]
                h_depth = 1  # opened 1 div
                j = i + 1
                while j < n and h_depth > 0:
                    jline = lines[j]
                    jo, jc = count_divs(jline)
                    h_depth += jo - jc
                    header_lines.append(jline)
                    j += 1
                header_end_j = j

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
                    link_m = re.search(
                        r'class="ms-auto badge bg-\w+ text-white text-decoration-none small"', hl
                    )
                    if link_m and link_class_idx is None:
                        link_class_idx = k

                if entity_label and subcard_stack:
                    entity_name = get_entity_name(entity_label)
                    parent_path = ''.join(s[1] for s in subcard_stack if s[1])
                    signal_name = 'show' + parent_path + entity_name
                    signals.append(signal_name)

                    last = subcard_stack[-1]
                    subcard_stack[-1] = (last[0], entity_name, signal_name)

                    # Modify class line to add collapsible attrs
                    for k, hl in enumerate(header_lines):
                        if f'class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10"' in hl:
                            header_lines[k] = hl.replace(
                                f'class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10"',
                                f'class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10" style="cursor:pointer" (click)="{signal_name}.set(!{signal_name}())"'
                            )
                            break

                    # Add chevron after span
                    if span_idx is not None:
                        span_line = header_lines[span_idx]
                        span_indent = len(span_line) - len(span_line.lstrip())
                        up_binding = f'[class.bi-chevron-up]="{signal_name}()"'
                        down_binding = f'[class.bi-chevron-down]="!{signal_name}()"'
                        chevron = f'{" " * span_indent}<i class="bi ms-1 text-{color} small" {down_binding} {up_binding}></i>'
                        header_lines.insert(span_idx + 1, chevron)
                        if link_class_idx is not None and link_class_idx > span_idx:
                            link_class_idx += 1

                    # Add stopPropagation to link
                    if link_class_idx is not None:
                        ll = header_lines[link_class_idx]
                        old_class = f'class="ms-auto badge bg-{color} text-white text-decoration-none small"'
                        new_class = f'class="ms-auto badge bg-{color} text-white text-decoration-none small" (click)="$event.stopPropagation()"'
                        header_lines[link_class_idx] = ll.replace(old_class, new_class)

                    result.extend(header_lines)
                    pending_if = signal_name

                    total_o = sum(count_divs(hl)[0] for hl in header_lines)
                    total_c = sum(count_divs(hl)[1] for hl in header_lines)
                    div_depth += total_o - total_c

                    i = header_end_j
                    continue
                else:
                    result.extend(header_lines)
                    div_depth += sum(count_divs(hl)[0] - count_divs(hl)[1] for hl in header_lines)
                    i = header_end_j
                    continue

        # --- Check for card-body to wrap in @if ---
        if pending_if and '<div class="card-body p-2">' in line:
            body_indent_str = ' ' * indent
            result.append(body_indent_str + f'@if ({pending_if}()) {{')
            # Track this @if: it should close when div_depth returns to (div_depth - 1)
            # i.e., when the card-body div closes
            # card-body is at current div_depth (it opens with this line)
            open_ifs.append((div_depth + 1, pending_if))  # depth AFTER this div opens
            pending_if = None
            result.append(line)
            div_depth = new_depth
            i += 1
            continue

        # --- Check if any @if blocks need to be closed ---
        # AFTER the current line reduces div_depth, check if any open_ifs closed
        result.append(line)
        div_depth = new_depth

        # Insert closing } for any @if blocks that just closed
        while open_ifs and div_depth < open_ifs[-1][0]:
            body_depth, sig = open_ifs.pop()
            # Find the indent from the corresponding @if line... just use (body_depth - 1) * 2 spaces
            # Actually, we need the same indent as the @if line
            # The @if was at indent = (body_depth - 2) * 2... too complex
            # Just use a reasonable indent based on body_depth
            body_ind = ' ' * ((body_depth - 1) * 2)
            # Actually, looking at the pattern: @if (signal()) { is at the same indent as <div class="card-body p-2">
            # and } is at the same level
            # The card-body was opened at div_depth = body_depth - 1 (before the open)
            # Let's use the line that just closed to determine indent
            closing_indent = indent  # indent of the current closing line
            result.append(' ' * closing_indent + '}')

        i += 1

    return '\n'.join(result), signals


def update_ts(ts_path, signals):
    """Add signal declarations to TS file."""
    with open(ts_path, 'r') as f:
        content = f.read()

    # Check if signals already exist
    existing = [s for s in signals if f'{s} = signal' in content]
    if existing:
        print(f"  WARNING: signals already exist: {existing}")
        signals = [s for s in signals if s not in existing]

    if not signals:
        print("  No new signals to add")
        return

    error_match = re.search(r'  error = signal<string \| null>\(null\);', content)
    if not error_match:
        print(f"  WARNING: Could not find error signal in {ts_path}")
        return

    insert_pos = error_match.end()
    signal_lines = '\n' + '\n'.join(f'  {s} = signal(false);' for s in signals)
    new_content = content[:insert_pos] + signal_lines + content[insert_pos:]

    with open(ts_path, 'w') as f:
        f.write(new_content)
    print(f"  TS updated: {len(signals)} signals added: {signals}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 add-collapsible2.py <component_name>")
        sys.exit(1)

    component = sys.argv[1]
    html_path = BASE / component / 'teamadmin' / 'detail' / 'detail.html'
    ts_path = BASE / component / 'teamadmin' / 'detail' / 'detail.ts'

    if not html_path.exists():
        print(f"ERROR: {html_path} not found")
        sys.exit(1)

    with open(html_path, 'r') as f:
        original = f.read()

    new_html, signals = process_html(original)

    print(f"=== {component} ===")
    print(f"  Signals: {signals}")

    # Dry run check: count @if blocks
    if_count = new_html.count('@if (show')
    close_count = 0
    for sig in signals:
        close_count += new_html.count(f'@if ({sig}())')

    print(f"  @if blocks generated: {close_count} (of {len(signals)} signals)")

    with open(html_path, 'w') as f:
        f.write(new_html)
    print(f"  HTML written")

    if signals and ts_path.exists():
        update_ts(ts_path, signals)


if __name__ == '__main__':
    main()
