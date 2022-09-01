const mongoose = require('mongoose')

const password = process.argv[2] || process.env.PASSWORD
const url = `mongodb+srv://fullstackopen:${password}@fullstackopen.nckusuc.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log('connecting to database...')

mongoose.connect(url).then(result => {
	console.log('connected to MongoDB')
}).catch((err) => {
	console.log('error connecting to MongoDB: ', err.message);
})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

module.exports = mongoose.model('Person', personSchema)