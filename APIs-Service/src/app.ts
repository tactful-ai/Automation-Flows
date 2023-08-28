import express from 'express';
import mongoose from 'mongoose';
import  {routes} from './routes/route'

const app= express();
app.use(express.json());

app.use(routes)

mongoose
  .connect("database link",{})
  .then((result) => {
    app.listen(4000,()=>console.log('Back Office is online'));
  })
  .catch((err:Error) => {
    console.log(err);
  });
