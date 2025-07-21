import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  discription:{
    type:String,
    required:true,
  },
  tag:{
    type:String,
    default: "General"
  },
  Date:{
    type: Date,
    default:Date.now
  }

});

model.exports = mongoose.mode('notes',NotesSchema)