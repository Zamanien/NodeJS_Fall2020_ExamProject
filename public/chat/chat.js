//Retrieve data from chat.html form
const chatData = document.getElementById('chatForm');

const socket = io();
 

//Displays the message sent from backend to the frontend
socket.on('message', message => {
    console.log(message);
});

// Submit message
chatData.addEventListener('submit', (e) => {
    //prevents form from submitting to a file
    e.preventDefault();

    //Initialize and assign value from input id to msg
    const message = e.target.elements.textInput.value;

    //Emit the message from input
    socket.emit('chatMessage', message);

});
