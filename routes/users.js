const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async(req, res) => {
    if (req.body.userid == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("User Updated Succesfully");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("Sorry, cant access the account");
    }
})

//delete user

router.delete("/:id", async(req, res) => {
    if (req.body.userid == req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User Deleted Succesfully");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("Sorry, cant access the account");
    }
});

//get user

router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updateAt, ...other } = user._doc
        console.log(other);
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(err);
    }
});

//follow a user

router.put("/:id/follow", async(req, res) => {
    if (req.body.user !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userid);

            if (!user.followers.includes(req.body.userid)) {
                await user.updateOne({ $push: { followers: req.body.userid } });
                await currentuser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You are already following");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403), json("You can't follow urself");
    }
});


//unfollow user

router.put("/:id/unfollow", async(req, res) => {
    if (req.body.user !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userid);

            if (user.followers.includes(req.body.userid)) {
                await user.updateOne({ $pull: { followers: req.body.userid } });
                await currentuser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You don't follow that person");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403), json("You can't  be unfollow urself");
    }
})

module.exports = router;