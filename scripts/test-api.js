#!/usr/bin/env node

// Script de test pour valider l'API

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Validation de la suite de tests API...\n');

// Vérifier que les fichiers de test existent
const testFiles = [
  'src/api/__tests__/client.test.ts',
  'src/api/__tests__/config.test.ts',
  'src/api/__tests__/types.test.ts',
  'src/api/__tests__/hooks/useAuth.test.tsx',
  'src/api/__tests__/hooks/useWebsites.test.tsx',
  'src/api/__tests__/integration.test.ts',
  'src/api/__tests__/performance.test.ts',
  'src/api/__tests__/use-cases.test.ts',
  'src/api/__tests__/coverage.test.ts',
];

console.log('📁 Vérification des fichiers de test...');
testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    process.exit(1);
  }
});

// Vérifier la configuration Vitest
console.log('\n⚙️  Vérification de la configuration Vitest...');
if (fs.existsSync('vitest.config.ts')) {
  console.log('✅ vitest.config.ts');
} else {
  console.log('❌ vitest.config.ts - MANQUANT');
  process.exit(1);
}

// Vérifier le setup de test
console.log('\n🔧 Vérification du setup de test...');
if (fs.existsSync('src/test/setup.ts')) {
  console.log('✅ src/test/setup.ts');
} else {
  console.log('❌ src/test/setup.ts - MANQUANT');
  process.exit(1);
}

// Vérifier les mocks
console.log('\n🎭 Vérification des mocks...');
if (fs.existsSync('src/test/mocks/server.ts')) {
  console.log('✅ src/test/mocks/server.ts');
} else {
  console.log('❌ src/test/mocks/server.ts - MANQUANT');
  process.exit(1);
}

// Vérifier les utilitaires de test
console.log('\n🛠️  Vérification des utilitaires de test...');
if (fs.existsSync('src/test/test-utils.tsx')) {
  console.log('✅ src/test/test-utils.tsx');
} else {
  console.log('❌ src/test/test-utils.tsx - MANQUANT');
  process.exit(1);
}

// Vérifier le package.json
console.log('\n📦 Vérification des dépendances...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredDevDeps = [
  'vitest',
  '@vitest/ui',
  '@testing-library/react',
  '@testing-library/jest-dom',
  '@testing-library/user-event',
  'msw',
  'jsdom',
];

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MANQUANT`);
    process.exit(1);
  }
});

// Vérifier les scripts de test
console.log('\n📜 Vérification des scripts de test...');
const testScripts = ['test', 'test:ui', 'test:run', 'test:coverage'];
testScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script}`);
  } else {
    console.log(`❌ ${script} - MANQUANT`);
    process.exit(1);
  }
});

console.log('\n🎉 Tous les tests sont prêts !');
console.log('\n📋 Commandes disponibles :');
console.log('  npm run test          - Exécuter tous les tests');
console.log('  npm run test:ui       - Interface utilisateur des tests');
console.log('  npm run test:run      - Exécuter les tests une fois');
console.log('  npm run test:coverage - Tests avec couverture de code');
console.log('\n🚀 Vous pouvez maintenant exécuter les tests !');
