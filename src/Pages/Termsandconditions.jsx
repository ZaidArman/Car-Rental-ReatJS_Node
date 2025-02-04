import React from 'react';

function TermsAndConditions() {
  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-gray-300 text-bleck p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">TERMS & CONDITIONS</h1>
        <p className="mb-6">
          By using our website, you agree to these Terms and Conditions.
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">User Responsibilities:</h2>
            <p>
              Maintain the confidentiality of your account information and restrict access to your devices. You are responsible for all activities under your account.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Booking and Rental Policies:</h2>
            <p>
              Users must be of legal age with a valid driver’s license to book or rent a car. All bookings are subject to availability and confirmation. Provide accurate and complete information during booking.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Payment and Fees:</h2>
            <p>
              Pay all applicable fees and charges for bookings and rentals, including rental, insurance, fuel, and additional services. Use valid payment methods accepted by the platform.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Insurance and Liability:</h2>
            <p>
              Abide by the rental agreement terms, including insurance coverage and liability limitations. Users are responsible for damages or losses during the rental period.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Prohibited Activities:</h2>
            <p>
              Do not use the platform for unlawful or unauthorized purposes, including fraud, hacking, or transmitting malware. Do not disrupt the website’s functioning or other users’ experiences.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Intellectual Property:</h2>
            <p>
              All content on the website is the property of the platform or its licensors and is protected by copyright and other intellectual property laws.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Changes to Terms:</h2>
            <p>
              We may modify these Terms and Conditions at any time without notice. Review these terms periodically for changes.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Contact Us:</h2>
            <p>
              For questions or concerns, contact us at manas4808294@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
