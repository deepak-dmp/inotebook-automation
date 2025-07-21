import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  emial:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  Date:{
    type: Date,
    default:Date.now
  }

});

model.exports = mongoose.mode('user',UserSchema)