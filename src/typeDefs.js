const {gql}=require("apollo-server-express");

const typeDefs=gql`
    type User{
        id:ID
        name:String
        phoneNumber:String
        email:String
        token:String
    }
    input loginInput{
        email:String!
        password:String!
    }
    type Query{
        hello: String,
        getAllUsers:[User],
        login(user:loginInput):User
    }
    input signupInput{
        name:String
        phoneNumber:String
        email:String!
        password:String!
    }
    type Mutation{
        signup(user:signupInput):User
    }
`;

module.exports=typeDefs;