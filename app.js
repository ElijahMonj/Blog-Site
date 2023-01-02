const express = require('express')
const https = require('https');
const app = express()
const request = require('request');
const data = "http://localhost:3000/blogs"




app.set("views", __dirname);
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    console.log("-----------")
    request.get({
        url:"http://localhost:3000/blogs",
        json: true
    },(err,response,data)=>{
       console.log(data[0].title)
       res.render("index",{data: data})
    });
    
})

app.listen(3001, () => {
  console.log(`app listening on port 3001`)
})