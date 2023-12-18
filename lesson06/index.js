require('dotenv').config()

const fs = require('fs/promises')
const express = require('express')
const fileUpload = require("express-fileupload")

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000
const uploadPath = './public/images'

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload())
app.use(express.static('public'))

const imageUrl = (filename) => `http://${host}:${port}/images/${filename}`

app.get('/', (req, res) => {
    res.json({ health: "ok" })
});


app.post('/images', async (req, res) => {
    const filename = req.body.filename
    const data = req.body.data

    const suffix = filename.split(".")[1]
    console.log(suffix)

    // kontrola či suffix je medzi podporovanými formátmi
    if (["jpg","jpeg","png"].includes(suffix)) {
        const fileBuffer = Buffer.from(data, 'base64')
        await fs.writeFile(uploadPath + '/' + filename, fileBuffer)
    
        res.json({
            name: filename,
            size: fileBuffer.size,
            url: imageUrl(filename)
        })
       
       
        
        } else {
        res.json({
            error: "file format not supported"
           })
        }
    })

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})

