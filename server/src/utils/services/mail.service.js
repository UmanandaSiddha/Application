import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import {
    EMAIL_ACCOUNT_BLOCKED,
    EMAIL_ACCOUNT_CREATED,
    EMAIL_ACCOUNT_DEACTIVATED,
    EMAIL_ADMIN_CUSTOM_MESSAGE,
    EMAIL_DONATE_CAPTURED,
    EMAIL_OTP_VERIFICATION,
    EMAIL_REPLY_CUSTOM_PLAN,
    EMAIL_REQUEST_CUSTOM_PLAN,
    EMAIL_RESET_PASSWORD,
    EMAIL_SUBSCRIPTION_CANCELLED,
    EMAIL_SUBSCRIPTION_CHARGED,
    EMAIL_SUBSCRIPTION_CREATED,
    EMAIL_SUBSCRIPTION_HALTED,
    EMAIL_SUBSCRIPTION_PAUSED,
    EMAIL_SUBSCRIPTION_PENDING,
    EMAIL_SUBSCRIPTION_RESUMED
} from "../../constants";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EmailToTemplateMapping = {
    [EMAIL_OTP_VERIFICATION]: process.env.TEMPLATE_ID_OTP_VERIFICATION,
    [EMAIL_ACCOUNT_CREATED]: process.env.TEMPLATE_ID_ACCOUNT_CREATED,
    [EMAIL_RESET_PASSWORD]: process.env.TEMPLATE_ID_RESET_PASSWORD,
    [EMAIL_REQUEST_CUSTOM_PLAN]: process.env.TEMPLATE_ID_REQUEST_CUSTOM_PLAN,
    [EMAIL_REPLY_CUSTOM_PLAN]: process.env.TEMPLATE_ID_REPLY_CUSTOM_PLAN,
    [EMAIL_ADMIN_CUSTOM_MESSAGE]: process.env.TEMPLATE_ID_ADMIN_CUSTOM_MESSAGE,
    [EMAIL_ACCOUNT_BLOCKED]: process.env.TEMPLATE_ID_ACCOUNT_BLOCKED,
    [EMAIL_ACCOUNT_DEACTIVATED]: process.env.TEMPLATE_ID_ACCOUNT_DEACTIVATED,
    [EMAIL_SUBSCRIPTION_CREATED]: process.env.TEMPLATE_ID_SUBSCRIPTION_CREATED,
    [EMAIL_SUBSCRIPTION_CHARGED]: process.env.TEMPLATE_ID_SUBSCRIPTION_CHARGED,
    [EMAIL_SUBSCRIPTION_PENDING]: process.env.TEMPLATE_ID_SUBSCRIPTION_PENDING,
    [EMAIL_SUBSCRIPTION_HALTED]: process.env.TEMPLATE_ID_SUBSCRIPTION_HALTED,
    [EMAIL_SUBSCRIPTION_CANCELLED]: process.env.TEMPLATE_ID_SUBSCRIPTION_CANCELLED,
    [EMAIL_SUBSCRIPTION_PAUSED]: process.env.TEMPLATE_ID_SUBSCRIPTION_PAUSED,
    [EMAIL_SUBSCRIPTION_RESUMED]: process.env.TEMPLATE_ID_SUBSCRIPTION_RESUMED,
    [EMAIL_DONATE_CAPTURED]: process.env.TEMPLATE_ID_DONATE_CAPTURED,
}

const msg = {
    from: {
        name: "Voolata",
        email: "umanandasiddha243@gmail.com"
    },
    personalizations: [
        {
            to: [
                {
                    email: "te6095639@gmail.com"
                }
            ],
            dynamic_template_data: {
                otp: "789456",
            }
        }
    ],
    template_id: process.env.VERIFICATION_TEMPLATE_ID
};

sgMail
    .send(msg)
    .then((response) => {
        console.log(response[0]);
    })
    .catch((error) => {
        console.error(error)
    });