const express = require("express");
const router = express.Router();

router.get("/users/:username", async (req, res) => {
  const { username } = req.params;

  // TODO: look up user in db
  const user = { wallet: "xxxx" };

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
