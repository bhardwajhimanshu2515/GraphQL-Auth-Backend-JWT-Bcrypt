const { AuthenticationError } = require("apollo-server-errors");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
const checkToken=require("./middlewares/checktoken");
const User=require("./models/user");

const resolvers={
    Query:{
        hello:()=>{
            return 'Hello World !!'
        },
        getAllUsers:async(parent,args,context,info)=>{
            checkToken(context.req,context.res,context.next)
            return await User.find();
        },
        login:async(parent,args,context,info)=>{
            const {email,password}=args.user;
    
            //check if user exist or not
            let existingUser;
            try{
                existingUser=await User.findOne({email:email})
            }
            catch(err){
                throw new Error("Error in checking user")
            }
    
            //if user does not exist throw an error
            if(!existingUser){
                throw new AuthenticationError("User does nor exist please signup instead")
            }
    
            //if user exist check password
            let isPasswordValid;
            try{
                isPasswordValid=await bcrypt.compare(password,existingUser.password);
            }
            catch(err){
                throw new Error("Error in checking Password")
            }

            //if not valid password throw error
            if(!isPasswordValid){
                throw new AuthenticationError("Wrong Password");
            }

            //if password matched then generate a token
            let token;
            try{
                token=await jwt.sign({userId:existingUser._id,email:existingUser.email},"mySecret",{expiresIn:"21d"});
            }
            catch(err){
                throw new Error("Error in generating token")
            }

            //now return response
            return {
                id:existingUser._id,
                name:existingUser.name,
                phoneNumber:existingUser.phoneNumber,
                email:existingUser.email,
                token:token
            };
        }
    },
    Mutation:{
        signup:async(parent,args,context,info)=>{
            const {name,phoneNumber,email,password}=args.user;
            
            //check if user exist or not
            let existingUser;
            try{
                existingUser=await User.findOne({email:email})
            }
            catch(err){
                throw new Error("Error in checking User")
            }

            if(existingUser){
                throw new AuthenticationError("User already exist please login instead");
            }

            //convert password into hash
            let hashedPassword;
            try{
                hashedPassword=await bcrypt.hash(password,12);
            }
            catch(err){
                throw new Error("Error in Hashing")
            }

            //if hashing is done save user in db
            let newUser=new User({
                name,
                phoneNumber,
                email,
                password:hashedPassword
            })

            try{
                await newUser.save()
            }
            catch(err){
                throw new Error("Error in Saving User")
            }

            //now generate token
            let token;
            try{
                token=await jwt.sign({userId:newUser._id,email:newUser.email},"mySecret",{expiresIn:"21d"})
            }
            catch(err){
                throw new Error("Error in generating Token")
            }

            return {
                id:newUser._id,
                name:newUser.name,
                phoneNumber:newUser.phoneNumber,
                email:newUser.email,
                token:token
            };
        }
    }
};

module.exports=resolvers;