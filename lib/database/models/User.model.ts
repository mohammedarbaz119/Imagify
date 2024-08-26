import  { models, Schema,model,Document,ObjectId } from "mongoose"


export interface UserInterface extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureUrl: string;
    width?: number;
    height?: number;
    config?: object;
    transformationUrl?: string;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author?: {
        _id:string,
        firstName:String,
        lastName:string
    };
    createdAt: Date;
    updatedAt: Date;
}


const UserSchema = new Schema({
    clerkId:{type: String,required:true,unique:true},
    email: {type: String,required:true,unique:true},
    username: {type:String, required:true,unique:true},
    photo: {type:String,required:true},
    firstName: {type:String},
    lastName:{type:String},
    planId:{type:Number,default:1},
    creditBalance:{type:Number,default:10},
},{timestamps:true})

const User = models?.User || model("User",UserSchema)

export default User;