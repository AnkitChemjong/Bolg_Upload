import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import userRoute from './routes/user.js';
import mongoose from 'mongoose';
import CookieParser from 'cookie-parser';
import { checkForAuthenticationCookie } from './middleware/authentication.js';
import Blog from './models/blog.js';
import blogRouter from './routes/blog.js';
dotenv.config();


mongoose.connect(process.env.MONGO_URL)
         .then(()=>{console.log("Mongodb connected!!")})
         .catch(err=>{console.log(err)});
const app = express();
const port=process.env.PORT||8000;

app.use(express.urlencoded({extended:false}));
app.use(CookieParser())
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.set("view engine", "ejs");
app.set('views',path.resolve('./views'))

app.get('/',async (req, res) => {
    const allBogs=await Blog.find({}).sort({createdAt:-1});
    return res.render('home',{
        user:req.user,
        blog:allBogs
    });
})

app.use('/blog',blogRouter);
app.use('/user',userRoute);


app.listen(port,()=>console.log('listening on port:'+port));