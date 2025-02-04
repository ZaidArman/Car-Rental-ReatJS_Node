const express = require('express');
const { addNewCard,  createCharges, getStripeKey  } = require('../controllers/payment.controller');
const router = express.Router();
 
// router.post("/addCard", addNewCard);

router.post("/createCharge", createCharges );
 
router.get("/stripeKey", getStripeKey );


module.exports = router;