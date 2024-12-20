const Joi = require("joi");

const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("user", "admin").default("user"),
});


module.exports = { userSchema };
