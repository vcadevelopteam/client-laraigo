#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function toLowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function isCamelCase(string) {
  const camelCaseRegex = /^[A-Z][a-zA-Z]*$/;
  return camelCaseRegex.test(string);
}

function createComponent(componentName) {
    const folderName = toLowerCaseFirstLetter(componentName);
    const baseDir = path.join(__dirname, 'src', 'pages', folderName);
    if (fs.existsSync(baseDir)) {
        console.error(`El componente "${componentName}" ya existe.`);
        return;
    }

    fs.mkdirSync(baseDir, { recursive: true });

    const componentFilePath = path.join(baseDir, `${componentName}.tsx`);
    const modelFilePath = path.join(baseDir, 'model.ts');
    const typeFilePath = path.join(baseDir, 'type.ts');
    const stylesFilePath = path.join(baseDir, 'styles.ts');
    
    const componentsDir = path.join(baseDir, 'components');
    const hooksDir = path.join(baseDir, 'hooks');
    
    fs.writeFileSync(componentFilePath, `import React from 'react';\n\nconst ${componentName}: React.FC<unknown> = () => {\n    return (\n        <div>\n            <h1>${componentName} Component</h1>\n        </div>\n    );\n};\n\nexport default ${componentName};\n`);
    fs.writeFileSync(modelFilePath, '// Model file for ' + componentName + '\n');
    fs.writeFileSync(typeFilePath, '// Type definitions for ' + componentName + '\n');
    fs.writeFileSync(stylesFilePath, '// Styles definitions for ' + componentName + '\n');
    
    fs.mkdirSync(componentsDir, { recursive: true });
    fs.mkdirSync(hooksDir, { recursive: true });
    
    // Crear archivos de barril (index.ts) para subcarpetas
    fs.writeFileSync(path.join(componentsDir, 'index.ts'), '// Barrel file for components\n');
    fs.writeFileSync(path.join(hooksDir, 'index.ts'), '// Barrel file for hooks\n');

    console.log(`Componente "${componentName}" creado exitosamente en: ${baseDir}`);
}

const componentName = process.argv[2];

if (!componentName) {
    console.error('Por favor, proporciona un nombre para el componente.');
    process.exit(1);
}

if (!isCamelCase(componentName)) {
  console.error('El nombre del componente debe estar en CamelCase (ejemplo: MyComponent).');
  process.exit(1);
}

createComponent(componentName);
