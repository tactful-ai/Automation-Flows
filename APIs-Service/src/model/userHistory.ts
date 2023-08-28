import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({  
  callHistory: [{
    date:{
        type:Date
    },
    duration:{
        type:Number
    }  }],
  
  msgHistory: [{
    date:{
        type:Date
    },
    content:{
        type:String
    }  }],
  
  dataHistory:[{
    type: Number,
  }],
  
  internationalHistory:[{
    date:{
        type:Date
    },
    duration:{
        type:Number
    },
    location:String
    }],
    
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the 'User' model
       },
  
  
},{
    timestamps: true, 
  });

  const Model = mongoose.model('UserHistory', schema);

  export default Model;