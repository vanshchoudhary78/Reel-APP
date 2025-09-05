import mongoose from "mongoose";

// const connectDB = async () =>{
//   try {
//     await mongoose.connect(process.env.MONGODB_URI as string, {

//     });
//     console.log("mongodb conected")
    
//   } catch (error) {
//     console.log("mogodb connected error", error);
//     process.exit(1);
    
//   }
// }

const MONGODB_URI = process.env.MONGODB_URI!;
// change with chatgpt
// const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define mongo_uri in env variables");
}

let cached = global.mongoose;
// chatgpt
// let cached = (global as any).mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
