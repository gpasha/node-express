const path = require('path')
const fs = require('fs')
// const main = require('main')

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'card.json'
)
class Card {
    static async add(course) {
        const card = await Card.fetch()

        const index = card.courses.findIndex(c => c.id === course.id)
        const condidate = card.courses[index]

        if (condidate) {
            //exist
            condidate.count++
            card.courses[index] = condidate
        } else {
            //should add
            course.count=1
            card.courses.push(course)
        }
        card.price += +course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) reject(err)
                else resolve(JSON.parse(content))
            })
        })
    }
}

module.exports = Card