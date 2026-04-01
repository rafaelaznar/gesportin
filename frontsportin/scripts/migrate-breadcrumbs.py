#!/usr/bin/env python3
"""
Script para migrar breadcrumbs de components a pages en la app teamadmin.
Paso 1: Eliminar <app-breadcrumb> de los HTMLs de los componentes.
Paso 2: Eliminar lógica de breadcrumb de los TS de los componentes.
Paso 3: Añadir breadcrumb a las páginas que no lo tienen.
"""

import os
import re

FRONTEND = '/home/rafa/Projects/2026/gesportin/frontsportin/src/app'
COMP_DIR = os.path.join(FRONTEND, 'component')
PAGE_DIR = os.path.join(FRONTEND, 'page')

# ============================================================
# PASO 1: Limpiar HTMLs de componentes teamadmin
# ============================================================

def clean_component_html(filepath):
    """Remove app-breadcrumb from component HTML templates"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Pattern 1: @if (showBreadcrumb) { ... }
    # Could span multiple lines
    content = re.sub(
        r'\s*@if \(showBreadcrumb\) \{\s*\n\s*<app-breadcrumb[^>]*></app-breadcrumb>\s*\n\s*\}\n?',
        '\n',
        content
    )
    
    # Pattern 2: Direct <app-breadcrumb ...></app-breadcrumb>
    content = re.sub(
        r'\s*<app-breadcrumb[^>]*></app-breadcrumb>\n?',
        '\n',
        content
    )
    
    # Clean up extra blank lines (max 2 consecutive)
    content = re.sub(r'\n{3,}', '\n\n', content)
    # Remove leading blank lines
    content = content.lstrip('\n')
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  HTML cleaned: {filepath.replace(FRONTEND+'/', '')}")
        return True
    return False


# ============================================================
# PASO 2: Limpiar TS de componentes teamadmin
# ============================================================

def clean_component_ts(filepath):
    """Remove breadcrumb imports, signals, showBreadcrumb input from component TS"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Remove BreadcrumbItem from import from '../../../shared/breadcrumb/breadcrumb'
    # or from '../../shared/breadcrumb/breadcrumb'
    # Pattern: import { ..., BreadcrumbComponent, BreadcrumbItem, ... }
    # We need to remove BreadcrumbComponent and BreadcrumbItem from the import
    
    def remove_breadcrumb_imports(m):
        imports = m.group(1)
        items = [x.strip() for x in imports.split(',')]
        items = [x for x in items if x not in ('BreadcrumbComponent', 'BreadcrumbItem')]
        if not items:
            return ''  # Remove entire import line
        return f"import {{ {', '.join(items)} }}{m.group(2)}"
    
    # Pattern for: import { ..., BreadcrumbComponent, BreadcrumbItem } from '...'
    content = re.sub(
        r"import \{([^}]+)\}(.*breadcrumb.*)\n",
        remove_breadcrumb_imports,
        content
    )
    
    # Remove empty import lines that might result
    content = re.sub(r'import \{\s*\}[^\n]*\n', '', content)
    
    # Remove BreadcrumbComponent from @Component's imports array
    content = re.sub(r',?\s*BreadcrumbComponent\s*,?', 
                     lambda m: ',' if m.group(0).count(',') == 2 else '',
                     content)
    # Clean up double commas or leading/trailing commas in imports array
    content = re.sub(r'\[([^]]*)\]', 
                     lambda m: '[' + re.sub(r',\s*,', ',', m.group(1).strip().strip(',').strip()) + ']',
                     content)
    
    # Remove @Input() showBreadcrumb = true; (or any variant)
    content = re.sub(r'\s*@Input\(\)\s*showBreadcrumb\s*=\s*[^;]+;\n?', '\n', content)
    
    # Remove breadcrumbItems signal declaration (multi-line)
    # Pattern: breadcrumbItems = signal<BreadcrumbItem[]>([ ... ]);
    content = re.sub(
        r'\s*breadcrumbItems\s*=\s*signal<BreadcrumbItem\[\]>\(\[[\s\S]*?\]\);\n?',
        '\n',
        content
    )
    
    # Remove this.breadcrumbItems.set([...]) calls (multi-line)
    content = re.sub(
        r'\s*this\.breadcrumbItems\.set\(\[[\s\S]*?\]\);\n?',
        '\n',
        content
    )
    
    # Clean up extra blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  TS cleaned: {filepath.replace(FRONTEND+'/', '')}")
        return True
    return False


# ============================================================
# PASO 3: Actualizar páginas para añadir breadcrumb
# ============================================================

# Map: entity name -> default breadcrumb items for each page type
BREADCRUMB_ITEMS = {
    'articulo': {
        'plist': "[{ label: 'Artículos' }]",
        'view': "[{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Artículo' }]",
        'new': "[{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Nuevo Artículo' }]",
        'edit': "[{ label: 'Artículos', route: '/articulo/teamadmin' }, { label: 'Editar Artículo' }]",
    },
    'carrito': {
        'view': "[{ label: 'Carritos', route: '/carrito/teamadmin' }, { label: 'Carrito' }]",
        'plist': "[{ label: 'Carritos' }]",
    },
    'categoria': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías' }]",
        'view': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Categoría' }]",
        'new':  "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Nueva Categoría' }]",
        'edit': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Editar Categoría' }]",
    },
    'club': {
        'plist': "[{ label: 'Mis Clubes' }]",
        'view': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Club' }]",
    },
    'comentarioart': {
        'plist': "[{ label: 'Comentarios de Artículos' }]",
        'view': "[{ label: 'Comentarios de Artículos', route: '/comentarioart/teamadmin' }, { label: 'Comentario' }]",
    },
    'comentario': {
        'plist': "[{ label: 'Comentarios' }]",
        'view': "[{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Comentario' }]",
        'new':  "[{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Nuevo Comentario' }]",
        'edit': "[{ label: 'Comentarios', route: '/comentario/teamadmin' }, { label: 'Editar Comentario' }]",
    },
    'compra': {
        'plist': "[{ label: 'Compras' }]",
        'view': "[{ label: 'Compras', route: '/compra/teamadmin' }, { label: 'Compra' }]",
        'new':  "[{ label: 'Compras', route: '/compra/teamadmin' }, { label: 'Nueva Compra' }]",
        'edit': "[{ label: 'Compras', route: '/compra/teamadmin' }, { label: 'Editar Compra' }]",
    },
    'cuota': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas' }]",
        'view': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Cuota' }]",
        'new':  "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Nueva Cuota' }]",
        'edit': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Editar Cuota' }]",
    },
    'equipo': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos' }]",
        'view': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Equipo' }]",
        'new':  "[{ label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Nuevo Equipo' }]",
        'edit': "[{ label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Editar Equipo' }]",
    },
    'factura': {
        'plist': "[{ label: 'Facturas' }]",
        'view': "[{ label: 'Facturas', route: '/factura/teamadmin' }, { label: 'Factura' }]",
        'new':  "[{ label: 'Facturas', route: '/factura/teamadmin' }, { label: 'Nueva Factura' }]",
        'edit': "[{ label: 'Facturas', route: '/factura/teamadmin' }, { label: 'Editar Factura' }]",
    },
    'jugador': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Jugadores' }]",
        'view': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Jugadores', route: '/jugador/teamadmin' }, { label: 'Jugador' }]",
        'new':  "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Jugadores', route: '/jugador/teamadmin' }, { label: 'Nuevo Jugador' }]",
        'edit': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Jugadores', route: '/jugador/teamadmin' }, { label: 'Editar Jugador' }]",
    },
    'liga': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas' }]",
        'view': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Liga' }]",
        'new':  "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Nueva Liga' }]",
        'edit': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Editar Liga' }]",
    },
    'noticia': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Noticias' }]",
        'view': "[{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Noticia' }]",
        'new':  "[{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Nueva Noticia' }]",
        'edit': "[{ label: 'Noticias', route: '/noticia/teamadmin' }, { label: 'Editar Noticia' }]",
    },
    'pago': {
        'plist': "[{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Pagos' }]",
        'view': "[{ label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Pagos', route: '/pago/teamadmin' }, { label: 'Pago' }]",
        'new':  "[{ label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Pagos', route: '/pago/teamadmin' }, { label: 'Nuevo Pago' }]",
        'edit': "[{ label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Pagos', route: '/pago/teamadmin' }, { label: 'Editar Pago' }]",
    },
    'partido': {
        'plist': "[{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Partidos' }]",
        'view': "[{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Partidos', route: '/partido/teamadmin' }, { label: 'Partido' }]",
        'new':  "[{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Partidos', route: '/partido/teamadmin' }, { label: 'Nuevo Partido' }]",
        'edit': "[{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Partidos', route: '/partido/teamadmin' }, { label: 'Editar Partido' }]",
    },
    'puntuacion': {
        'plist': "[{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Puntuaciones' }]",
        'view': "[{ label: 'Ligas', route: '/liga/teamadmin' }, { label: 'Puntuaciones', route: '/puntuacion/teamadmin' }, { label: 'Puntuación' }]",
    },
    'temporada': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas' }]",
        'view': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Temporada' }]",
        'new':  "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Nueva Temporada' }]",
        'edit': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Temporadas', route: '/temporada/teamadmin' }, { label: 'Editar Temporada' }]",
    },
    'tipoarticulo': {
        'plist': "[{ label: 'Tipos de Artículo' }]",
        'view': "[{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Tipo de Artículo' }]",
        'new':  "[{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Nuevo Tipo' }]",
        'edit': "[{ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' }, { label: 'Editar Tipo' }]",
    },
    'usuario': {
        'plist': "[{ label: 'Mis Clubes', route: '/club/teamadmin' }, { label: 'Usuarios' }]",
        'view': "[{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Usuario' }]",
        'new':  "[{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Nuevo Usuario' }]",
        'edit': "[{ label: 'Usuarios', route: '/usuario/teamadmin' }, { label: 'Editar Usuario' }]",
    },
}

def update_page_ts(filepath, entity, view_type):
    """Add BreadcrumbComponent and breadcrumbItems to a page TS file"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content

    # Check if already has BreadcrumbComponent  
    if 'BreadcrumbComponent' in content:
        # Already done - just make sure format is right
        return False
    
    items = BREADCRUMB_ITEMS.get(entity, {}).get(view_type)
    if not items:
        print(f"  WARNING: No breadcrumb items defined for {entity}/{view_type}")
        return False
    
    # Add import for BreadcrumbComponent,BreadcrumbItem
    # Find existing imports from shared/breadcrumb, or add after last import
    breadcrumb_import = "import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';"
    
    # Adjust relative path based on depth
    depth = filepath.count('/page/') 
    # page/<entity>/teamadmin/<view>/<file>.ts - that's 4 levels deep from page/
    breadcrumb_import = "import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';"
    
    # Add breadcrumb import after the last import statement
    last_import_match = list(re.finditer(r'^import .+;$', content, re.MULTILINE))
    if last_import_match:
        last_import = last_import_match[-1]
        insert_pos = last_import.end()
        content = content[:insert_pos] + '\n' + breadcrumb_import + content[insert_pos:]
    
    # Add BreadcrumbComponent to @Component imports array
    content = re.sub(
        r'(@Component\(\{[^}]*imports:\s*\[)([^\]]*?)(\])',
        lambda m: m.group(1) + m.group(2).rstrip() + (', ' if m.group(2).strip() else '') + 'BreadcrumbComponent' + m.group(3),
        content,
        flags=re.DOTALL
    )
    
    # Add breadcrumbItems signal property
    # Add it inside the class body, after the class declaration
    # Find position after class declaration opening
    class_body_match = re.search(r'(export class \w+[^{]*\{)', content)
    if class_body_match:
        insert_pos = class_body_match.end()
        breadcrumb_prop = f"\n  breadcrumbItems = signal<BreadcrumbItem[]>({items});\n"
        content = content[:insert_pos] + breadcrumb_prop + content[insert_pos:]
    
    # Make sure signal is imported from @angular/core
    if "'signal'" not in content and 'signal' not in content.split('@angular/core')[1][:50] if '@angular/core' in content else True:
        content = re.sub(
            r"(import \{[^}]*)\} from '@angular/core'",
            lambda m: m.group(1).rstrip().rstrip(',') + ', signal }' + " from '@angular/core'",
            content
        )
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  Page TS updated: {filepath.replace(FRONTEND+'/', '')}")
        return True
    return False


def update_page_html_add_breadcrumb(filepath):
    """Add <app-breadcrumb> to page HTML if not already there"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'app-breadcrumb' in content:
        return False  # Already has breadcrumb
    
    original = content
    
    # Add breadcrumb as first child of the wrapping div
    content = re.sub(
        r'(<div[^>]*>)\n',
        r'\1\n  <app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb>\n',
        content,
        count=1
    )
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  Page HTML updated: {filepath.replace(FRONTEND+'/', '')}")
        return True
    return False


def update_page_template_inline(filepath, entity, view_type):
    """For pages with inline template, prepend breadcrumb to template string"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'app-breadcrumb' in content:
        return False
    
    original = content
    
    # Pattern: template: '<app-something ...>'
    # We need to prepend the breadcrumb to the template
    content = re.sub(
        r"(template:\s*')<app-",
        r"\1<app-breadcrumb [items]=\"breadcrumbItems()\"></app-breadcrumb><app-",
        content
    )
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  Page template updated: {filepath.replace(FRONTEND+'/', '')}")
        return True
    return False


def remove_showbreadcrumb_from_page_html(filepath):
    """Remove [showBreadcrumb]="false" binding from page HTML"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    content = re.sub(r'\s*\[showBreadcrumb\]="false"', '', content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  Removed showBreadcrumb: {filepath.replace(FRONTEND+'/', '')}")
        return True
    return False


# ============================================================
# Main execution
# ============================================================

def find_component_files():
    """Find all teamadmin component HTML/TS files with app-breadcrumb"""
    result = []
    for root, dirs, files in os.walk(COMP_DIR):
        if 'teamadmin' in root or 'plist-teamadmin' in root:
            for fname in files:
                if fname.endswith('.html') or fname.endswith('.ts'):
                    if not fname.endswith('.spec.ts') and not fname.endswith('.css'):
                        fpath = os.path.join(root, fname)
                        result.append(fpath)
    return result


def main():
    print("=== STEP 1: Clean component HTML files ===")
    for root, dirs, files in os.walk(COMP_DIR):
        for fname in files:
            if fname.endswith('.html') and ('teamadmin' in root or 'plist-teamadmin' in root):
                fpath = os.path.join(root, fname)
                clean_component_html(fpath)

    print("\n=== STEP 2: Clean component TS files ===")
    for root, dirs, files in os.walk(COMP_DIR):
        for fname in files:
            if fname.endswith('.ts') and not fname.endswith('.spec.ts') and ('teamadmin' in root or 'plist-teamadmin' in root):
                fpath = os.path.join(root, fname)
                clean_component_ts(fpath)

    print("\n=== STEP 3: Update page TS files ===")
    for root, dirs, files in os.walk(PAGE_DIR):
        for fname in files:
            if fname.endswith('.ts') and not fname.endswith('.spec.ts'):
                # Extract entity and view type from path
                # Path: .../page/<entity>/teamadmin/<viewtype>/file.ts
                parts = root.replace(PAGE_DIR + '/', '').split('/')
                if len(parts) >= 3 and parts[1] == 'teamadmin':
                    entity = parts[0]
                    view_type = parts[2]
                    fpath = os.path.join(root, fname)
                    update_page_ts(fpath, entity, view_type)

    print("\n=== STEP 4: Update page HTML files ===")
    for root, dirs, files in os.walk(PAGE_DIR):
        for fname in files:
            if fname.endswith('.html'):
                parts = root.replace(PAGE_DIR + '/', '').split('/')
                if len(parts) >= 3 and parts[1] == 'teamadmin':
                    fpath = os.path.join(root, fname)
                    update_page_html_add_breadcrumb(fpath)
    
    print("\n=== STEP 5: Update inline page templates ===")
    for root, dirs, files in os.walk(PAGE_DIR):
        for fname in files:
            if fname.endswith('.ts') and not fname.endswith('.spec.ts'):
                parts = root.replace(PAGE_DIR + '/', '').split('/')
                if len(parts) >= 3 and parts[1] == 'teamadmin':
                    entity = parts[0]
                    view_type = parts[2]
                    fpath = os.path.join(root, fname)
                    update_page_template_inline(fpath, entity, view_type)

    print("\n=== STEP 6: Remove [showBreadcrumb]=false from page HTML ===")
    for root, dirs, files in os.walk(PAGE_DIR):
        for fname in files:
            if fname.endswith('.html'):
                fpath = os.path.join(root, fname)
                remove_showbreadcrumb_from_page_html(fpath)

    print("\nDone!")


if __name__ == '__main__':
    main()
