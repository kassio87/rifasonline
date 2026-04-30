const fs = require('fs')
const path = require('path')

function walkDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && !file.name.startsWith('.')) {
        walkDir(fullPath)
      }
    } else if (file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      const original = content
      
      // Conta quantos níveis até a raiz (Pages dir)
      const relativePath = path.relative(path.join(__dirname, 'pages'), fullPath)
      const depth = relativePath.split(path.sep).length - 1
      
      // Se o arquivo está em pages/api/algumaCoisa/[id].js, precisa de 3 níveis: ../../../
      // Se está em pages/api/algumaCoisa/index.js, precisa de 2 níveis: ../../
      let requiredLevels
      if (fullPath.includes('\\pages\\api\\')) {
        const afterApi = fullPath.split('\\pages\\api\\')[1]
        const slashCount = (afterApi.match(/\\/g) || []).length
        requiredLevels = slashCount + 2 // +2 para sair de pages/api/xxx/
      } else {
        requiredLevels = depth
      }
      
      const correctPrefix = '../'.repeat(requiredLevels)
      
      // Substitui imports incorretos
      content = content.replace(
        /from\s+['"](\.\.\/)+lib\//g, 
        `from '${correctPrefix}lib/`
      )
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log(`Fixed: ${fullPath}`)
      }
    }
  }
}

walkDir(path.join(__dirname, 'pages'))
console.log('All imports fixed!')
