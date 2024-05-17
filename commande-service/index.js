const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;
const mongoose = require("mongoose");
const Commande = require("./Commande");
const axios = require("axios");
const isAuthenticated = require("./isAuthenticated");

app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://db:27017/commande-service")
  .then(() => {
    console.log("Commande-service DB Connected");
  })
  .catch((error) => console.log(error));

function prixTotal(produits) {
  let total = 0;
  for (let i = 0; i < produits.length; i++) {
    total += produits[i].prix;
  }
  console.log("prix total : " + total);
  return total;
}

async function httpRequest(ids) {
  try {
    const URL = "http://produits:4000/produit/acheter";
    const response = await axios.get(URL, {
      params: { ids: ids }, // Send ids as query parameter
    });
    return prixTotal(response.data);
  } catch (error) {
    console.log(error);
  }
}

app.post("/commande/ajouter",isAuthenticated, async (req, res, next) => {
  const {  ids } = req.body;
  httpRequest(req.body.ids).then((total) => {
    const newCommande = new Commande({
      produits: ids,
      email_utilisateur: req.user.email,
      prix_total: total,
    });
    newCommande
      .save()
      .then((commande) => res.status(201).json(commande))
      .catch((error) => res.status(400).json({ error }));
  });
});

app.listen(PORT, () => {
  console.log(`Commande-service at ${PORT}`);
});
