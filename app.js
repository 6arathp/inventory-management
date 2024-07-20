import express from "express"
const app = express()
import * as path from 'path'
const __dirname = path.resolve()


import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import * as db from './db.js'

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', async (req, res) => {
    res.sendFile('public/index.html', {root: path.join(__dirname, 'public')})
})

app.get('/getLog', async (req, res) => {
    const result = await db.getLog()
    res.send(result)
})

app.get('/getItems', async (req, res) => {
    const result = await db.getItems()
    res.send(result)
})

app.get('/getLogRow', async (req, res) => {
    const result = await db.getLogRow()
    res.send(result)
})

// app.get('/getTableRow', async (req, res) => {
//     const result = await db.getTableRow()
//     res.send(result)
// })
app.get('/truncateAll', async (req, res) => {
    await db.truncateAll()
    res.status(201).send()
})

app.post('/update', async (req, res) => {
    const { name, category, quantity, action } = req.body
    const result = await db.addItem(name, category, quantity, action)
    if (result)
        res.status(201).send(result)
    else
        res.status(365).send(result)
})
app.listen(process.env.PORT, console.log(`Server listening on port ${process.env.PORT}`))