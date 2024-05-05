require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/persons')

let persons = [
]

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :body'))

morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  
let currDate = new Date()

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = String(request.params.id)
    const person = persons.find(person=> person.id===id)

    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
    morgan.token('body', request => JSON.stringify(person))
  })

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person=>person.id!==id)

    
    response.status(204).end()
    
})

app.get('/info', (request, response) => {
    const dbLength = persons.length
    response.send('<p>'+'Phone book has info for '+dbLength+' people</p>'+
                  '<p>'+currDate+'</p>')
})

app.post('/api/persons',(request, response)=>{

    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ 
                error: 'content missing' 
        })
    }

    const person = new Contact({
        name: body.name, 
        number: body.number
    })

	person.save().then(savedContact => {
		response.json(savedContact)
	})

    morgan.token('body', request => JSON.stringify(body))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})