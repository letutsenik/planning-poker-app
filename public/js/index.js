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
        rooms: rooms.map((room, index) => ({ val: room.name, txt: room.name })),
    });
    document.querySelector('#login-form').innerHTML = html;

    const switcherButtonNew = document.querySelector('.switcher__button.new');
    const switcherButtonSelect = document.querySelector('.switcher__button.select');
    const inputNameForm = document.querySelector('.new-room-form');
    const selectNameForm = document.querySelector('.select-room-form');

    switcherButtonNew.addEventListener('click', () => {
        switcherButtonNew.classList.add("switcher__button--active");
        switcherButtonSelect.classList.remove("switcher__button--active");

        inputNameForm.classList.remove('hidden');
        selectNameForm.classList.add('hidden');
    });
    switcherButtonSelect.addEventListener('click', () => {
        switcherButtonSelect.classList.add("switcher__button--active");
        switcherButtonNew.classList.remove("switcher__button--active");

        inputNameForm.classList.add('hidden');
        selectNameForm.classList.remove('hidden');
    });
});
