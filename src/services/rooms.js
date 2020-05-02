const { v4: uuidv4 } = require('uuid');

const rooms = [
    {
        id: 1111,
        name: "Some",
    },
    {
        id: 222,
        name:  "Other"
    }
];

const testSum = (a, b) => a + b;

const addRoom = ({ roomName }) => {
    roomName = roomName.trim().toLowerCase();

    // Validate the data
    if (!roomName) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing room
    const existingRoom = rooms.find((room) => {
        return room.name === roomName;
    });

    // Validate username
    if (existingRoom) {
        return {
            error: 'Room name is in use!'
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
