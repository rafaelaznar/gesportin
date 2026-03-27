const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log('Created', filePath);
}

function initEntity(entity) {
  const name = entity.toLowerCase();
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);
  const base = path.resolve(__dirname, '..', 'src', 'app');

  const componentBase = path.join(base, 'component', name, 'admin');
  const pageAdminBase = path.join(base, 'page', name, 'admin');
  const pageTeamAdminBase = path.join(base, 'page', name, 'teamadmin', 'plist');

  ensureDir(componentBase);
  ensureDir(pageAdminBase);
  ensureDir(pageTeamAdminBase);

  const samplePlist = `import { Component, signal } from '@angular/core';\nimport { ${pascal}Service } from '../../../../service/${name}';\n// TODO: adapt entity-specific logic\n\n@Component({ standalone: true, selector: 'app-${name}-admin-plist', template: '<div>${pascal} list</div>' })\nexport class ${pascal}AdminPlist { }\n`;
  writeFile(path.join(componentBase, 'plist', 'plist.ts'), samplePlist);

  const samplePage = `import { Component } from '@angular/core';\nimport { ${pascal}AdminPlist } from '../../../../component/${name}/admin/plist/plist';\n@Component({ selector: 'app-${name}-admin-plist-page', imports: [${pascal}AdminPlist], template: '<app-${name}-admin-plist></app-${name}-admin-plist>' })\nexport class ${pascal}AdminPlistPage { }\n`;
  writeFile(path.join(pageAdminBase, 'plist', 'plist.ts'), samplePage);
}

if (require.main === module) {
  const [entity] = process.argv.slice(2);
  if (!entity) {
    console.error('Usage: node generate-entity.js <entityname>');
    process.exit(1);
  }
  initEntity(entity);
}
