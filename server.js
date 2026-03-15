const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
res.send("Mpesa Backend Running");
});

app.listen(PORT,()=>{
console.log("Server running on port " + PORT);
});
