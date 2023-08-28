import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    balance:{
        type: Number,
        required: true,
        default: 0
      },
  
    balance_history: [{
        amount:{
            type:Number
            
        },
        detail:{
            type:String
        }        
    }],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This references the 'User' model
           },
    
  
  
},{
    timestamps: true, 
  });

  const Model = mongoose.model('BalanceHistory', schema);

  export default Model;