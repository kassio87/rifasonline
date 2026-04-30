const fs = require('fs')
const path = require('path')

function fixImportsInDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && !file.name.startsWith('.')) {
        fixImportsInDir(fullPath)
      }
    } else if (file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      const originalContent = content
      
      // Corrigir imports de ../../lib/ para ../../../lib/ (se estiver em pages/api/*/)
      if (fullPath.includes('pages\\api\\') && fullPath.includes('[id]')) {
        content = content.replace(/from ['"]\.\.\.\\lib\//g, "from '../../../lib/")
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log('Fixed:', fullPath)
      }
    }
  }
}

fixImportsInDir(path.join(__dirname, 'pages'))
console.log('Done!')
