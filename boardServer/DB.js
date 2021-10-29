const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        mongoose.connect('mongodb://localhost/board', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
            if (err) {
                console.error('mongodb connection error', err);
            }
            console.log('mongodb connected');
        });
    }
    connect();
    mongoose.connection.on('disconnected', connect);
}; 