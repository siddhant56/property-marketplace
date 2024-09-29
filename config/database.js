import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  //Ensures the fields that are specified in schema will be saved
  mongoose.set("strictQuery", true);

  // If database is already connected dont connect again

  if (connected) {
    console.log("Mong Db is already connected !!");
    return;
  }

  //Connect to mongo db

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("Mongo DB connected !!");
  } catch (error) {
    console.log("Error in Mongo Db Connect ", error);
  }
};

export default connectDB;
