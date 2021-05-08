//import libs
const jwt=require("jsonwebtoken");

//export module
module.exports=(req,res,next)=>{
    if(req.method==="OPTIONS"){
        return next();
    }
    try{
        const token=req.headers.authorization.split(" ")[1];
        console.log(token);
        if(!token){
            throw Error("Authentication Failed !!");
        }
        const decodedToken=jwt.verify(token,"mySecret");
        req.userData={userId:decodedToken.userId,email:decodedToken.email}
        
    }catch(err){
        throw Error("Auth failed");
    }
}