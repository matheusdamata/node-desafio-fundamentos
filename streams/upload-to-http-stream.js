import { Readable } from 'node:stream'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const databasePath = new URL('../db.json', import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const csvFolderPath = path.join(__dirname, '../src/csv')

let db = []

fs.readFile(databasePath, 'utf-8').then((data) => {
  db = JSON.parse(data)
  console.log(db.tasks)
})

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > db.tasks.length) {
        this.push(null)
      } else {
        const buff = Buffer.from(
          JSON.stringify({
            // id: i,
            title: db.tasks[i - 1].title,
            description: db.tasks[i - 1].description,
          }),
        )

        this.push(buff)
      }
    }, 1000)
  }
}

fetch('http://localhost:5555', {
  method: 'POST',
  body: new OneToHundredStream(),
  duplex: 'half',
})
  .then(async (response) => {
    return response.text()
  })
  .then(async (data) => {
    console.log('Entrou no data: ' + data)
    fs.writeFile(`${csvFolderPath}/create_CSV.csv`, JSON.stringify(data))
  })
