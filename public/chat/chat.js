
//Retrieve data from chat.html form
const chatData = document.getElementById('chatForm');
const messageInput = document.getElementById('textInput');
const socket = io();


//Prompts the user for user-name
const username = prompt('Enter a Nickname: ');
addMessages('You joined');    
socket.emit('new-user', username);

//Emits message upon user connection
socket.on('user-connected', name => {
    addMessages(`Server: ${name} connected`);
});

//displays message upon user disconnect
socket.on('user-disconnected', name => {
    addMessages(`Server: ${name} disconnected`);
});


//Displays the message sent from backend to the frontend
socket.on('chatMessage', data => {
    addMessages(`${data.name}: ${data.message}`);
    

    //scroll down to bottom everytime message is received
    messageInput.scrollTop = messageInput.scrollHeight; 
});


// Submit message
chatData.addEventListener('submit', (e) => {
    //prevents form from submitting to a file - stays on page
    e.preventDefault();

    //Initialize and assign value from input id to message
    const message = messageInput.value;

    //Users own message displayed
    addMessages(`You: ${message}`);
    
    //Emit the message from input
    socket.emit('sendMessage', message);

    //Clear input field after submit
    e.target.elements.textInput.value = '';
});


function addMessages(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    chatData.append(messageElement);
  }






