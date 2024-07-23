const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
app.use(morgan(':method :url :body'))
morgan.token('body', request => JSON.stringify(request.body))
let persons =[
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
const generateId = () => {

    return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name ||!body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: body.name,
        number:  body.number,
        id: generateId(),
    }
    const personExists = persons.find(person => person.name === body.name)
    if (personExists) {
        return response.status(400).json({
            error: 'User ' + personExists.name + ' is in database '
        })
    }
    persons = persons.concat(person)
    response.json(person)
})
app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
})
app.get('/info', (request, response) => {
    const resp = '<p>Phonebook has info for ' + persons.length + ' people</p>'
        + '\n' + new Date().toString();
    response.send(resp);
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)


    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
});
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})