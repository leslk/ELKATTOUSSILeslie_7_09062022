const User = require("../models/user");

exports.signup = (req, res, next) => {
    console.log(req.body);
    const user = new User ({
        email : req.body.email,
        password : req.body.password
    });
    user.save()
    .then(() => res.status(201).json({message: "Utilisateur créé !"}))
    .catch(error => res.status(400).json({error: error}));
}

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            res.status(400).json({error: "Utilisateur introuvable"});
        } else if (req.body.password != user.password) {
            res.status(400).json({error: "Mot de passe incorrect"});
        }
    })
    .catch(error => res.status(500).json({error: error}));
}