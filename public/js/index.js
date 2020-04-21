console.log("Init Join");
const socket = io();

const loginForm = document.querySelector('#form-template').innerHTML;

socket.emit('initJoin', {}, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
});

socket.on('sendRooms', (rooms) => {
    console.log('rooms =>', rooms);
    const html = Mustache.render(loginForm, {
        rooms: rooms.map((room, index) => ({ val: room, txt: room })),
    });
    document.querySelector('#login-form').innerHTML = html
});