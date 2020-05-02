const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const app = express();
var path = require('path');

app.get('/api',(req, res)=> {
  res.json({
    message: "welcome to api"
  });
});

app.post('/api/allfiles', basicauth, (req, res)=> {
  const fileFolder = './testfolder';
  var listfile = [];
  fs.readdirSync(fileFolder).forEach((item) => {
    listfile.push(item);
  });
  res.json({
    files: listfile,
  })
});

app.post('/api/imgfiles', basicauth,  (req, res)=> {
  const fileFolder = './testfolder';
  var imgfiles = [];
  fs.readdirSync(fileFolder).forEach((item) => {
    if(path.extname(item) == '.jpg'){
      imgfiles.push(item);
    }
  });
  res.json({
    files: imgfiles,
  })
});

function basicauth(req, res, next){
  //GEt auth header value
  const authdata = req.headers['authorization'];
  if(typeof authdata === 'undefined')
  {
    res.sendStatus(403);
  }
  next();
}


app.post('/api/posts',verifytoken, (req, res)=> {
  jwt.verify(req.token, 'secretkey', (err, authdata)=>{
    if(err){
      res.sendStatus(403);
    }
    else{
      res.json({
        message: "auth created",
        authdata
      })
    }
  })
});
app.post('/api/login',(req, res)=> {
  const user = {
    id: 1,
    name: 'sudha',
    email : 'sudha@gmail.com'
  }
  jwt.sign({user: user}, 'secretkey', (err,token)=>{
    res.json({
      token:token
    })
  })
});
//format of token
//Authorization: Bearer <token?
function verifytoken(req, res, next){
  //GEt auth header value
  const BearerHeader = req.headers['authorization'];
  if(typeof BearerHeader !== 'undefined')
  {
    const Bearerdata = BearerHeader.split(" ");
    const bearertoken = Bearerdata[1];
    req.token = bearertoken;
  }
  next();
}
app.listen(3000, ()=> console.log("server started on port 3000"));
