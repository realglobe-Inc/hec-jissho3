const uuid = require('uuid')
const generateToken = require('../../../helper/generate_token')
const { camera } = require('../../../env')

const model = 'Camera'
const seed = [1, 2, 3].map((i) => ({
  id: i,
  name: `camera-${i}`,
  token: generateToken(),
  ownerId: i,
  uuid: uuid.v4()
})).concat(camera)

module.exports = {
  model, seed
}

if (!module.parent) {
  console.log(`[${model}Seed]`, JSON.stringify(seed, null, 2))
}
