//main file

const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')

connectToMongo(); //takes time to connect

//this code will run before because of js's asynchronous nature
const app = express()
const port = 5000

//middleware
app.use(cors())
app.use(express.json())

//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

//port
app.listen(port, () => {
  console.log(`inotebook backend listening at http://localhost:${port}`)
})

