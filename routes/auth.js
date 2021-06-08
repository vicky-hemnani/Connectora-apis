const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send("Hello");
});
//Register
// router.get("/register", async(req, res) => {
//     const user = await new User({
//         username: "vicky",
//         email: "vicky.hemnani99@gmail.com",
//         password: "123456",
//     })
//     await user.save();
//     res.send("User added...");
// })

router.post("/register", async(req, res) => {

    try {

        //hased password
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedpass
        });

        //user created
        const user = await newUser.save();
        console.log(user);
        res.status(200).json();
    } catch (e) {
        console.log(e);
    }
})


//login

router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");

        const validpass = await bcrypt.compare(req.body.password, user.password);
        !validpass && res.status(404).json("wrong password");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }

})
module.exports = router;