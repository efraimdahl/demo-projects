const express = require('express')
const app = express()
const port = 8000
const execSync = require('child_process').execSync
const bodyp = require('body-parser')
const crypto = require('crypto')
const fs = require('fs')
const db = require('./database.json')

app.use(bodyp.json())

app.get('/',(req,res) =>{

    // console.log(req.ip);
    console.log("Got it")
    const message = JSON.parse(execSync('curl -H "Accept: application/json" "https://www.affirmations.dev"'))
    console.log(message.affirmation)

    res.cookie('secret',`${message.affirmation}`).cookie('ip',req.ip).sendFile(`${__dirname}/www/index.html`)
    //res.sendFile(`${__dirname}/www/index.html`)
})

function updateDB(){
    const data = JSON.stringify(db)
    fs.writeFile('./database.json',data, (err) =>{
        if(err){
            console.log("oops something went wrong")
            console.log(err)
        } else {
            console.log("updated DataBase")
        }
    })
}
app.post('/api/fingerprint',(req,res) => {
    res.json({message : "got it"});
    const md5 = crypto.createHash('md5')
    const str = JSON.stringify(req.body,null,2)
    const bgp = md5.update(str,'utf8').digest('hex')
    if(db.hasOwnProperty(bgp)){
        db[bgp].push(Date.now())
    } else {
        db[bgp] = []
        db[bgp].push(Date.now())
    }
    updateDB()
    console.log(bgp)
})
app.listen(port, (err) => {
    if(err) return console.log(err)
    console.log( `Listening on http://localhost:${port}\n
    document root is ${__dirname}
    Press ctrl - c to quit`)})








