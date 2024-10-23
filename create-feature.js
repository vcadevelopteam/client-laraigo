const { execSync } = require('child_process');

// Verifica si se proporcionó un código para la nueva rama
const branchCode = process.argv[2];

if (!branchCode) {
  console.error('Error: No se proporcionó un código para la rama.');
  console.error('Uso: npm run feature <codigo>');
  process.exit(1);
}

const branch = 'develop';

try {
  // Cambiar a la rama develop
  console.log(`Cambiando a la rama ${branch}...`);
  execSync(`git checkout ${branch}`, { stdio: 'inherit' });

  // Traer los últimos cambios de develop
  console.log(`Obteniendo los últimos cambios de ${branch}...`);
  execSync(`git fetch origin ${branch}`, { stdio: 'inherit' });
  execSync(`git pull origin ${branch}`, { stdio: 'inherit' });

  // Verificar si la rama feature/#codigo ya existe localmente
  const existingBranches = execSync('git branch --list').toString().trim().split('\n');
  const featureBranchName = `feature/${branchCode}`;
  
  if (existingBranches.includes(`  ${featureBranchName}`)) {
    console.error(`Error: La rama ${featureBranchName} ya existe localmente.`);
    process.exit(1);
  }

  // Verificar si la rama feature/#codigo ya existe en origin
  const existingRemoteBranches = execSync('git branch -r').toString().trim().split('\n');
  const remoteFeatureBranchName = `origin/${featureBranchName}`;
  
  if (existingRemoteBranches.includes(remoteFeatureBranchName)) {
    console.error(`Error: La rama ${featureBranchName} ya existe en el repositorio remoto.`);
    process.exit(1);
  }

  // Crear la nueva rama feature/#codigo
  console.log(`Creando la nueva rama ${featureBranchName}...`);
  execSync(`git checkout -b ${featureBranchName}`, { stdio: 'inherit' });

  console.log(`Rama ${featureBranchName} creada exitosamente desde ${branch}.`);
} catch (error) {
  console.error('Error al crear la rama:', error.message);
  process.exit(1);
}
