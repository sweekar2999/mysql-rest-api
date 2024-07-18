//& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
//password:your_password
const { faker } = require('@faker-js/faker');
const express=require("express");
const app=express();
const path=require("path");
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override');

var mysql      = require('mysql');
const { randomUUID } = require('crypto');
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
  database : 'nodeDemo',
  password : "your_password"
});
app.use(methodOverride('_method'));
let port=8080;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.listen(port,()=>{
    console.log("app listening");
})
// let RandomUser=()=>{
//     return [
//      faker.string.uuid(),
//      faker.internet.userName(),
//      faker.internet.email(),
//      faker.internet.password(),
      
//     ];
//   }
//   let data=[];
//   for(let i=1;i<=100;i++){
//     data.push(RandomUser());
//   }


//display count
app.get("/",(req,res)=>{
    let q="SELECT count(*) FROM user";
    try{
    connection.query(q,(err,result)=>{
    if(err) throw err;
    let count=result[0]["count(*)"];
    res.render("home",{count});
});
}catch(err){
    res.send("error in database");
}
    
})


//display username,email and id

app.get("/users",(req,res)=>{
    let q="SELECT id ,username,email FROM user";
    try{
    connection.query(q,(err,result)=>{
    if(err) throw err;
  let data=result;
  console.log(data);
    res.render("users",{data});
});
}catch(err){
    res.send("error in database");
}
    
})


//edit button and form display
app.get("/users/:id/edit",(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let q=`SELECT * FROM user
    WHERE id='${id}'`;
    try{
    connection.query(q,(err,result)=>{
    if(err) throw err;
    let data=result[0];
    res.render("edit",{data});
});
}catch(err){
    res.send("error in database");
}
    
})


//update
app.patch("/users/:id",(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let {password:formpass,username:newUser}=req.body;
    console.log(req.body);
    let q=`SELECT * FROM user
    WHERE id='${id}'`;
    try{
    connection.query(q,(err,result)=>{
    if(err) throw err;
    let data=result[0];
    if(formpass != data.password){
        res.send("wrong password");
    }else{
        let q2=`UPDATE user SET username='${newUser}' WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/users");
        })
    // res.send(data);
    }
});
}catch(err){
    res.send("error in database");
}
})


//add user
app.get("/add",(req,res)=>{
    res.render("form.ejs");
})
//adding
app.post("/users", (req, res) => {
    let { username, email, password } = req.body;
    let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
    let id = uuidv4();

    console.log(req.body);

    try {
        connection.query(q, [id, username, email, password], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.render("loggedIn");
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).send("Unexpected error");
    }
});

//delete
app.delete("/users/:id",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM user WHERE id ='${id}'`;
    try{
        connection.query(q,(err,result)=>{
        if(err) throw err;
        res.render("delete");
    });
    }catch(err){
        res.send("error in database");
    }
})








//    let q="INSERT INTO user(id,username,email,password) VALUES ?";
//   let data=[1,"sweekar","sweekar103@gmail.com","abc1222"];
// try{
//     connection.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
// });
// }catch(err){
//     console.log(err);
// }

