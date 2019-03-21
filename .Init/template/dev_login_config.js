function create(host, port) {
  return `
  module.exports = {
    host: '${host}',
    port: ${port}
  }
  `
}
module.exports = create
