const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :body'))

morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  
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

const genID = (maxVal) =>{
    const range = maxVal
    return Math.floor(Math.random() * range)
}

app.post('/api/persons',(request, response)=>{

    const body = request.body
    // const body = {
    //     name:"",
    //     number: ""
    // }
    console.log(persons.find(person=>persons.name===person.name))

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
    }else if (persons.find(person=>body.name===person.name)){
        return response.status(400).json(
            {error:'name already exists'}
        )
    }

    const person = {
        "id": genID(32676),
        "name": body.name, 
        "number": body.number
    }

    persons = persons.concat(person)

    response.json(persons)
    morgan.token('body', request => JSON.stringify(body))
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})