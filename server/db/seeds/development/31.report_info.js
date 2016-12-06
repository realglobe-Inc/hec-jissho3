const model = 'ReportInfo'
const formatter = require('@self/helper/formatter')

let now = new Date()
const seed = (new Array(3 * 3)).fill(1).map((v, i) => v + i).map((i) => {
  return {
    id: i,
    report_full_id: formatter.toReportFullId({actorKey: `qq:reporter:${i % 3 + 1}`, reportId: i % 3 + 1}),
    lat: 35.701474 + 0.01 * Math.random(),
    lng: 139.752771 + 0.01 * Math.random(),
    event: 'emergency',
    date: new Date(now - i * 1000),
    info: {
      heart: 10
    }
  }
})

module.exports = {
  model, seed
}

if (!module.parent) {
  console.log(`[${model}Seed]`, JSON.stringify(seed, null, 2))
}
