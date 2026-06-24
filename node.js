const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.verifyPaystack = functions.https.onRequest(async(req,res)=>{

const reference = req.body.reference;
const uid = req.body.uid;

const response = await axios.get(
`https://api.paystack.co/transaction/verify/${reference}`,
{
headers:{
Authorization:`Bearer YOUR_PAYSTACK_SECRET_KEY`
}
}
);

const data = response.data.data;

if(data.status === "success"){

await admin.firestore()
.collection("members")
.doc(uid)
.set({
paid:true,
reference,
email:data.customer.email
});

return res.json({success:true});
}

return res.json({success:false});

});
