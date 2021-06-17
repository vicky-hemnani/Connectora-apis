const router=require("express").Router();
const Conversation=require("../models/Conversation");

//new conv
router.post("/",async (req,res)=>{
    const newConversation=new Conversation({
        members:[req.body.senderid,req.body.receiverid],
    });
    try{
        const saveConversation=await newConversation.save();
        res.status(200).json(saveConversation);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
});

//get conv of user

router.get("/:userid",async(req,res)=>{
    try {
        const conversation=await Conversation.find({
            members:{$in:[req.params.userid]},
        })
        res.status(200).json(conversation);
    } catch (error) {
        req.status(500),json(error);
    }
})


// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports=router;
