const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const Produit = require("./Produit");

app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://db:27017/produit-service")
  .then(() => {
    console.log("Produit-service DB Connected");
  })
  .catch((error) => console.log(error));

app.post("/produit/ajouter", (req, res, next) => {
  const { nom, description, prix } = req.body;
  const newProduit = new Produit({
    nom,
    description,
    prix,
  });
  newProduit
    .save()
    .then((produit) => res.status(201).json(produit))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/produit/acheter", (req, res, next) => {
  const { ids } = req.query; // Access ids from query parameters
  Produit.find({ _id: { $in: ids } })
    .then((produits) => res.status(200).json(produits))
    .catch((error) => res.status(400).json({ error }));
});


app.get("/produit/all", (req, res, next) => {
  Produit.find({}) // Find all products without any filter
    .then((produits) => res.status(200).json(produits))
    .catch((error) => res.status(400).json({ error }));
});

app.listen(PORT, () => {
  console.log(`Produit-service at ${PORT}`);
});
