
const  mongoose  = require("mongoose")


const paymentSchema = new mongoose.Schema(
    {
     bookingId: {
        type: String,
        required: true,
     },
     paymentMethod: {
        type: String,
        required: true,
     },
     paymentAmount: {
        type: String,
        required: true,
     },
     stripeId: {
      type: String,
      required: true,
     }

    },
    { timestamps: true }
  );
  

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;