import  { models, Schema,model,Document,ObjectId } from "mongoose"

export interface ImageInterface extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width?: number;
    height?: number;
    config?: object;
    transformationURL?: string;
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


const ImageSchema = new Schema({
    title:{type: String,required:true},
    transformationType: {type: String,required:true},
    publicId: {type:String, required:true},
    secureURL: {type:String, required:true},
    width: {type:Number},
    height:{type:Number},
    config:{type:Object},
    transformationURL:{type:String},
    aspectRatio:{type:String},
    color:{type:String},
    prompt:{type:String},
    author:{type:Schema.Types.ObjectId,ref:"User"},
},{timestamps:true})

const Image = models?.Image || model("Image",ImageSchema)

export default Image;