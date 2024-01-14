import mongoose from "mongoose"

export const mongooseConnect = async () => {
    // if(mongoose.connection.readyState === 1){
    //     return mongoose.connection.asPromise()
    // }else{
    //     const uri = process.env.MONGODB_URI;
    //     return mongoose.connect(uri)
    // }

    try {
       await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected")
    } catch (error) {
        console.log(error);
    }
}