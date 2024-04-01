const express = require('express')
const app = express()

app.use(express.json())

let currDate = new Date()

let persons = [
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

app.get('/', (request, response) => {
  response.redirect('/info')
})


app.get('/api/persons', (request, response) => {
  response.end(JSON.stringify(persons))
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note=> note.id===id)

    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})