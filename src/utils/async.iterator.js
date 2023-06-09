import assert from 'assert'
import { generate } from 'csv-generate'
import { parse } from 'csv-parse'
;(async () => {
  const parser = generate({
    high_water_mark: 64 * 64,
    length: 100,
  }).pipe(parse())

  let count = 0

  process.stdout.write('start\n')

  for await (const record of parser) {
    process.stdout.write(`${count++} ${record.join(',')}\n`)

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  process.stdout.write('...done\n')

  assert.strictEqual(count, 100)
})()
