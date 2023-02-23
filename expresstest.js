const express = require("express")
const app = express()

app.get("/test", (req, res) => {
    console.log('test')
})

app.get('/calendar-info', (req,res) => {
    console.log('calendar-info')
})

app.get("/*", (req, res) => {
    console.log('*')
    res.sendFile(__dirname + '/public' + req.url)
})
app.listen('2000')