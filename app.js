const express = require('express')

var app = express()
const request = require('request');
const data = "http://localhost:3000/blogs"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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
app.get('/blog/:blogID',(req,res)=>{
  console.log(req.params.blogID)
  let link="http://localhost:3000/blogs/"+req.params.blogID
  request.get({
    url:link,
    json: true
},(err,response,data)=>{
   console.log("blog title: "+data.title)
    //res.send(data.title)
   res.render("blog",{data: data})
});
})
app.post('/blog/:id/newComment', function(req,res){
  function date(){
    var d = new Date();          
    var n = d.toLocaleString([], { hour12: true});
    return n
  }
  console.log("-------------")
  console.log(req.params.id)
  var newComment = [
    { commentEmail: req.body.commentEmail , commentTime:date(),commentContent: req.body.commentContent},   
  ];
  console.log(newComment)
  let link="http://localhost:3000/blogs/"+req.params.id+"/newComment"
  request.patch(
    //First parameter API to make post request
    link,

    //The second parameter, DATA which has to be sent to API
    { json: {
      commentEmail: req.body.commentEmail , commentTime:date(),commentContent: req.body.commentContent
    } 
  },
    
    //The third parameter is a Callback function 
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            console.log(response.statusCode);
            res.redirect(`/blog/${req.params.id}`)
        }
    }
);
})
const port=8080;
app.listen(port, () => {
  console.log(`app listening on port `+port)
})