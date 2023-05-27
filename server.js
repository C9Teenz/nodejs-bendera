const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const appRoute = require("./routes/routes");
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/", appRoute);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is listening on port ${port}`);
});
