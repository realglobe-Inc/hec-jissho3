const model = 'Photo'
const seed = []
module.exports = {
  model, seed
}

if (!module.parent) {
  console.log(`[${model}Seed]`, JSON.stringify(seed, null, 2))
}
