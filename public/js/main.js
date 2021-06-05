const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get Username & Room Code
const { username,room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
//console.log(username+" "+room);

//Join Chatroom
socket.emit('joinroom', { username, room });

//Get Room and Users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from Server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

const chatForm = document.getElementById('chat-form');
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.querySelector(".msg").value;
    //Emit Message to Server
    socket.emit('chatMessage', msg);
    document.querySelector(".msg").value = "";
});

//Output Message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.setAttribute('class', 'message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

//Add Room Code to DOM
function outputRoomName(room){
    roomName.innerHTML = room;
}

//Add Users to DOM
function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}