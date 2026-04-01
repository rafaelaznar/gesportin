#!/usr/bin/env python3
"""
Fix breadcrumb migration errors:
1. Remove duplicate 'signal' imports in page TS files
2. Remove leftover BreadcrumbItem/breadcrumbItems code from component TS files
3. Add BreadcrumbComponent to delete page TS files
"""
import re
from pathlib import Path

BASE = Path(__file__).parent.parent / 'src' / 'app'

# ==============================================================
# Step 1: Fix duplicate 'signal' imports in ALL page TS files
# ==============================================================
print("=== STEP 1: Fix duplicate 'signal' imports ===")
for ts_file in (BASE / 'page').rglob('*.ts'):
    content = ts_file.read_text()
    # Replace 'signal, signal' with just 'signal' (with varying spacing)
    new_content = re.sub(r'\bsignal,\s*signal\b', 'signal', content)
    if new_content != content:
        ts_file.write_text(new_content)
        print(f"  Fixed duplicate signal: {ts_file.relative_to(BASE)}")

# ==============================================================
# Step 2: Fix component TS files with leftover breadcrumb logic
# ==============================================================
print("\n=== STEP 2: Fix component TS leftover breadcrumb logic ===")

def remove_service_block_from_ngoninit(content, service_name, condition_pattern):
    """
    Remove a service call block from ngOnInit that looks like:
    if (condition) {
      service.get(...).subscribe({
        next: (...) => { ... this.breadcrumbItems.set ... },
        error: () => {},
      });
    }
    Uses brace counting to find the end of the block.
    """
    # Find the position of the if block
    match = re.search(condition_pattern, content)
    if not match:
        return content
    
    start = match.start()
    # Find the opening brace after the 'if (...)' 
    brace_pos = content.index('{', start)
    # Count braces to find the end
    depth = 0
    end = brace_pos
    while end < len(content):
        if content[end] == '{':
            depth += 1
        elif content[end] == '}':
            depth -= 1
            if depth == 0:
                end += 1
                break
        end += 1
    
    # Include trailing newline/semicolon
    while end < len(content) and content[end] in ' \t':
        end += 1
    if end < len(content) and content[end] == '\n':
        end += 1
    
    block = content[start:end]
    # Check this block actually contains breadcrumb logic
    if 'breadcrumbItems' not in block and 'BreadcrumbItem' not in block:
        return content
    
    new_content = content[:start] + content[end:]
    return new_content


def remove_injection(content, var_name, service_class):
    """Remove an injection line like: private varName = inject(ServiceClass);"""
    pattern = rf'\s*private {re.escape(var_name)}\s*=\s*inject\({re.escape(service_class)}\).*?;\n'
    new_content = re.sub(pattern, '\n', content)
    # Also handle without 'private':
    pattern2 = rf'\s*{re.escape(var_name)}\s*=\s*inject\({re.escape(service_class)}\).*?;\n'
    new_content = re.sub(pattern2, '\n', new_content)
    return new_content


def remove_import(content, service_class):
    """Remove an import statement for a specific class."""
    # Match single-symbol imports
    pattern = rf"^import \{{ {re.escape(service_class)} \}} from .*?;\n"
    new_content = re.sub(pattern, '', content, flags=re.MULTILINE)
    return new_content


def remove_implements_onInit(content):
    """Remove 'implements OnInit' from class declaration."""
    new_content = re.sub(r'\s+implements OnInit\b', '', content)
    return new_content


def remove_from_angular_import(content, symbol):
    """Remove a symbol from angular/core import."""
    # Handle 'symbol, ' or ', symbol' patterns
    new_content = re.sub(rf',?\s*\b{re.escape(symbol)}\b\s*,?', lambda m: '' if m.group().strip() in [symbol, f'{symbol},', f', {symbol}', f'{symbol} ,'] else m.group(), content)
    # More targeted: remove from @angular/core import
    def replace_core_import(m):
        imports_str = m.group(1)
        symbols = [s.strip() for s in imports_str.split(',')]
        symbols = [s for s in symbols if s != symbol]
        return f"import {{ {', '.join(symbols)} }} from '@angular/core';"
    new_content = re.sub(
        r"import \{([^}]+)\} from '@angular/core';",
        replace_core_import,
        new_content
    )
    return new_content


def remove_entire_ngoninit(content):
    """Remove an entire ngOnInit method if it contains only breadcrumb logic."""
    match = re.search(r'  ngOnInit\(\):\s*void\s*\{', content)
    if not match:
        match = re.search(r'  ngOnInit\(\)\s*\{', content)
    if not match:
        return content
    
    start = match.start()
    brace_pos = content.index('{', match.end() - 1)
    depth = 0
    end = brace_pos
    while end < len(content):
        if content[end] == '{':
            depth += 1
        elif content[end] == '}':
            depth -= 1
            if depth == 0:
                end += 1
                break
        end += 1
    
    method_body = content[start:end]
    
    # Only remove if body contains breadcrumb logic (all it does)
    if 'breadcrumbItems' not in method_body and 'BreadcrumbItem' not in method_body:
        return content
    
    # Include trailing newline
    while end < len(content) and content[end] in ' \t':
        end += 1
    if end < len(content) and content[end] == '\n':
        end += 1
    
    new_content = content[:start] + content[end:]
    return new_content


# --- File: cuota/teamadmin/plist/plist.ts ---
f = BASE / 'component/cuota/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_entire_ngoninit(content)
content = remove_injection(content, 'oEquipoService', 'EquipoService')
content = remove_import(content, 'EquipoService')
content = remove_implements_onInit(content)
content = remove_from_angular_import(content, 'OnInit')
content = remove_from_angular_import(content, 'inject')
content = remove_from_angular_import(content, 'signal')
# Clean up double blank lines
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/cuota/teamadmin/plist/plist.ts")

# --- File: pago/teamadmin/plist/plist.ts ---
f = BASE / 'component/pago/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_entire_ngoninit(content)
content = remove_injection(content, 'oCuotaService', 'CuotaService')
content = remove_import(content, 'CuotaService')
content = remove_implements_onInit(content)
content = remove_from_angular_import(content, 'OnInit')
content = remove_from_angular_import(content, 'inject')
content = remove_from_angular_import(content, 'signal')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/pago/teamadmin/plist/plist.ts")

# --- File: jugador/teamadmin/plist/plist.ts ---
f = BASE / 'component/jugador/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_entire_ngoninit(content)
content = remove_injection(content, 'oEquipoService', 'EquipoService')
content = remove_injection(content, 'oUsuarioService', 'UsuarioService')
content = remove_import(content, 'EquipoService')
content = remove_import(content, 'UsuarioService')
content = remove_implements_onInit(content)
content = remove_from_angular_import(content, 'OnInit')
content = remove_from_angular_import(content, 'inject')
content = remove_from_angular_import(content, 'signal')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/jugador/teamadmin/plist/plist.ts")

# --- File: partido/teamadmin/plist/plist.ts ---
f = BASE / 'component/partido/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_entire_ngoninit(content)
content = remove_injection(content, 'oLigaService', 'LigaService')
content = remove_import(content, 'LigaService')
content = remove_implements_onInit(content)
content = remove_from_angular_import(content, 'OnInit')
content = remove_from_angular_import(content, 'inject')
content = remove_from_angular_import(content, 'signal')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/partido/teamadmin/plist/plist.ts")

# --- File: equipo/teamadmin/plist/plist.ts (partial ngOnInit removal) ---
f = BASE / 'component/equipo/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_service_block_from_ngoninit(content, 'oCategoriaService', r'if \(this\.categoria > 0\)')
content = remove_injection(content, 'oCategoriaService', 'CategoriaService')
content = remove_import(content, 'CategoriaService')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/equipo/teamadmin/plist/plist.ts")

# --- File: noticia/teamadmin/plist/plist.ts (partial ngOnInit removal) ---
f = BASE / 'component/noticia/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_service_block_from_ngoninit(content, 'clubService', r'if \(this\.id_club\)\s*\{')
content = remove_injection(content, 'clubService', 'ClubService')
content = remove_import(content, 'ClubService')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/noticia/teamadmin/plist/plist.ts")

# --- File: usuario/teamadmin/plist/plist.ts (partial ngOnInit removal) ---
f = BASE / 'component/usuario/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_service_block_from_ngoninit(content, 'clubService', r'if \(this\.id_club\)\s*\{')
content = remove_injection(content, 'clubService', 'ClubService')
content = remove_import(content, 'ClubService')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/usuario/teamadmin/plist/plist.ts")

# --- File: temporada/teamadmin/plist/plist.ts (partial ngOnInit removal) ---
f = BASE / 'component/temporada/teamadmin/plist/plist.ts'
content = f.read_text()
content = remove_service_block_from_ngoninit(content, 'clubService', r'if \(this\.id_club\)\s*\{')
content = remove_injection(content, 'clubService', 'ClubService')
content = remove_import(content, 'ClubService')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/temporada/teamadmin/plist/plist.ts")

# --- File: liga/plist-teamadmin-unrouted (partial ngOnInit removal) ---
f = BASE / 'component/liga/plist-teamadmin-unrouted/liga-plist-teamadmin-unrouted.ts'
content = f.read_text()
content = remove_service_block_from_ngoninit(content, 'oEquipoService', r'if \(this\.equipo\(\) > 0\)')
content = remove_injection(content, 'oEquipoService', 'EquipoService')
content = remove_import(content, 'EquipoService')
content = re.sub(r'\n{3,}', '\n\n', content)
f.write_text(content)
print(f"  Fixed: component/liga/plist-teamadmin-unrouted/liga-plist-teamadmin-unrouted.ts")


# ==============================================================
# Step 3: Add BreadcrumbComponent to teamadmin delete page TS files
# ==============================================================
print("\n=== STEP 3: Fix delete page TS files ===")

BREADCRUMB_ITEMS_DELETE = {
    'liga': "[{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Eliminar Liga' }]",
    'categoria': "[{ label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Eliminar Categoría' }]",
    'tipoarticulo': "[{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Eliminar Tipo de Artículo' }]",
    'comentario': "[{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Eliminar Comentario' }]",
    'equipo': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Eliminar Equipo' }]",
    'noticia': "[{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Eliminar Noticia' }]",
    'jugador': "[{ label: 'Jugadores', route: '/jugador/teamadmin' }, { label: 'Eliminar Jugador' }]",
    'partido': "[{ label: 'Partidos', route: '/partido/teamadmin' }, { label: 'Eliminar Partido' }]",
    'usuario': "[{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Eliminar Usuario' }]",
    'temporada': "[{ label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Eliminar Temporada' }]",
    'pago': "[{ label: 'Pagos', route: '/pago/teamadmin' }, { label: 'Eliminar Pago' }]",
    'articulo': "[{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Eliminar Artículo' }]",
    'cuota': "[{ label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Eliminar Cuota' }]",
    'compra': "[{ label: 'Compras', route: '/compra/teamadmin' }, { label: 'Eliminar Compra' }]",
}

delete_pages = sorted((BASE / 'page').glob('*/teamadmin/delete/delete.ts'))

for ts_path in delete_pages:
    entity = ts_path.parts[-4]  # e.g. 'articulo'
    
    # Check if already has BreadcrumbComponent
    content = ts_path.read_text()
    if 'BreadcrumbComponent' in content:
        continue
    
    if entity not in BREADCRUMB_ITEMS_DELETE:
        print(f"  WARNING: No breadcrumb items for {entity}/delete - skipping")
        continue
    
    items = BREADCRUMB_ITEMS_DELETE[entity]
    
    # Add import for BreadcrumbComponent
    # Find last import line and add after it
    last_import_match = list(re.finditer(r'^import .+;\n', content, re.MULTILINE))
    if not last_import_match:
        print(f"  WARNING: No imports found in {ts_path.relative_to(BASE)}")
        continue
    
    last_import_end = last_import_match[-1].end()
    breadcrumb_import = "import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';\n"
    content = content[:last_import_end] + breadcrumb_import + content[last_import_end:]
    
    # Add BreadcrumbComponent to imports array
    content = re.sub(
        r'(imports:\s*\[)([^\]]+)(\])',
        lambda m: m.group(1) + m.group(2) + ', BreadcrumbComponent' + m.group(3),
        content
    )
    
    # Add breadcrumbItems signal after class opening (after 'signal(' lines or before first property)
    # Find where to insert: after the signal/error declarations at top of class
    # Insert breadcrumbItems after first `signal<` usage or after class declaration
    signal_match = re.search(r'(  error = signal<[^>]+>\([^)]*\);\n)', content)
    if signal_match:
        insert_pos = signal_match.end()
        breadcrumb_prop = f"  breadcrumbItems = signal<BreadcrumbItem[]>({items});\n"
        content = content[:insert_pos] + breadcrumb_prop + content[insert_pos:]
    else:
        # Insert after class opening line
        class_match = re.search(r'export class \w+ [^{]*\{', content)
        if class_match:
            insert_pos = class_match.end() + 1  # after { and newline
            breadcrumb_prop = f"  breadcrumbItems = signal<BreadcrumbItem[]>({items});\n"
            content = content[:insert_pos] + breadcrumb_prop + content[insert_pos:]
    
    ts_path.write_text(content)
    print(f"  Fixed delete page: {ts_path.relative_to(BASE)}")

print("\nDone!")
