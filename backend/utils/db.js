const mongoose = require("mongoose")


const connectDB = async ()=>{

    try{
        await   mongoose.connect(process.env.MONGO);
        console.log("Db connected successfully")

    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }

}

module.exports = connectDB;
