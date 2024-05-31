import jwt from 'jsonwebtoken';


const secretKey="ankit-secret";
function createTokenForUser(user){
    const payload={_id:user._id,userName:user.fullName,email:user.email,profileImageURL:user.profileImage,role:user.role};
    const token= jwt.sign(payload,secretKey);
    return token;
}

function validateToken(token){
    if(!token) return new error("No token available!");
    const payload=jwt.verify(token,secretKey);
    return payload;
}

export {createTokenForUser,validateToken}