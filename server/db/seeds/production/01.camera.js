const uuid = require('uuid')
const generateToken = require('@self/server/helper/generate_token')
const { camera } = require('@self/server/env')

const model = 'Camera'

const seed = [ camera ]

module.exports = {
  model, seed
}

if (!module.parent) {
  console.log(`[${model}Seed]`, JSON.stringify(seed, null, 2))
}
