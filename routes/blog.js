import {Router} from 'express';
import multer from 'multer';
import path from 'path';
import blog from '../models/blog.js';
import Comment from '../models/comment.js';

const router=Router();

const storage=multer.diskStorage({
    destination:function(req,file,cd){
        return cd(null,path.resolve(`./public/uploads/`));
    },
    filename:function(req,file,cd){
       const fileName=`${Date.now()}-${file.originalname}`;
       return cd(null,fileName);
    }
});

const upload=multer({storage:storage})

router.get('/add-new',(req, res)=>{
    return res.render('addBlog',{
        user: req.user
    });
})
router.post('/',upload.single("coverImage"),async (req, res)=>{
// console.log(req.body);
console.log(req.file);
const {title,body}=req.body;
const blogs=await blog.create({
                body,
                title,
                createdBy:req.user._id,
                coverImageURL:`/uploads/${req.file.filename}`,
                })
return res.redirect(`/blog/${blogs._id}`);
}
);
router.get('/:id',async (req,res)=>{
    const blogs= await blog.findById(req.params.id).populate('createdBy');
    const comment=await Comment.find({blogId:req.params.id}).populate('createdBy');
    res.render('blog',{user:req.user,blogs,comment});
});

router.post('/comment/:blogId',async (req, res)=>{
   await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id
   });
   return res.redirect(`/blog/${req.params.blogId}`);
});
export default router;