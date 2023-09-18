require("dotenv").config();

const express = require("express");
const app = express();

const apiRouter = require("./routes");

app.use("/api", apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
