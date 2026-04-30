#!/usr/bin/env python3
"""
Add collapsible behavior to teamadmin detail HTML/TS files.
Sequential state-machine: processes lines one by one, tracks div depth and subcard stack.
Usage: python3 add-collapsible3.py <component_name>
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
}


def entity_name(label):
    return LABEL_TO_ENTITY.get(label.strip(), ''.join(w.capitalize() for w in label.split()))


def div_delta(line):
    return len(re.findall(r'<div\b', line)) - line.count('</div>')


def collect_header_block(lines, start, first_delta):
    """Collect lines from start until the opened div closes. Returns (header_lines, next_idx)."""
    block = [lines[start]]
    depth = first_delta  # net after start line (should be +1 for single-line open)
    j = start + 1
    while j < len(lines) and depth > 0:
        depth += div_delta(lines[j])
        block.append(lines[j])
        j += 1
    return block, j


def extract_header_info(header_lines):
    """Return (entity_label, span_idx, link_idx, color) from a card-header block."""
    entity_label = None
    span_idx = None
    link_idx = None
    color = None

    for k, hl in enumerate(header_lines):
        if color is None:
            cm = re.search(r'bg-(info|success|warning) bg-opacity-10', hl)
            if cm:
                color = cm.group(1)
        if entity_label is None:
            sm = re.search(r'<span class="text-uppercase small fw-semibold text-\w+">(.*?)</span>', hl)
            if sm:
                entity_label = sm.group(1).strip()
                span_idx = k
        if link_idx is None:
            lm = re.search(r'class="ms-auto badge bg-\w+ text-white text-decoration-none small"', hl)
            if lm:
                link_idx = k

    return entity_label, span_idx, link_idx, color


def modify_header(header_lines, signal_name, entity, color, span_idx, link_idx):
    """In-place modify header_lines to add collapsible behavior. Returns new header_lines."""
    lines = list(header_lines)

    # 1. Add style/click to card-header div (first line that has the card-header class)
    for k, hl in enumerate(lines):
        if f'class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10"' in hl:
            lines[k] = hl.replace(
                f'class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10"',
                f'class="card-header py-1 d-flex align-items-center gap-2 bg-{color} bg-opacity-10" style="cursor:pointer" (click)="{signal_name}.set(!{signal_name}())"'
            )
            break

    # 2. Insert chevron after span line
    if span_idx is not None:
        span_line = lines[span_idx]
        ind = ' ' * (len(span_line) - len(span_line.lstrip()))
        chevron = (
            f'{ind}<i class="bi ms-1 text-{color} small" '
            f'[class.bi-chevron-down]="!{signal_name}()" '
            f'[class.bi-chevron-up]="{signal_name}()"></i>'
        )
        lines.insert(span_idx + 1, chevron)
        if link_idx is not None and link_idx > span_idx:
            link_idx += 1

    # 3. Add stopPropagation to badge link
    if link_idx is not None:
        ll = lines[link_idx]
        old = f'class="ms-auto badge bg-{color} text-white text-decoration-none small"'
        new = f'class="ms-auto badge bg-{color} text-white text-decoration-none small" (click)="$event.stopPropagation()"'
        lines[link_idx] = ll.replace(old, new)

    return lines


def process_html(content):
    src = content.split('\n')
    out = []
    signals = []

    # div_depth: cumulative div nesting depth
    div_depth = 0

    # subcard_stack: list of (depth_before_card_opened, entity_name_or_None, signal_name_or_None)
    subcard_stack = []

    # pending_if: set to a signal_name when we need to wrap the next card-body
    pending_if = None

    # open_ifs: list of (depth_after_body_opened, signal_name, body_indent)
    # closed when div_depth drops below depth_after_body_opened
    open_ifs = []

    i = 0
    while i < len(src):
        line = src[i]
        delta = div_delta(line)
        new_depth = div_depth + delta

        # ── Card border-start container ───────────────────────────────────────
        if re.search(r'<div class="card border-start border-3 border-\w+ mt-3">', line):
            subcard_stack.append((div_depth, None, None))
            out.append(line)
            div_depth = new_depth
            i += 1
            continue

        # ── Pop subcard stack entries that are now closed ─────────────────────
        # (runs for non-card-border-start lines that reduce depth)
        while subcard_stack and new_depth <= subcard_stack[-1][0]:
            subcard_stack.pop()

        # ── Single-line card-header ────────────────────────────────────────────
        single_m = re.search(
            r'<div class="card-header py-1 d-flex align-items-center gap-2 bg-(info|success|warning) bg-opacity-10">',
            line
        )
        if single_m:
            color = single_m.group(1)
            header_block, next_i = collect_header_block(src, i, delta)
            lbl, span_idx, link_idx, _ = extract_header_info(header_block)

            if lbl and subcard_stack:
                ent = entity_name(lbl)
                parent = ''.join(s[1] for s in subcard_stack if s[1])
                sig = 'show' + parent + ent
                signals.append(sig)
                # Update the placeholder entry for the current subcard
                t = subcard_stack[-1]
                subcard_stack[-1] = (t[0], ent, sig)
                header_block = modify_header(header_block, sig, ent, color, span_idx, link_idx)
                pending_if = sig

            out.extend(header_block)
            div_depth += sum(div_delta(h) for h in header_block)
            i = next_i
            continue

        # ── Multi-line card-header (equipo-style: <div alone, class on next line) ──
        if re.match(r'^\s+<div\s*$', line) and i + 1 < len(src):
            next_line = src[i + 1]
            ml_color_m = re.search(
                r'class="card-header py-1 d-flex align-items-center gap-2 bg-(info|success|warning) bg-opacity-10"',
                next_line
            )
            if ml_color_m:
                color = ml_color_m.group(1)
                # delta for the opening line is +1 (one <div, no </div>)
                header_block, next_i = collect_header_block(src, i, 1)
                lbl, span_idx, link_idx, _ = extract_header_info(header_block)

                if lbl and subcard_stack:
                    ent = entity_name(lbl)
                    parent = ''.join(s[1] for s in subcard_stack if s[1])
                    sig = 'show' + parent + ent
                    signals.append(sig)
                    t = subcard_stack[-1]
                    subcard_stack[-1] = (t[0], ent, sig)
                    header_block = modify_header(header_block, sig, ent, color, span_idx, link_idx)
                    pending_if = sig

                out.extend(header_block)
                div_depth += sum(div_delta(h) for h in header_block)
                i = next_i
                continue

        # ── Card-body: wrap with @if ──────────────────────────────────────────
        if pending_if and '<div class="card-body p-2">' in line:
            ind = ' ' * (len(line) - len(line.lstrip()))
            out.append(f'{ind}@if ({pending_if}()) {{')
            open_ifs.append((new_depth, pending_if, ind))
            pending_if = None
            out.append(line)
            div_depth = new_depth
            i += 1
            continue

        # ── Default: emit line ────────────────────────────────────────────────
        out.append(line)
        div_depth = new_depth

        # After emitting, check if any @if blocks just closed
        while open_ifs and div_depth < open_ifs[-1][0]:
            _, _, body_ind = open_ifs.pop()
            out.append(f'{body_ind}}}')

        i += 1

    return '\n'.join(out), signals


def update_ts(ts_path, signals):
    with open(ts_path, 'r') as f:
        content = f.read()

    new_sigs = [s for s in signals if f'{s} = signal' not in content]
    if not new_sigs:
        print('  No new TS signals needed')
        return

    m = re.search(r'  error = signal<string \| null>\(null\);', content)
    if not m:
        print(f'  WARNING: error signal anchor not found in {ts_path}')
        return

    decls = '\n' + '\n'.join(f'  {s} = signal(false);' for s in new_sigs)
    new_content = content[:m.end()] + decls + content[m.end():]
    with open(ts_path, 'w') as f:
        f.write(new_content)
    print(f'  TS: added {len(new_sigs)} signals: {new_sigs}')


def main():
    if len(sys.argv) < 2:
        print('Usage: python3 add-collapsible3.py <component_name>')
        sys.exit(1)

    comp = sys.argv[1]
    html_path = BASE / comp / 'teamadmin' / 'detail' / 'detail.html'
    ts_path   = BASE / comp / 'teamadmin' / 'detail' / 'detail.ts'

    if not html_path.exists():
        print(f'ERROR: {html_path} not found')
        sys.exit(1)

    with open(html_path) as f:
        original = f.read()

    new_html, signals = process_html(original)

    print(f'=== {comp} ===')
    print(f'  Signals detected: {signals}')
    print(f'  @if blocks added: {new_html.count("@if (show")}')

    with open(html_path, 'w') as f:
        f.write(new_html)
    print(f'  HTML written: {html_path}')

    if signals and ts_path.exists():
        update_ts(ts_path, signals)
    elif not ts_path.exists():
        print(f'  WARNING: TS file not found: {ts_path}')


if __name__ == '__main__':
    main()
