import express from 'express';
import user from '../models/user.js'



const router=express.Router();

router.get('/signin',(req,res)=>{
    res.render('signin');
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signup',async (req,res)=>{
    const {fullName,email,password}=req.body;

    await user.create({fullName,email,password});
    return res.send(`
            <script>
                alert('You are registered!!');
                window.location.href = '/';
            </script>
         `);
});
router.post('/signin',async (req,res)=>{
    const {email,password}=req.body;
try{
    const token=await user.matchPasswordAndGenerateToken(email,password);
    res.cookie('token',token);
    
    return res.send(`
    <script>
        alert('Welcome Back!!');
        window.location.href = '/';
    </script>
`);
}
catch(error){
    return res.render("signin",{error:"Incorrect Email or Password!"});
}
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
});
export default router;