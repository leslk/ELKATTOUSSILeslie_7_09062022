const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)
.is().max(36)
.has().symbols()
.has().uppercase()
.has().lowercase()
.has().digits(3)
.has().not().spaces();

module.exports = passwordSchema