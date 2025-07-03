import fs from 'fs/promises';
import path from 'path';

const distDir = path.resolve('./dist');

async function fixImportsInFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');

  // Reemplaza imports sin extensión con extensión .js (solo rutas relativas)
  const fixedContent = content.replace(
    /import\s+([^'"]+)\s+from\s+['"](\.\/|\.\.\/[^'"]*)['"]/g,
    (match, imports, modulePath) => {
      if (modulePath.endsWith('.js')) return match; // ya tiene extensión
      return `import ${imports} from '${modulePath}.js'`;
    }
  );

  // Reemplaza exports dinámicos o estáticos también (opcional)
  const finalContent = fixedContent.replace(
    /export\s+(\{[^}]*\})\s+from\s+['"](\.\/|\.\.\/[^'"]*)['"]/g,
    (match, exports, modulePath) => {
      if (modulePath.endsWith('.js')) return match;
      return `export ${exports} from '${modulePath}.js'`;
    }
  );

  if (content !== finalContent) {
    await fs.writeFile(filePath, finalContent, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
  }
}

async function fixImportsInDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await fixImportsInDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.js')) {
      await fixImportsInFile(fullPath);
    }
  }
}

fixImportsInDir(distDir)
  .then(() => console.log('All imports fixed!'))
  .catch(console.error);
