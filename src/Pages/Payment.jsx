import React, { useRef, useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { base_url } from "../config/config";

const Payment = () => {
  const params = useParams();
  const { bookingId, amount } = params;
  const navigate = useNavigate();
  const payBtn = useRef(null);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    setError(null);

    try {
      if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardNumberElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.log("Error:", error.message);
        payBtn.current.disabled = false;
        setError(error.message);
        return;
      }

      const { data } = await axios.post(
        `${base_url}/payment/createCharge`,
        {
          paymentMethodId: paymentMethod.id,
          amount: amount,
          bookingId: bookingId,
        },
      );

      console.log("Payment successful:", data);
      navigate('/RentedVehicle');
    } catch (error) {
      payBtn.current.disabled = false;
      console.log("Server error:", error?.response?.data?.message);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center h-screen pt-5">
      <div className="w-full flex items-center justify-center flex-col h-[80vh]">
        <form
          onSubmit={(e) => submitHandler(e)}
          className="w-72 flex flex-col items-center justify-center gap-8"
        >
          <span className="text-2xl font-bold">Card Info</span>
          <div className="w-full flex flex-row items-center justify-center gap-2 border border-red px-2">
            <CardNumberElement className="outline-none w-full p-4" />
          </div>
          <div className="w-full flex flex-row items-center justify-center gap-2 border border-red px-2">
            <CardExpiryElement className="outline-none w-full p-4" />
          </div>
          <div className="w-full flex flex-row items-center justify-center gap-2 border border-red px-2">
            <CardCvcElement className="outline-none w-full p-4" />
          </div>
          <input
            type="submit"
            value={`Pay - ${amount}`}
            ref={payBtn}
            className="w-full border border-red-500 bg-red-500 px-2 py-3 text-black rounded-md"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Payment;
