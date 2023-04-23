const http=require("http");
const express=require("express");
const cors=require("cors");
const socketIO=require("socket.io");

const app=express();
const port=4500||process.env.PORT;
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Hey from server")
})
const server=http.createServer(app);
const io=socketIO(server);

const users=[{}];

io.on("connection",(socket)=>{
    console.log("New connection started!")

    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined!`)
        //for sending msg to own chat page from the site i.e user friendly
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat dear ${users[socket.id]}!`})

        //for sending msg to everone except self
        socket.broadcast.emit('userJoined',{user:"ADMIN",message:`${users[socket.id]} has joined`})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"ADMIN",message:`${users[socket.id]} has left`})
        console.log(`${users[socket.id]} has left`)
    })
})
server.listen(port,()=>{
    console.log(`server working at http://localhost:${port}`);
})