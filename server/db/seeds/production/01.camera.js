const uuid = require('uuid')
const generateToken = require('@self/helper/generate_token')
const { camera } = require('@self/env')

const model = 'Camera'

const seed = [ camera ]

module.exports = {
  model, seed
}

if (!module.parent) {
  console.log(`[${model}Seed]`, JSON.stringify(seed, null, 2))
}
