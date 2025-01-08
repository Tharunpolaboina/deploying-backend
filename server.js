const express=require('express');
const {open}=require("sqlite");
const path=require("path");
const sqlite3=require("sqlite3");
const cors=require("cors");
const jwt=require("jsonwebtoken");

const bcrypt=require("bcrypt");

let db;
const app=express();
app.use(express.json());
app.use(cors());

const initializeDBandServer=async ()=>{
    try{
        db=await open({
            filename:path.join(__dirname,"register.db"),
            driver:sqlite3.Database
        });
        app.listen(3000,()=>{
            console.log("server is running")
        });

    }catch(error){
        console.log(`Database error is ${error.message}`);
        process.exit(1);
    }
};

initializeDBandServer()

app.post("/api/login/",async(request,response)=>{
    const {name,password}=request.body;
    const selectQuery=`SELECT * FROM todos WHERE name=?`;
    const dbuser=await db.get(selectQuery,name);
    console.log(name,password);
    if (dbuser==undefined){
        response.status(400).send({error_msg:"invalid user"});
    }else{
       const isPasswordMatched=await bcrypt.compare(password,dbuser.password);
       console.log(isPasswordMatched);
       console.log(password);
       console.log(dbuser.password);
       if(isPasswordMatched===true){
        const payload={
            name:name,
        };
        const jwtToken=jwt.sign(payload,"My-secret");
        response.send({jwtToken});
        console.log(jwtToken)
       }
       else{
        response.status(400);
        response.send({error_msg:"invalid password"});      
    }
    }
})

/*app.post("/signin/",async (request,response)=>{
    const userDetails=request.body;
    const {name,password}=userDetails
    const adduser=`INSERT INTO todos(name,password) 
      VALUES('${name}',
      '${password}');`;
      const dbuser=await db.run(adduser);
      response.status(200).send({login_msg:"created"})
})*/