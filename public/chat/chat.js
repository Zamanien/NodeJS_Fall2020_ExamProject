

//Retrieve data from chat.html form
const chatData = document.getElementById('chatForm');
const displyNames = document.querySelector('.user-name')
//const users = document.getElementById('users');
const socket = io();



const username = prompt('What is your username?: ');
displayName('You joined');    
socket.emit('new user', username);


socket.on('user-connected', name => {
    displayName(`${name} connected`)
});

//Chat messeges from DOM 
const chatMessages = document.querySelector('.message');


//Displays the message sent from backend to the frontend
socket.on('message', message => {
    console.log(message);
    userMessage(message);

    //scroll down to bottom everytime message is received
    chatMessages.scrollTop = chatMessages.scrollHeight; 
});


// Submit message
chatData.addEventListener('submit', (e) => {
    //prevents form from submitting to a file
    e.preventDefault();

    //Initialize and assign value from input id to msg
    const message = e.target.elements.textInput.value;

    //Emit the message from input
    socket.emit('chatMessage', message);

    //Clear input field after submit
    e.target.elements.textInput.value = '';
    e.target.elements.textInput.focus();
});

function displayName(message){
    const dName = document.createElement('div');
    dName.innerText = message; 
    displyNames.append(dName);

}


// Outputs message to DOM 
function userMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` 
                    <p class="meta">
                        ${username}
                    <span>
                        ${message.time}
                    </span>
                    </p>
                    <p class="text">
                        ${message.text}
                    </p>`;
    

    document.querySelector('.chat-messages').appendChild(div);
}


