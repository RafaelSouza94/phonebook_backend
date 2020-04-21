const express = require('express')
const app = express()

const PORT = 3001

let persons = [
	{
		name: "Joe",
		number: "123123",
		id: 1
	},
	{
		name: "Joe2",
		number: "5345",
		id: 2
	},
	{
		name: "Joe3",
		number: "6456",
		id: 3
	},
	{
		name: "Joe4",
		number: "8678",
		id: 4
	},
]

app.get('/', (req, res) => {
	res.json({Status: 'Working!'})
})

app.get('/api', (req, res) => {
	res.json({API: "Phonebook persons API"})
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/info', (req, res) => {
	let date = new Date()
	date = date.toString()
	res.send(
		`Phonebook has info for ${persons.length} people.
		<br />
		<br />
		${date}`)
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})