import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    subscribedPlans:[{
        type: String,
        required: true,
      }],
  
    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User', // This references the 'User' model
          },
  
},{
    timestamps: true, 
  });

  const Model = mongoose.model('UserService', schema);

  export default Model;