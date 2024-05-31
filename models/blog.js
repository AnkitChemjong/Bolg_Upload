import {Schema,model} from 'mongoose';

const blogSchema=new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    coverImageURL:{
        type:String,
        required: true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        required: true,
        ref:'user'
    }
},{timestamps:true})

const blog=model('blog',blogSchema);
export default blog;