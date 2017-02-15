const formatter = require('../../../helper/formatter')
const model = 'Report'
const seed = [1, 2, 3].map((i) => {
  let actorKey = `qq:reporter:${i}`
  let reportId = i
  return {
    id: i,
    report_full_id: formatter.toReportFullId({actorKey, reportId}),
    actor_key: actorKey,
    report_id: reportId,
    is_open: true,
    report_at: new Date(),
    closed_at: null
  }
})

module.exports = {
  model, seed
}

if (!module.parent) {
  console.log(`[${model}Seed]`, JSON.stringify(seed, null, 2))
}
