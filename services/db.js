const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected');
    } catch (err) {
        console.log(err);
        throw new Error('Error connecting to database');
    }
}

module.exports = {
    dbConnection
};
