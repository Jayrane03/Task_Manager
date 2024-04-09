const mongoose = require("mongoose")


const connectDB = async ()=>{

    try{
        await   mongoose.connect("mongodb+srv://Jayrane:jayrane@taskcluster.ej74chc.mongodb.net/user-task?retryWrites=true&w=majority&appName=TaskCluster");
        console.log("Db connected successfully")

    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }

}

module.exports = connectDB;
