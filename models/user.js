import {Schema,model} from 'mongoose';
import {createHmac,randomBytes} from 'crypto';
import { createTokenForUser } from '../services/authentication.js';

const userSchema=new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required: true,
    },
    profileImage:{
        type:String,
        default:"/images/default.jpg"
        
    }
,role:{
    type:String,
    enum:["USER","ADMIN"],
    default:"USER"

}
},{timestamps:true});

userSchema.pre('save',function (next){
    const user=this;
    if(!user.isModified("password")) return;
    
    const salt=randomBytes(16).toString();

    const hashedPassword=createHmac('sha256',salt).update(user.password).digest("hex");
    
    this.salt=salt;
    this.password=hashedPassword;
    next();

});

userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const users=await this.findOne({email});
    if(!users) throw new error("User not found!");

    const salt=users.salt;
    const hashedPassword=users.password;

    const userProvidedHash=createHmac('sha256',salt).update(password).digest("hex");
    if(hashedPassword!=userProvidedHash) throw new error("Password not matched!");
    const token=createTokenForUser(users);
    return token;
});

const user=model("user",userSchema);

export default user;