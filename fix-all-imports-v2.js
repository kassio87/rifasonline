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
      
      // 计算从当前文件到项目根目录的层级数
      const relativePath = path.relative(path.join(__dirname, 'pages'), fullPath)
      const depth = relativePath.split(path.sep).length - 1
      
      // 对于 pages/admin-cliente/xxx.js，需要 ../../lib/api
      // 对于 pages/api/xxx/[id].js，需要 ../../../lib/xxx
      let requiredLevels
      
      if (fullPath.includes('\\pages\\admin-cliente\\') || fullPath.includes('\\pages\\admin-sistema\\')) {
        requiredLevels = 2 // ../
      } else if (fullPath.includes('\\pages\\api\\')) {
        const afterApi = fullPath.split('\\pages\\api\\')[1]
        const slashCount = (afterApi.match(/\\/g) || []).length
        requiredLevels = slashCount + 2 // +2 用于离开 pages/api/xxx/
      } else if (fullPath.includes('\\pages\\')) {
        requiredLevels = depth
      } else {
        continue
      }
      
      const correctPrefix = '../'.repeat(requiredLevels)
      
      // 替换不正确的导入
      content = content.replace(
        /from\s+['"](\.\.\/)+lib\//g, 
        `from '${correctPrefix}lib/`
      )
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log(`Fixed: ${fullPath}`)
      }
    }
  }
}

fixImportsInDir(path.join(__dirname, 'pages'))
console.log('All imports fixed!')
