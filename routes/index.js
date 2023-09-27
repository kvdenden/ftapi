const express = require("express");
const router = express.Router();

const { isAddress, getAddress } = require("ethers");
const db = require("../db");

router.get("/search", async (req, res) => {
  const { q } = req.query;

  const results = isAddress(q)
    ? await db.select("username", "wallet").from("users").where("wallet", getAddress(q))
    : await db.select("username", "wallet").from("users").where("username", "like", `%${q.toLowerCase()}%`);

  console.log("results", results);

  res.json({ q, results });
});

router.get("/users/:username", async (req, res) => {
  const { username } = req.params;

  const [wallet] = await db.pluck("wallet").from("users").where("username", username.toLowerCase());

  if (wallet) {
    res.json({ wallet });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
