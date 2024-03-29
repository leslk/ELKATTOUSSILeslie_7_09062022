// Requires
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
const pwValidator = require("../services/pw-validator");
const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

// User signup
exports.signup = (req, res, next) => {
    // Set cryptage for email
    const keyutf = cryptoJS.enc.Utf8.parse(process.env.CRYPTO_JS_KEY);
    const iv = cryptoJS.enc.Base64.parse(process.env.CRYPTO_JS_KEY);
    // Encrypt email
    const cryptedEmail = cryptoJS.AES.encrypt(req.body.email, keyutf, {iv: iv}).toString();
    // Check the password strength
    pwErrorCount = pwValidator.validate(req.body.password, {details: true});
    //Check email validity
    if(!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            errorType : "email",
            message : "email incorrect"
        });
    } 
    //Check password validity
    if (pwErrorCount.length > 0) {
        return res.status(400).json({
            errorType : "password",
            message : "Le mot de passe doit contenir 8 caractères minimum dont 1 majuscule, 1 minscule, 3 chiffres et 1 caractère spécial"
        })
    }
    // If everything ok, Create new user
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                pseudo : req.body.pseudo,
                email : cryptedEmail,
                password : hash
            });
            user.save()
            .then(() => res.status(201).json({message: "Utilisateur créé !"}))
            .catch(function(err) {
                // set errorType to use it in client side
                if ("email" in err.errors) {
                    return res.status(400).json({
                        errorType : "email",
                        message : "email déjà utilisé"
                    });
                }
                // pseudo errors
                if ("pseudo" in err.errors) {
                    // pseudo isn't unique
                    if (err.errors.pseudo.kind === "unique") {
                        return res.status(400).json({
                            errorType : "pseudo",
                            message : "Ce pseudo est déjà utilisé"
                        });
                    }

                    //pseudo is required
                    if (err.errors.pseudo.kind === "required") {
                        return res.status(400).json({
                            errorType : "pseudo",
                            message : "Veuillez renseigner un pseudo"
                        })
                    }
                }
                return res.status(500).json(err);
            });
        })
        .catch(error => res.status(500).json({error}));  
}

// User login
exports.login = (req, res, next) => {
    // Set cryptage for email
    const keyutf = cryptoJS.enc.Utf8.parse(process.env.CRYPTO_JS_KEY);
    const iv = cryptoJS.enc.Base64.parse(process.env.CRYPTO_JS_KEY);
    // Encrypt email
    const cryptedEmail = cryptoJS.AES.encrypt(req.body.email, keyutf, {iv: iv}).toString();

    // Use this code if you want to decrypt an encrypted email
    // const decryptedEmail = cryptoJS.AES.decrypt({ciphertext : cryptoJS.enc.Base64.parse(cryptedEmail)}, keyutf, {iv : iv});
    // const dec = cryptoJS.enc.Utf8.stringify(decryptedEmail);

    // Find user in database by email
    User.findOne({email: cryptedEmail})
    .then(user => {
        // Check if e-mail user exist in database
        if(!user) {
            return res.status(400).json({
                errorType: "email",
                message : "Utilisateur introuvable"
            });
        }
        // Check if the request password match the database user password
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // If it's the wrong password = error
            if(!valid) {
                return res.status(400).json({
                    errorType : "password",
                    message : "Mot de passe incorrect"
                });  
            }
            // Login success = return a json object with userId and token
            return res.status(200).json({
                pseudo: user.pseudo,
                userId : user._id,
                token : jwt.sign(
                        {userId : user._id},
                        process.env.TOKEN_SECRET,
                        {expiresIn: "24h"}
                    ),
                isAdmin : user.isAdmin
            });
        }) 
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};