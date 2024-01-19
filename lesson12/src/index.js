import dotenv from 'dotenv'
import express from 'express'
const app = express()


app.use(express.urlencoded({ extended: true }))
app.use(express.json())



const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
    res.json({ status: "ok" })
})

app.get('/about', async (req, res) => {
    res.send("about")
})


app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})