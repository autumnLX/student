function create(path) {
  return `
  [submodule "src/ui"]
    path = src/ui
    url = ${path}`
}
module.exports = create
