require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use(morgan(':method :url :body'))
morgan.token('body', request => JSON.stringify(request.body))
//morgan configuration end
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)



app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (body.number === undefined ||body.name ===  undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error)
    )
})
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})
app.get('/info', (request, response,next) => {
  Person.countDocuments({})
    .then(length => {
      response.send(`<p>Phonebook has info for ${length} people</p>`)
    })
    .catch(error => next(error))
    //const resp = '<p>Phonebook has info for ' + persons.length + ' people</p>'
  //     + '\n' + new Date().toString();
  // response.send(resp);
})
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})
/**
 * Controlador peticion delete person
 */
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const { name,number } = request.body

  /*
   const person = {
        name: body.name,
        number: body.number,
    }
        */

  Person.findByIdAndUpdate(request.params.id,
    { name,number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      //no ha encontrado nada porque el id no existe
      if (!updatedPerson) response.status(404).end()
      else response.json(updatedPerson)
    })
    .catch(error => {
      console.error('error ', error.name)

      next(error)
    })
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)


/**
 * manejador  errores
 * @param {*} error
 * @param {*} request
 * @param {*} response
 * @param {*} next siguiente middleware
 * @returns
 */
const errorHandler = (error, request, response, next) => {
  console.error('error ', error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// middleware de errores
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})