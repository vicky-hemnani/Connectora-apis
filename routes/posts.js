const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//create a post

router.post("/", async(req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = newPost.save();
        res.status(200).json("New Post created");
    } catch (error) {
        res.status(500).json(error);
    }
})

//update a post

router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userid === req.body.userid) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post Updated succesfully");
        } else {
            res.status(403).json("You can only update your post")
        }
    } catch (error) {
        res.send(500).json(error);
    }
})

//delete a post

router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userid === req.body.userid) {
            await post.deleteOne();
            res.status(200).json("Post Deleted succesfully");
        } else {
            res.status(403).json("You can only delete your post")
        }
    } catch (error) {
        res.send(500).json(error);
    }
})

//like a post

router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userid)) {
            await post.updateOne({ $push: { likes: req.body.userid } });
            res.status(200).json("Post liked succesfully");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userid } });
            res.status(200).json("Post unliked succesfully");
        }
    } catch (error) {
        res.send(500).json(error);
    }

})

//get a post

router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.send(500).json(error);
    }

})


//get timeline posts

router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userid);
        const userPosts = await Post.find({ userid: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendid) => {
                return Post.find({ userid: friendid });
            })
        );
        res.json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;