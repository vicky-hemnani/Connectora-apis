const mongoose=require("mongoose");
const MessageSchema=mongoose.Schema(
    {
        conversationid:{
            type:String
        },
        sender:{
            type:String
        },
        text:{
            type:String
        }
    },
    {timestamps:true}
);
module.exports=mongoose.model("Message",MessageSchema);