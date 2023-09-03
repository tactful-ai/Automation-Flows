import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    title:{
        type: String,
        required: true,
      },
  
      content:{
        type: String,
        required: true,
      },
      price:{
        type: Number,
        required: true,
      }
      ,
      imgUrl:{
        type: String,
        
      }, 
  
  
},{
    timestamps: true, 
  });

  const Model = mongoose.model('service', schema);

  export default Model;