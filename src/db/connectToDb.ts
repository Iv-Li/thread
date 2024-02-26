import mongoose from 'mongoose';

export const connectToDb = async () => {
  mongoose.set('strictQuery', true)

  const url = process.env.MONGO_URL

  if(!url) {
    console.log('No Mongo Url')
    return
  }

  if(global.isDbConnected ) {
    console.log("MongoDB already connected")
    return
  }

  try {
    await mongoose.connect(url)
    global.isDbConnected  = true
    console.log("MongoDB connected")
  } catch (err){
    console.log(err)
  }
}
