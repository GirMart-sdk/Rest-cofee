// .lintstagedrc.js
module.exports = {
  // Lint y formatea archivos TypeScript/JavaScript en el sub-proyecto 'server'
  'hostal-cofre/server/**/*.{ts,js}': [
    'npx prettier --write', // Primero formatea
    'npm run lint:fix --prefix hostal-cofre/server', // Luego ejecuta el linter
  ],
  // Lint y formatea archivos TypeScript/React en el sub-proyecto 'client'
  'hostal-cofre/client/**/*.{ts,tsx,js,jsx}': [
    'npx prettier --write',
    'npm run lint:fix --prefix hostal-cofre/client',
  ],
  // Formatea archivos Markdown en la raíz del proyecto
  '*.md': 'npx prettier --write',
  // Formatea el archivo package.json en la raíz del proyecto
  'package.json': 'npx prettier --write',
};
