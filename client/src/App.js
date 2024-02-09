import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Error from "./Components/Error"
const socket = io('http://192.168.100.219:3001'); // Connect to server

function App() {
  const [messages, setMessages] = useState([]);

  const [isJoinedRoom , setIsJoinedRoom] = useState(false);
  const [userName , setUserName] = useState("");
  const [players,setPlayers] = useState([]);
  const [gameStarted , setGameStarted] = useState(false);
  const [isGameReady , setIsGameReady] = useState(false)
  const [imgSrc , setImgSrc] = useState("")

  useEffect(() => {

   
    // Listen for messages from server
    socket.on('messageServer', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on('playerJoined', (player) => {
      setPlayers((prevPlayers) => [...prevPlayers, player])

    });
    socket.on('playerJoinedLocal', (players) => {
      setPlayers(players)
    })
    socket.on('resetClient', (players) => {
      resetClient()
    })
    socket.on('gameStartedServer', (imgSrc) => {
      setImgSrc(imgSrc)
      handleGameStart()
      console.log("Game Started")
    })

    return () => {
    
      socket.off('messageServer');
      socket.off('playerJoined');
      socket.off('playerJoinedLocal');
      socket.off('resetClient');
      socket.off('gameStartedServer');
    };
    
  }, []);

  const joinRoom = () => {
    socket.emit('join_room', userName); 
  }
  const sendMessage = () => {
    const message = prompt('Enter your message:');
    socket.emit('message', message); 
  };


  function handleChange(event) {
    setUserName(prevName => event.target.value)
}
function userNameFormHandler(event) {
  
  event.preventDefault();
  joinRoom()
  setIsJoinedRoom(true)

}
function reset(){
  socket.emit('reset'); 
  resetClient()
}
function resetClient(){
  setPlayers([])
  setIsJoinedRoom(false)
  setUserName("")
  setGameStarted(false)
  setIsGameReady(false)

}
function gameReady(){
return players.length >= 3 ? true : false
}


function handleGameStartBtnClicked(){
  if(gameReady()){
    handleGameStart()
    socket.emit('gameStarted'); 
  }
}
function handleGameStart(){

    setGameStarted(true)
    setIsGameReady(true)
  

}

  return (
    <div>
      <h1>TESTING 101 Aung Htet Oo 18th🤯😨😱</h1>
      {isJoinedRoom===false && 
        (<form onSubmit={userNameFormHandler}>
          <input
                type="text"
                placeholder="Username"
                onChange={handleChange}
                value={userName} />
          <button 
            
          >Join Game</button>
          <button type="button"
            onClick={reset}
          >Reset</button>
        </form>)
      }
      {isJoinedRoom===true && gameStarted===false && <div>
        Joined Players : 
        <ul>
        {players.map((player,i) => 
          <li key={i}>{player.name}</li>
        )}
        </ul>
        </div>}
        {isJoinedRoom===true && gameStarted===false && <button onClick={handleGameStartBtnClicked}>Start Game</button> }
        {isJoinedRoom===true && gameStarted===false && isGameReady === false && <Error msg="Atleast 3 Players Required"/>}

        {
          isJoinedRoom===true && gameStarted===true && isGameReady === true && 
          <div>
           <h1> The Game Started</h1>
          <img src={imgSrc} ></img>
          </div>
        }
      
    </div>
  );
}

export default App;
