const express = require("express");
const router = express.Router();
const Joi = require('joi');
const Permission = require('../models/permission');
const Role = require('../models/role');


// Validation function for permission schema
const validatePermission = (data) => {
    const schema = Joi.object({
        permissionName: Joi.string().required().label("Permission Name")
    });
    return schema.validate(data);
};


const validateRole = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Role Name"),
        permissions: Joi.array().items(Joi.string()).label("Permissions")
    });
    return schema.validate(data);
};


// POST method for creating a new permission
router.post("/permissions", async (req, res) => {
    try {
        const { error } = validatePermission(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const permission = new Permission({
            permissionName: req.body.permissionName
        });

        await permission.save();
        res.status(201).json({ success: true, message: "Permission created successfully", permission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// GET method for retrieving all permissions
router.get("/permissions", async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json(permissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// POST method to cretae new role
router.post("/roles", async (req, res) => {
    try {
        const { error } = validateRole(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        let role = await Role.findOne({ name: req.body.name });
        if (role) return res.status(400).json({ message: "Role already exists." });

        const highestRole = await Role.findOne({}, {}, { sort: { 'roleId': -1 } });
        let roleId;
        if (highestRole && highestRole.roleId > 0) {
            roleId = parseInt(highestRole.roleId) + 1;
        } else {
            roleId = 1;
        }

        const newRole = new Role({
            roleId: roleId,
            name: req.body.name,
            permissions: req.body.permissions
        });

        await newRole.save();
        res.status(201).json({ message: "Role created successfully", role: newRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET method to get all roles
router.get("/roles", async (req, res) => {
    try {
        
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// PUT method to assign permisiions to a role
router.put("/roles/:roleId/permissions", async (req, res) => {
    try {
        const { roleId } = req.params; // Extract roleId from request parameters
        const { permissions } = req.body; // Extract permissions from request body

        // Find the role by roleId
        const role = await Role.findOne({ roleId });

        // If the role doesn't exist, return 404 Not Found
        if (!role) {
            return res.status(404).json({ message: "Role not found." });
        }

        // Update the permissions of the role
        role.permissions = permissions;

        // Save the updated role to the database
        await role.save();

        // Return the updated role with a success message
        res.status(200).json({ message: "Permissions assigned to role successfully", role });
    } catch (error) {
        // If an error occurs, send an error response
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET method to retrieve permissions assigned to a role
router.get("/roles/:roleId/permissions", async (req, res) => {
    try {
        const roleId = req.params.roleId;
        
        const role = await Role.findOne({ roleId: roleId });
        if (!role) {
            return res.status(404).json({ message: "Role not found." });
        }

        res.status(200).json({ permissions: role.permissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
