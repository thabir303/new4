const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        role: Joi.string().valid('admin', 'stsManager', 'landfilManager', 'unassigned').default('unassigned').label("Role"),
        branch: Joi.string().optional().label("Branch"),
    });
    return schema.validate(data);
};

const validateUpdatedUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().optional().label("Username"),
        branch: Joi.string().optional().label("Branch"),
    });
    return schema.validate(data);
};

const validateUserRoleUpdate = (data) => {
    const schema = Joi.object({
        role: Joi.string().valid('admin', 'stsManager', 'landfilManager', 'unassigned').default('unassigned').label("Role")
    });
    return schema.validate(data);
};



// search and sort options
// /users?role=admin
// users?branch=DNCC
// /users?sort=asc
// /users?role=admin&branch=DNCC&sort=desc
router.get("/", async (req, res) => {
    try {
        // Define filter and sort options based on query parameters
        let filter = {};
        let sort = {};

        // Filter users by role
        if (req.query.role) {
            filter.role = req.query.role;
        }

        // Filter users by branch
        if (req.query.branch) {
            filter.branch = req.query.branch;
        }

        // Sort users by userId in ascending order
        if (req.query.sort === 'asc') {
            sort.userId = 1;
        }

        // Sort users by userId in descending order
        if (req.query.sort === 'desc') {
            sort.userId = -1;
        }

        // Fetch users based on filter and sort options
        const users = await User.find(filter).sort(sort);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//GET method to get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//GET all available roles
router.get("/roles", async (req, res) => {
    try {
        // Fetch all unique roles from the users collection
        const roles = await User.distinct("role");
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET a specific user's details by userId
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST method for creating a new user
router.post("/", async (req, res) => {
    try {

        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ message: "User already exists." });

        const highestUserIdUser = await User.findOne({}, {}, { sort: { 'userId': -1 } });
        let userId;
        if (highestUserIdUser && highestUserIdUser.userId > 0) {
            userId = parseInt(highestUserIdUser.userId) + 1;
        }
        else{
            userId = 1;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = new User({
            userId: userId,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "unassigned", 
            branch: req.body.branch,
            pin: 111
        });

        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//PUT method to update a specific user with userId
router.put("/:userId", async (req, res) => {
    try {
        const { error } = validateUpdatedUser(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update user properties other than email and password
        user.username = req.body.username || user.username;
        user.branch = req.body.branch || user.branch;

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE method for deleting a user
router.delete("/:userId", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.deleteOne({ userId: req.params.userId });
        res.status(204).json({sucess: true, message: "user deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



//GET method for role update for a specific user
router.put("/:userId/roles", async (req, res) => {
    try {

        const { error } = validateUserRoleUpdate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = req.body.role;
        await user.save();
        res.status(200).json({ sucess: true, message: "User roles updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});





module.exports = router;
