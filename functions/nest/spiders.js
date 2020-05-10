const _spiders = {}
const registered = [
  'slhobie',
  'dinga',
  'chsmith',
  'surgekayaks',
  'motackle',
  'baysports',
  'findsports',
  'whitworths'
]

registered.forEach(module => {
  _spiders[module] = require(`./spiders/${module}`)[module]
})

exports.spiders = _spiders
