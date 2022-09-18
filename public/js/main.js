const chatMessage = document.querySelector('.chat-messages')
const chatForm = document.getElementById('chat-form')

const roomName = document.getElementById('room-name')
const usersList = document.getElementById('users')




const socket = io()


socket.on('message',message=>{ 
    console.log(message)
    messageCreator(message)
    chatMessage.scrollTop = chatMessage.scrollHeight
}
)

// manipulate DOM for message  
function messageCreator(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const meta =`<p class="meta">${message.username} <span>${message.time}</span></p>`
    const p = document.createElement('p');
    p.classList.add('text');
    p.innerText = message.text;
    div.innerHTML=meta
    div.appendChild(p);
    document.querySelector('.chat-messages').appendChild(div);
}



chatForm.addEventListener('submit', e=>{
    e.preventDefault()
    //get messge text
    const msg = e.target.elements.msg.value;
    console.log(msg)
    //emiting message to server
    socket.emit('message',msg)
    e.target.elements.msg.value =''
    e.target.elements.msg.focus()

})

