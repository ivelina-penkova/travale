(function () {
    'use strict';

    angular
        .module('app')
        .factory('ChatService', Service);

    function Service($http, $q) {
        var service = {};

        service.InitializeChat = InitializeChat;
		service.CreateChatBox = CreateChatBox;
		
		// private variables
		
		var socket = io.connect(),
			chats = {},
			currentUserId = null;
		
		
        return service;
		
        function InitializeChat(userId) {
			if (!currentUserId || (currentUserId && currentUserId !== userId)) {
				currentUserId = userId;
				socket.on('chat message', onChatMessage);
			}
        }
		
		// what the chatbox should look like
		// kept here for convenience
		//
		/*<div class="chat-box" style="display: none;">
			<div class="chat-header">
				<span class="chat-username">{partner username}</span><span class="chat-close">X</span>
			</div>
			<ul class="chat-messages">
			
				messages go here in the format:
				<li class="chat-message">
					<label class="chat-message-sender">{username}:</label><span class="chat-message-text">{message}</span>
				</li>
			</ul>
			<div class='chat-send-msg-container'>
				<input type="text" class="chat-input"/>
				<button class="chat-btn-send">Send</button>
			</div>
		</div>*/
		
		function CreateChatBox(sender, receiver) {
			var chatId = null;
			for (var i in chats) {
				if (i.indexOf(sender._id) !== -1 && i.indexOf(receiver._id) !== -1) {
					chatId = i;
					break;
				}
			}
			if (chatId === null) {
				var chatBox = document.createElement('div'),
				chatHeader = document.createElement('div'),
				chatPartner = document.createElement('span'),
				closeChatBtn = document.createElement('span'),
				messagesContainer = document.createElement('ul'),
				sendMsgContainer = document.createElement('div'),
				inputField = document.createElement('input'),
				sendMsgButton = document.createElement('button');

				chatId = sender._id + '|' + receiver._id;
				chats[chatId] = {};
				chats[chatId].chatBox = chatBox;
				chats[chatId].chatPartner = chatPartner;
				chats[chatId].messagesContainer = messagesContainer;
				chats[chatId].sendMsgContainer = sendMsgContainer;
				chats[chatId].inputField = inputField;
				chats[chatId].sendMsgButton = sendMsgButton;
				chats[chatId].senderId = sender._id;
				chats[chatId].receiverId = receiver._id;
			
				chatBox.className = 'chat-box';
				chatBox.id = chatId;
				chatHeader.className = 'chat-header';
				chatPartner.className = 'chat-username';
				chatPartner.innerHTML = receiver.username;
				closeChatBtn.className = 'chat-close';
				closeChatBtn.innerHTML = 'X';
				messagesContainer.className = 'chat-message';
				sendMsgContainer.className = 'chat-send-msg-container';
				inputField.type = 'text';
				inputField.className = 'chat-input';
				sendMsgButton.className = 'chat-btn-send btn btn-primary';
				sendMsgButton.innerHTML = 'Send';
				
				sendMsgButton.addEventListener('click', function(){
					var payload = {};
					payload.sender = {};
					payload.receiver = {};
					payload.sender._id = sender._id;
					payload.sender.username = sender.username;
					payload.sender.socketId = socket.id;
					payload.receiver._id = receiver._id;
					payload.receiver.username = receiver.username;
					payload.message = inputField.value;
					inputField.value = "";
					sendMessage(payload);
				}, false);
				inputField.addEventListener('keypress', function(e){
					// shortcut for sending messages without having
					// to click on the button with the mouse
					if (e.which === 13) { // if 'Enter' is pressed
						if (sendMsgButton.fireEvent) {
							sendMsgButton.fireEvent('onclick');
						} else {
							var evObj = document.createEvent('Events');
							evObj.initEvent('click', true, false);
							sendMsgButton.dispatchEvent(evObj);
						}
					}
				}, false);
				closeChatBtn.addEventListener('click', function(){
					// remove the chatbox from the DOM
					// and unregister the chat from the
					// collection
					document.body.removeChild(chatBox);
					delete chats[chatBox.id];
				}, false);
				
				chatHeader.appendChild(chatPartner);
				chatHeader.appendChild(closeChatBtn);
				chatBox.appendChild(chatHeader);
				chatBox.appendChild(messagesContainer);
				sendMsgContainer.appendChild(inputField);
				sendMsgContainer.appendChild(sendMsgButton);
				chatBox.appendChild(sendMsgContainer);
				document.body.appendChild(chatBox);
			}
		}
		
		// private functions
		
		function displayMessage(payload) {
			var msgContainer = document.createElement('li'),
				msgSender = document.createElement('label'),
				msgText = document.createElement('span');
				
			msgContainer.className = 'chat-message';
			msgSender.className = 'chat-message-sender';
			msgSender.innerHTML = payload.sender.username + ':';
			msgText.className = 'chat-message-text';
			msgText.innerHTML = payload.message;
			msgContainer.appendChild(msgSender);
			msgContainer.appendChild(msgText);
			
			// find the correct chatbox
			for (var i in chats) {
				if (i.indexOf(payload.sender._id) !== -1 && i.indexOf(payload.receiver._id) !== -1) {
					chats[i].messagesContainer.appendChild(msgContainer);
					break;
				}
			}
			
			// TO DO: here, implement the automatic scrolling upon
			// a new message once the chatbox has fixed size
			// so that the last message will always be on the bottom
		}
		
		function onChatMessage(payload) {
			if (payload.sender.socketId !== socket.id &&
			currentUserId === payload.receiver._id) {
				// the reciever of the message will be a sender
				// and the CreateChatBox function takes the
				// sender as a first argument
				service.CreateChatBox(payload.receiver, payload.sender);
				displayMessage(payload);
			}
		}
		
		function sendMessage(payload) {
			displayMessage(payload);
            socket.emit('chat message', payload);
        }
		
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();