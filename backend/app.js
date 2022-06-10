const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({path : "./config/.env"});

const app = express();
app.use(express.json());

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post")

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster-groupomania.ipjfu.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;