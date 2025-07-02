import mongoose from "mongoose"


export const connectDB = async () => {
  try {
    console.log("MongoDB String:", process.env.MONGOSE_URI);
    const conn = await mongoose.connect(process.env.MONGOSE_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error: any){
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
}