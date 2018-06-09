const mongoose = require("mongoose");

const visitorSchema =  mongoose.Schema({
    cookie_id: {type: String, required: true},
    visits: {type: Number, required: true, default: 0}
}, {timestamps: {createdAt: "created_at"}});

module.exports = mongoose.model("Visitor", visitorSchema);