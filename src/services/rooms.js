const { v4: uuidv4 } = require('uuid');

const rooms = [
    {
        id: 1111,
        name: 'Default',
    }
];

const testSum = (a, b) => a + b;

const addRoom = ({ roomName }) => {
    if (!roomName) {
        return {
            room: rooms.find((room) => room.name === 'Default').name
        }
    }
    roomName = roomName.trim();

    // Check for existing room
    const existingRoom = rooms.find((room) => {
        return room.name === roomName
    });

    if (existingRoom) {
        return {
            room: existingRoom
        }
    }

    // Store room
    const id = uuidv4();
    const room = { id, name: roomName };
    rooms.push(room);
    return { room }
};

const getRooms = () => {
    return rooms;
};


module.exports = {
    getRooms,
    addRoom,
    testSum
};
