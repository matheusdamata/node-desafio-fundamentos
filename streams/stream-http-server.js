import assert from 'assert'
import http from 'node:http'
import fs from 'node:fs/promises'

const srcPath = new URL('../src/csv', import.meta.url)

const server = http.createServer(async (req, res) => {
  const buffers = []

  process.stdout.write('start\n')
  for await (const chunk of req) {
    // process.stdout.write(`${chunk.join(',')}\n`)
    buffers.push(chunk)
    console.log('Body: ', chunk.toString())

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  assert.strictEqual(buffers.length, buffers.length)

  req.body = Buffer.concat(buffers).toString()
  console.log('Stream Content: ', String(req.body))

  try {
    fs.mkdir(srcPath)
      .then(() => {
        console.log('Created directory')
      })
      .catch((error) => {
        if (error.code === 'EEXIST') {
          return console.log('Directory already exists')
        }

        console.error(error)
      })
  } catch (error) {
    req.body = null
  }

  res.end(req.body)
})

server.listen(5555)
