// Required imports
const axios = require('axios')
const ical = require('ical')
const fs = require('fs')
const { Parser } = require('@json2csv/plainjs')
const express = require('express')
const { parse } = require('path')

let app = express()



app.put('/put-classes', (req,res) =>{
    console.log(req.headers)
  })
app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.listen(2000)