const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

       
        const lowestUserIdUser = await User.findOne({}, {}, { sort: { 'userId': 1 } });

        let userId;
        if (lowestUserIdUser && lowestUserIdUser < 0) {
            userId = lowestUserIdUser.userId -1;
        } else {
            userId = -1; // If no user found, set userId to 101
        }


        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = new User({
            userId: userId,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "unassigned",
            branch: req.body.branch,
            pin: req.body.pin || 111
        });

        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;