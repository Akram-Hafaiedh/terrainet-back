import express from 'express';
import 'dotenv/config'

const PORT = process.env.PORT || 3001

const app = express()

app.get('/', (req, res) => {
    res.send('Hello world!')
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})