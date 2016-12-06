const uuid = require('uuid')

const model = 'User'
const seed = [{
  id: 1,
  key: 'edac',
  uuid: uuid.v4()
}, {
  id: 2,
  key: 'realglobe',
  uuid: uuid.v4()
}, {
  id: 3,
  key: 'demo',
  uuid: uuid.v4()
}]

module.exports = {
  model, seed
}

if (!module.parent) {
  console.log(`[${model}Seed]`, JSON.stringify(seed, null, 2))
}
