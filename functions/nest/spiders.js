const _spiders = {}
const registered = [
  'slhobie',
  'dinga',
  'chsmith',
  'surgekayaks',
  'motackle',
  'baysports',
  'findsports',
  'whitworths',
  'dreamkayaks',
  'anacondastores',
  'weekendwarrior',
  'boatingcentral',
  'kayaksandsups',
  'arnoldsboatshop',
  'blackhawkoutdoor',
  'paddlesportsmegastore',
  'theboatwarehouse',
  'adelaidecanoeworks',
  'kayaks2fish'
]

registered.forEach(module => {
  _spiders[module] = require(`./spiders/${module}`)[module]
})

exports.spiders = _spiders
