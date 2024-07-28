const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const username = 'eanton71'
const dbName = 'phonebookDB'
const url =
    `mongodb+srv://${username}:${password}@cluster19070.wvq4dny.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster19070`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const newName = process.argv[3]
const newNumber = process.argv[4]
const person = new Person({
    name: newName,
    number: newNumber,
})
if (process.argv[3] && process.argv[4]) {
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}