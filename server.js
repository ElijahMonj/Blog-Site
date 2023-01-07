const express = require('express')

var app = express()
const request = require('request');
//const data = "http://localhost:3000/blogs/"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose=require('mongoose')


mongoose.connect("mongodb+srv://admin:admin@cluster0.3hfbcxb.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true,dbName:'Blog-API'})
let coll = mongoose.connection.collection("blogs");


const  ObjectID = require('mongodb').ObjectId;

app.set("views", __dirname);
app.set("view engine", "ejs");

app.get('/', async (req, res) => {

    try {
      let coll = await mongoose.connection.collection("blogs");
      let data = await coll.find().toArray();
      //console.log(data)
      setTimeout(refresh, 500);
      function refresh(){
        res.render("index", { data: data});
      }
    } catch (error) {
      throw error
    }
    


    /* FOR API
    request.get({
        url:data,
        json: true
    },(err,response,data)=>{
       console.log(data[0].title)
       res.render("index",{data: data})
    });
    */
})

app.get('/blog/:blogID',(req,res)=>{

  /*
  console.log(req.params.blogID)
  let link=data+req.params.blogID
  request.get({
    url:link,
    json: true
  },(err,response,data)=>{
   console.log("blog title: "+data.title)
    //res.send(data.title)
   res.render("blog",{data: data})

  });
  */
  
  async function run() {
    try {
      
      
      const query = { _id: ObjectID(req.params.blogID) };
      const data = await coll.findOne(query);
      console.log(data)
      res.render("blog",{data: data})
    } catch{
      console.log("error")
    }
  }
  run()
  
})
app.post('/blog/:id/newComment', function(req,res){
  function date(){
    var d = new Date();          
    var n = d.toLocaleString([], { hour12: true});
    return n
  }
  console.log("--CHANGING--")
  async function run() {
    try {
     
      
      const query = { _id: ObjectID(req.params.id) };
      let data = await coll.findOne(query);
      const newComment={ commentEmail: req.body.commentEmail , commentTime:date(),commentContent: req.body.commentContent};
      
      console.log(newComment)
      let newData=data;
      console.log("Replacing..............")
      newData.comments.push(newComment)
      //console.log(newData)
      let newProd=await coll.replaceOne({ _id: ObjectID(req.params.id)},newData)
      console.log(newProd)
    } catch{
      console.log(" change error")
    }
  }
  run()
  res.redirect(`/blog/${req.params.id}#commentSection`)
  
  /*
  var newComment = [
    { commentEmail: req.body.commentEmail , commentTime:date(),commentContent: req.body.commentContent},   
  ];
  console.log(newComment)
  let link=data+req.params.id+"/newComment"
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
    */
})
const port=process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on port `+port)
})