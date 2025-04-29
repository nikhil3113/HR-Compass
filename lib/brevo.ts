import * as SibApiV3Sdk from "sib-api-v3-typescript";

export async function sendOTP(email: string, otp: string) {
  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        status: 400,
        message: "Invalid email address.",
      };
    }

    if (!process.env.BREVO_API_KEY || !process.env.SMTP_EMAIL) {
      return {
        status: 500,
        message: "Brevo API key is not set in environment variables.",
      };
    }

    console.log("Sending OTP to:", email, "with code:", otp);

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "HR Bot",
      email: process.env.SMTP_EMAIL,
    };

    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Your HR Bot verification code";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">HR Bot Verification</h1>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
          <p style="margin-bottom: 10px; font-size: 16px;">Your verification code is:</p>
          <h2 style="color: #0066cc; letter-spacing: 2px; font-size: 32px; margin: 10px 0;">${otp}</h2>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
        <p style="color: #888; text-align: center; font-size: 12px; margin-top: 20px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Brevo API response:", JSON.stringify(result, null, 2));

    return {
      status: 200,
      message: "OTP sent successfully.",
      messageId: result.body.messageId,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      status: 500,
      message: `Failed to send OTP: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
