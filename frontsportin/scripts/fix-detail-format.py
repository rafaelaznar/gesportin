#!/usr/bin/env python3
"""
Fix code formatting in all admin/detail/detail.html files to match jugador reference:
1. Spinner: inline → multi-line
2. Counter rows: inline @if/@else → multi-line Angular formatter style
"""
import re
import os

BASE = "/home/rafa/Projects/2026/gesportin/frontsportin/src/app/component"

ENTITIES = [
    "articulo", "carrito", "categoria", "club", "comentario", "comentarioart",
    "compra", "cuota", "equipo", "estadopartido", "factura", "liga", "noticia",
    "pago", "partido", "puntuacion", "rolusuario", "temporada", "tipoarticulo",
    "tipousuario", "usuario"
]

# Pattern for inline counter row:
# (INDENT)<div class="col-7 fw-semibold small">@if ((COND ?? 0) > 0) { <a [routerLink]="[ROUTE]" class="text-decoration-none">{{ VAL }}</a> } @else { 0 }</div>
COUNTER_RE = re.compile(
    r'^( *)<div class="col-7 fw-semibold small">'
    r'@if \((.*?) > 0\) \{ '
    r'<a \[routerLink\]="(\[.*?\])" class="text-decoration-none">'
    r'(\{\{ .+? \}\})'
    r'<\/a> \} @else \{ 0 \}'
    r'<\/div>$'
)


def build_counter_block(indent, cond, route, val):
    """Build multi-line counter block matching jugador Angular formatter style."""
    i0 = indent
    i2 = indent + "  "
    i4 = indent + "    "
    i6 = indent + "      "
    i8 = indent + "        "

    full_cond = f"{cond} > 0"

    has_ternary = "session.isClubAdmin()" in route

    if has_ternary:
        # Break the array across lines
        inner = route[1:-1]  # remove outer [ ]
        last_comma = inner.rfind(", ")
        if last_comma != -1:
            first_part = inner[:last_comma]
            second_part = inner[last_comma + 2:]
            route_lines = [
                f"{i6}[routerLink]=\"[",
                f"{i8}{first_part},",
                f"{i8}{second_part},",
                f"{i6}]\"",
            ]
        else:
            route_lines = [f"{i6}[routerLink]=\"{route}\""]
    else:
        route_lines = [f"{i6}[routerLink]=\"{route}\""]

    lines = [
        f'{i0}<div class="col-7 fw-semibold small">',
        f"{i2}@if ({full_cond}) {{",
        f"{i4}<a",
        *route_lines,
        f'{i6}class="text-decoration-none"',
        f"{i6}>{val}</a",
        f"{i4}>",
        f"{i2}}} @else {{",
        f"{i4}0",
        f"{i2}}}",
        f"{i0}</div>",
    ]
    return "\n".join(lines)


def fix_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    original = content

    # Fix 1: spinner format (inline → multi-line)
    content = content.replace(
        '<div class="spinner-border text-primary" role="status">'
        '<span class="visually-hidden">Cargando...</span></div>',
        '<div class="spinner-border text-primary" role="status">\n'
        '        <span class="visually-hidden">Cargando...</span>\n'
        '      </div>',
    )

    # Fix 2: inline counter rows → multi-line
    lines = content.split("\n")
    result = []
    for line in lines:
        m = COUNTER_RE.match(line)
        if m:
            indent = m.group(1)
            cond = m.group(2)   # e.g., "(oEntity()?.counter ?? 0)"
            route = m.group(3)  # e.g., "['/path', entity?.id]"
            val = m.group(4)    # e.g., "{{ entity?.counter }}"
            result.append(build_counter_block(indent, cond, route, val))
        else:
            result.append(line)

    content = "\n".join(result)

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False


def main():
    changed = []
    unchanged = []
    missing = []

    for entity in ENTITIES:
        filepath = os.path.join(BASE, entity, "admin", "detail", "detail.html")
        if not os.path.exists(filepath):
            missing.append(entity)
            continue
        if fix_file(filepath):
            changed.append(entity)
        else:
            unchanged.append(entity)

    print(f"\n✅ Changed ({len(changed)}): {', '.join(changed)}")
    print(f"⏭  Unchanged ({len(unchanged)}): {', '.join(unchanged)}")
    if missing:
        print(f"❌ Missing ({len(missing)}): {', '.join(missing)}")


if __name__ == "__main__":
    main()
