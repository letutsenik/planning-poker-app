const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $voteButtons = document.querySelectorAll('.poker_button.vote');
const $clearVotesButton = document.querySelector('.poker_button.clear');
const $showVotesButton = document.querySelector('.poker_button.show');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
const votedListTemplate = document.querySelector('#voted-list-template').innerHTML;

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
};

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll()
});

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll()
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html
});

socket.on('voteListUpdate', ({ voteData, showVotes }) => {
    const html = Mustache.render(votedListTemplate, { voteData, showVotes });

    document.querySelector('#voted-list').innerHTML = html
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared!')
        })
    })
});

$voteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        const points = Number(e.target.innerHTML);

        socket.emit('sendVote', points, (error) => {

            if (error) {
                return console.log(error)
            }

            console.log('Vote delivered!')
        })
    })
});

$clearVotesButton.addEventListener('click', () => {
    socket.emit('clearVotes', null, (error) => {

        if (error) {
            return console.log(error)
        }

        console.log('Votes cleared!')
    })
});

$showVotesButton.addEventListener('click', () => {
    socket.emit('showVotes', null, (error) => {

        if (error) {
            return console.log(error)
        }

        console.log('Votes is shown!')
    })
});

class Client {
    constructor(socket, modal) {
        this.socket = socket;
        this.modal = modal;
        this.username = null;
        this.room = null;
    }

    init() {
        const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
        if (!username) {
            this.modal.showModal();
            new JoinForm(this.socket, room, this.modal.closeModal);
            return
        }
        this.username = username;
        this.room = room ? room : 'Default';

        this.join()
    }

    join() {
        this.socket.emit('join', { username: this.username, roomName: this.room }, (error) => {  //TODO: Remove duplication
            if (error) {
                alert(error);
                location.href = '/'
            }
        });
    }

    start() {
        this.init();
    }
}

class Modal {
    constructor() {
        this.modalElem = document.getElementById("modal");
        this.closeButton = document.getElementsByClassName("close")[0];
        this.closeButton.onclick = () => {
            this.modalElem.style.display = "none";
        };
        this.closeModal = this.closeModal.bind(this);
    }

    showModal() {
        this.modalElem.style.display = "block";
    }

    closeModal() {
        this.modalElem.style.display = "none";
    }
}

class JoinForm {
    constructor(socket, room, onSubmit) {
        this.inputField = document.getElementsByClassName("join-form__input")[0];
        this.submitButton = document.getElementsByClassName("join-form__smbBtn")[0];
        this.socket = socket;
        this.submitButton.onclick = (e) => {
            e.preventDefault();
            this.socket.emit('join', { username: this.inputField.value, roomName: room }, (error) => { //TODO: Remove duplication
                if (error) {
                    alert(error);
                    location.href = '/'
                }
            });
            onSubmit()
        }
    }
}

const modal = new Modal();
const client = new Client(socket, modal);
client.start();
