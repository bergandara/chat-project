'use strict';

// Enables strict mode -> generates more helpful error messages

// Create constants that will be the ids in the index.html
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const connectingElement = document.querySelector('.connecting');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');

let stompClient = null;
let nickname = null;
let fullname = null;
let selectedUser = null;

function connect(event){
    nickname = document.querySelector('#nickname').value.trim();
    fullname = document.querySelector('#fullname').value.trim();
    if(nickname && fullname) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();

}


//What we want to do when user is connected
function onConnected(){
    stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived); //Connected user to his own queue, everytime he gets a new message he'll be notified
    stompClient.subscribe(`/user/public`, onMessageReceived);

    //register the connected user
    stompClient.send('/app/user.addUser',
        {},
        JSON.stringify({nickName: nickname, fullName: fullname, status: 'ONLINE'}) //stringify transforms any object to JSON.
     );
    //Find and display the connected users
    findAndDisplayConnectedUsers().then();

}

async function findAndDisplayConnectedUsers(){
    const connectedUserResponse = await fetch('/users');
    let connnectedUsers = await connectedUserResponse.json();
    connectedUsers = connectedUsers.filter(user => user.nickName !== nickname);
    const connectedUsersList = document.getElementById('connectedUsers');
    connectedUsersList.innerHTML = '';

    connectedUsersList.forEach(user => {
        appendUserElement(user, connectedUsersList);
        if (connectedUsers.index(user) < connectedUsers.length - 1) {
            //add a separator
            const separator = document.createElement('li');
            separator.classList.add('separator');
            connectedUsersList.appendChild(separator);
        }
    });
}

function appendUserElement(user, connectedUserList){
    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.id = user.nickName;

    const userImage = document.createElement('img');
    userImage.src = '../img/user_icon.png';
    userImage.alt = user.fullName;

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = user.fullName;

    const receivedMsgs = document.createElement('span');
    receivedMsgs.textContent = '0';
    receivedMsgs.classList.add('nbr-msg', 'hidden');

    listItem.appendChild(userImage);
    listItem.appendChild(usernameSpan);
    listItem.appendChild(receivedMsgs);

    connectedUsersList.appendChild(listItem);
}

function onError(){

}

function onMessageReceived(){

}

usernameForm.addEventListener('submit', connect, true);