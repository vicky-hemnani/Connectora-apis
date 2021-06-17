const router=require("express").Router();
const Message=require("../models/Message");


//add
router.post("/",async (req,res)=>{
    console.log(req.body);
    const newMessage=new Message(req.body);
    console.log(newMessage);
    try {
        const sendMessage=await newMessage.save();
        res.status(200).json(sendMessage);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get
router.get("/:conversationid",async(req,res)=>{
    try {
        const messages=await Message.find({
            conversationid:req.params.conversationid,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports=router;