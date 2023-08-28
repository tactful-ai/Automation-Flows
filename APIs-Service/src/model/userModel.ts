import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,

  },
  number: {
    type: String,
    required: true,
    unique: true, 


  },
 
  
  
},{
  timestamps: true, 
});

const Model = mongoose.model('User', userSchema);

export default Model;