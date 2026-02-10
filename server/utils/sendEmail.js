import axios from "axios";

// Send email using Brevo API (v3)
const sendEmail = async ({ email, subject, message, html }) => {
  try {
    const data = {
      sender: {
        name: process.env.FROM_NAME || "SYRUS",
        email: process.env.SMTP_EMAIL || "noreply@syrus.com",
      },
      to: [
        {
          email: email,
        },
      ],
      subject: subject,
      htmlContent: html || message,
    };

    const config = {
      headers: {
        "api-key": process.env.SMTP_PASSWORD, // Using the API Key here
        "Content-Type": "application/json",
        accept: "application/json",
      },
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      config,
    );

    console.log("Email sent successfully via Brevo API:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending email via Brevo API:",
      error.response?.data || error.message,
    );
    // Don't throw error to prevent 500 on registration, but log it.
    // However, user needs OTP. So maybe throw but catch in controller and return success with warning?
    // Let's throw for now so we know it failed.
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
