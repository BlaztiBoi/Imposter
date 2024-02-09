const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');





app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: '*',
        method: ["GET","POST"],
    },
});

const messages = [];
let gameStarted = false;
let players = [];
let newMessage = "";





io.on("connection",(socket) => {
   
    




    console.log(`User Connected : ${socket.id}`)


      socket.on('message', (message) => {
        messages.push(message);
        socket.emit('messageServer', message); //
        socket.broadcast.emit('messageServer', message); //
        console.log('Message received:', message);  
      })

    socket.on("join_room", (name) => {
        const user = { name: name , id: socket.id}
        players.push(user);

        socket.broadcast.emit('playerJoined', user); 

        socket.emit('playerJoinedLocal', players); 

        console.log("User joined : " + name + " , id: " +socket.id);
        console.log(players)
    });
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
    
    socket.on("gameStarted" , async()=>{
        const imgSrc = await main()
        console.log(imgSrc)
        socket.emit('gameStartedServer',imgSrc)
        socket.broadcast.emit('gameStartedServer' ,imgSrc)

        
        console.log("Game had Started :" )
        console.log(players)
    })


    socket.on("reset", () => {
        players=[]  
        gameStarted = false;
        socket.broadcast.emit('resetClient'); 

        
    })



});

 // Send message to server
server.listen(3001,() => {
    console.log("Sever is running on http://localhost:3001")
})


const axios = require('axios');
const cheerio = require('cheerio');

// URL of the website you want to crawl
const url = 'https://randomoutputs.com/random-object-generator';

// ID of the div containing the image
const divId = 'output';

// Function to fetch data from the URL
async function fetchData(url) {
    const response = await axios(url);
    return response.data;
}

// Function to extract image source from the HTML using Cheerio
function extractImageData(html) {
    const $ = cheerio.load(html);
    const outputDiv = $(`#${divId}`);
    const imgSrc = outputDiv.find('img').attr('src');
    return imgSrc;
}

// Main function to run the crawler
async function main() {
    try {
        const html = await fetchData(url);
        const imgSrc = extractImageData(html);
        return `https://randomoutputs.com/${imgSrc}`
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the main function
