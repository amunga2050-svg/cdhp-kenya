const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";

const shortCode = "174379";
const passkey = "bfb279f9aa9bdbcf158e97dd0e9b5c74";

async function getAccessToken() {

const auth = Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");

const response = await axios.get(
"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
{
headers:{
Authorization:`Basic ${auth}`
}
}
);

return response.data.access_token;
}

app.post("/pay", async (req,res)=>{

const {phone,amount} = req.body;

const token = await getAccessToken();

const timestamp = new Date().toISOString().replace(/[^0-9]/g,"").slice(0,14);

const password = Buffer.from(shortCode+passkey+timestamp).toString("base64");

const stkPush = await axios.post(
"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
{
BusinessShortCode:shortCode,
Password:password,
Timestamp:timestamp,
TransactionType:"CustomerPayBillOnline",
Amount:amount,
PartyA:phone,
PartyB:shortCode,
PhoneNumber:phone,
CallBackURL:"https://cdhp-kenya-1.onrender.com/callback",
AccountReference:"CDHP Donation",
TransactionDesc:"Donation"
},
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

res.json(stkPush.data);

});

app.post("/callback",(req,res)=>{

console.log("Payment confirmation:",req.body);

res.sendStatus(200);

});

app.listen(process.env.PORT || 3000,()=>{
console.log("Server running");
});
