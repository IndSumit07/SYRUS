import "dotenv/config";
import axios from "axios";

console.log(
  "Testing email with key:",
  process.env.SMTP_PASSWORD.substring(0, 10) + "...",
);

const testEmail = async () => {
  try {
    const data = {
      sender: {
        name: "SYRUS Test",
        email: process.env.SMTP_EMAIL,
      },
      to: [{ email: "test@example.com" }],
      subject: "Test Email from Script",
      htmlContent: "<h1>Test</h1>",
    };

    console.log("Sending data:", data);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": process.env.SMTP_PASSWORD,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Failed:", error.response?.data || error.message);
  }
};

testEmail();
