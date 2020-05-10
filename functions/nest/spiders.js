const _spiders = {}
const registered = [
  'slhobie',
  'dinga',
  'chsmith'
]

registered.forEach(module => {
  _spiders[module] = require(`./spiders/${module}`)[module]
})

console.log(_spiders)
exports.spiders = _spiders
