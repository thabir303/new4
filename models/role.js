const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleId: { type: Number, unique: true },
    name: { type: String, unique: true },
    permissions: [{ type: String }],
});

module.exports = mongoose.model("Role", roleSchema);
