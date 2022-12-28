const mongoose = require('mongoose');
const server = 'localhost:27017';
const db = `inotebook?tls=false&directConnection=true&readPreference=primaryPreferred&appName=MongoDB%2520Compass`;
const mongoURI = `mongodb+srv://Divyy:Bokaro%40123@cluster0.msyigbx.mongodb.net/inotebook`;

const connectToMongo = async ()=>{
    await mongoose.connect(mongoURI, ()=>{
        console.log("Connected to MongoDB Successfully");
    })
}
module.exports = connectToMongo;

//mongodb://localhost:27017/?tls=false&directConnection=true&readPreference=primaryPreferred&appName=MongoDB%2520Compass