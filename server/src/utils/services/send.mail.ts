import sgMail, { MailDataRequired } from "@sendgrid/mail";
import {
    EMAIL_ACCOUNT_BLOCKED,
    EMAIL_ACCOUNT_CREATED,
    EMAIL_ACCOUNT_DEACTIVATED,
    EMAIL_ADMIN_CUSTOM_MESSAGE,
    EMAIL_DONATE_CAPTURED,
    EMAIL_DONATE_FAILED,
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
} from "../../constants/template.js";

interface EmailOptions {
    templateId: string;
    recieverEmail: string;
    dynamicData: Record<string, any>;
}

interface EmailTemplateMapping {
    emailTemplate: string;
    templateId: string;
}

const sendMail = async (options: EmailOptions): Promise<void> => {
    const emailTemplateMappings: EmailTemplateMapping[] = [
        {
            emailTemplate: EMAIL_OTP_VERIFICATION,
            templateId: process.env.TEMPLATE_ID_OTP_VERIFICATION as string
        },
        {
            emailTemplate: EMAIL_ACCOUNT_CREATED,
            templateId: process.env.TEMPLATE_ID_ACCOUNT_CREATED as string
        },
        {
            emailTemplate: EMAIL_RESET_PASSWORD,
            templateId: process.env.TEMPLATE_ID_RESET_PASSWORD as string
        },
        {
            emailTemplate: EMAIL_REQUEST_CUSTOM_PLAN,
            templateId: process.env.TEMPLATE_ID_REQUEST_CUSTOM_PLAN as string
        },
        {
            emailTemplate: EMAIL_REPLY_CUSTOM_PLAN,
            templateId: process.env.TEMPLATE_ID_REPLY_CUSTOM_PLAN as string
        },
        {
            emailTemplate: EMAIL_ADMIN_CUSTOM_MESSAGE,
            templateId: process.env.TEMPLATE_ID_ADMIN_CUSTOM_MESSAGE as string
        },
        {
            emailTemplate: EMAIL_ACCOUNT_BLOCKED,
            templateId: process.env.TEMPLATE_ID_ACCOUNT_BLOCKED as string
        },
        {
            emailTemplate: EMAIL_ACCOUNT_DEACTIVATED,
            templateId: process.env.TEMPLATE_ID_ACCOUNT_DEACTIVATED as string
        },
        {
            emailTemplate: EMAIL_SUBSCRIPTION_CREATED,
            templateId: process.env.TEMPLATE_ID_SUBSCRIPTION_CREATED as string
        },
        {
            emailTemplate: EMAIL_SUBSCRIPTION_CHARGED,
            templateId: process.env.TEMPLATE_ID_SUBSCRIPTION_CHARGED as string
        },
        {
            emailTemplate: EMAIL_SUBSCRIPTION_PENDING,
            templateId: process.env.TEMPLATE_ID_SUBSCRIPTION_PENDING as string
        },
        {
            emailTemplate: EMAIL_SUBSCRIPTION_HALTED,
            templateId: process.env.TEMPLATE_ID_SUBSCRIPTION_HALTED as string
        },
        {
            emailTemplate: EMAIL_SUBSCRIPTION_CANCELLED,
            templateId: process.env.TEMPLATE_ID_SUBSCRIPTION_CANCELLED as string
        },
        {
            emailTemplate: EMAIL_SUBSCRIPTION_PAUSED,
            templateId: process.env.TEMPLATE_ID_SUBSCRIPTION_PAUSED as string
        },
        {
            emailTemplate: EMAIL_SUBSCRIPTION_RESUMED,
            templateId: process.env.TEMPLATE_ID_SUBSCRIPTION_RESUMED as string
        },
        {
            emailTemplate: EMAIL_DONATE_CAPTURED,
            templateId: process.env.TEMPLATE_ID_DONATE_CAPTURED as string
        },
        {
            emailTemplate: EMAIL_DONATE_FAILED,
            templateId: process.env.TEMPLATE_ID_DONATE_FAILED as string
        }
    ];
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    try {
        const { templateId, recieverEmail, dynamicData } = options;
        console.log(options)
        const templateMapping = emailTemplateMappings.find(mapping => mapping.emailTemplate === templateId);
        if (!templateMapping) {
            throw new Error(`Template ID not found for ${templateId}`);
        }

        const mail: MailDataRequired = {
            from: {
                name: process.env.ORGANIZATION_NAME as string,
                email: process.env.ORGANIZATION_EMAIL as string,
            },
            personalizations: [
                {
                    to: [{ email: recieverEmail }],
                    dynamicTemplateData: dynamicData
                }
            ],
            templateId: templateMapping.templateId,
        };

        await sgMail.send(mail);
        console.log(`Email sent successfully to ${recieverEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendMail;