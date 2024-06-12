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
    nickname = document.querySelector('#nickname');
    fullname = document.querySelector('#fullname');
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
    stompClinet.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived); //Connected user to his own queue, everytime he gets a new message he'll be notified
    stompClinet.subscribe(`/user/public`, onMessageReceived);

    //
}

function onError(){

}

function onMessageReceived(){

}

usernameForm.addEventListener('submit', connect, true);