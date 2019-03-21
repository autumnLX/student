const fs = require('fs')

const excludeList = ['.vscode', 'build', 'dist', 'node_modules', 'test']
const base = './'
const readdir = dir => {
  fs.readdirSync(dir).forEach(name => {
    if (excludeList.indexOf(name) < 0 && name[0] !== '.') {
      const path = dir + name
      fs.stat(path, (err, stats) => {
        if (err) throw err

        if (stats.isFile()) {
          fs.readFile(path, (err, data) => {
            if (err) throw err

            const content = data.toString()
            const m = content.match(/驰声听说在线/g)
            if (m) {
              fs.writeFile(
                path,
                content.replace(/驰声听说在线/g, '咔咪英语'),
                err => {
                  if (err) throw err
                }
              )
            }
          })
        } else if (stats.isDirectory()) {
          readdir(path + '/')
        } else {
          console.log('unknown file: ' + path)
        }
      })
    }
  })
}

console.log('build for kami')
readdir(base)
