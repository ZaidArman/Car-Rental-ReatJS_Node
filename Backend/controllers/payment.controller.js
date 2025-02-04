// Backend Implementation (paymentController.js)

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");


const createCharges = async (req, res) => {
    try {
      // Create a charge with Stripe using the Payment Method ID
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(req.body.amount) * 100, // Convert to cents
        currency: "USD", // Update with your currency
        payment_method: req.body.paymentMethodId,
        confirm: true,
        description: "Payment for booking ID: " + req.body.bookingId,
        return_url: "https://yourdomain.com/payment/success", // Update with your actual success URL
      });
      console.log(paymentIntent, "payment intent")
if(paymentIntent?.status !== "succeeded") {
   
  res.status(400).json({message: "charges not detected , try again"})
}
      // Update booking status to paid
      // You need to implement this part based on your database schema
    //  
      // Update booking status to 'paid' in your database here
      const bookingId = req.body.bookingId;
      await  Booking.findByIdAndUpdate(
          bookingId,
          { $set: { status: "paid" } },
          { new: true }
        );
    //   Assuming you have the necessary data to create a Payment object
     const payment = Payment.create({
      bookingId: req.body.bookingId,
      paymentMethod: "stripe",
      paymentAmount: req.body.amount,

      stripeId: paymentIntent.id, // Store Stripe Payment Intent ID
    });
  
      res.status(200).json({ success: true, payment });
    } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
    }
  };

const getStripeKey = async(req,res) => {
    return ( res.status(200).json({stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY })
)};

module.exports = { createCharges ,getStripeKey };
