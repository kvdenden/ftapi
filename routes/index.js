const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/search", async (req, res) => {
  const { q } = req.query;

  const results = await db.select("username", "wallet").from("users").where("username", "like", `%${q.toLowerCase()}%`);

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
