const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
const pwValidator = require("../services/pw-validator");
const emailRegex = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

exports.signup = (req, res, next) => {
    const keyutf = cryptoJS.enc.Utf8.parse(process.env.CRYPTO_JS_KEY);
    const iv = cryptoJS.enc.Base64.parse(process.env.CRYPTO_JS_KEY);
    const cryptedEmail = cryptoJS.AES.encrypt(req.body.email, keyutf, {iv: iv}).toString();

    pwErrorCount = pwValidator.validate(req.body.password, {details: true});

    if(!emailRegex.test(req.body.email)) {
        return res.status(400).json({error: "email invalide"});
    } else if (pwErrorCount.length === 0) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email : cryptedEmail,
                password : hash
            });
            user.save()
            .then(() => res.status(201).json({message: "Utilisateur créé !"}))
            .catch(error => res.status(400).json({error: error}));
        })
        .catch(error => res.status(500).json({error}));
    } else {
        return res.status(400).json({error : pwErrorCount});
    }  
}

exports.login = (req, res, next) => {
    const keyutf = cryptoJS.enc.Utf8.parse(process.env.CRYPTO_JS_KEY);
    const iv = cryptoJS.enc.Base64.parse(process.env.CRYPTO_JS_KEY);
    const cryptedEmail = cryptoJS.AES.encrypt(req.body.email, keyutf, {iv: iv}).toString();

    User.findOne({email: cryptedEmail})
    .then(user => {

        if(!user) {
            res.status(400).json({error: "Utilisateur introuvable"});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(400).json({error: "Mot de passe incorrect"});  
            }
            return res.status(200).json({
                userId : user._id,
                token : jwt.sign(
                        {userId : user._id},
                        process.env.TOKEN_SECRET,
                        {expiresIn: "12h"}
                    )
            });
        }) 
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};