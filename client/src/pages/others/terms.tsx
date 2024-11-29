import React from 'react';

const TermsAndConditions: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] px-4">
            <div className="h-full bg-white shadow-2xl w-full max-w-[1000px] rounded-lg p-6 md:p-10 m-8">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row items-center justify-start p-4 md:p-8 mb-4 gap-4 md:gap-0">
                    <img
                        src="/terms.png"
                        alt="Terms"
                        className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 mr-4"
                    />
                    <div className="text-3xl md:text-4xl font-bold text-center md:text-left">Terms and Conditions</div>
                </div>

                {/* Content Sections */}
                {[
                    {
                        title: "Introduction:",
                        content: "Welcome to voolata.com, a website operated by Evool Foundation, a nonprofit organization registered under Section 8 of the Companies Act, 2013. These Terms and Conditions govern your access to and use of our website and services. By using our website, you agree to comply with these terms. If you do not agree with these terms, please do not use our website or services."
                    },
                    {
                        title: "Definitions:",
                        content: [
                            "“We”, “Us”, or “Our” refers to Voolata, operated by Evool Foundation.",
                            "“You” or “User” refers to any individual accessing or using the website or services.",
                            "“Service” refers to the features, functionality, and information provided through our website."
                        ]
                    },
                    {
                        title: "Eligibility:",
                        content: "By accessing the website, you affirm that you are at least 18 years old or have the consent of a parent or legal guardian to use the website. You agree to comply with all applicable laws and regulations while using the site."
                    },
                    {
                        title: "Donations:",
                        content: [
                            "Voolata, through Evool Foundation, accepts voluntary donations to support its charitable work. By making a donation, you agree that:",
                            "Donations are voluntary and non-refundable, except under exceptional circumstances outlined in our Refund Policy.",
                            "Donations are used for general charitable purposes unless otherwise specified.",
                            "*Please refer to our Refund Policy for more details on refund requests."
                        ]
                    },
                    {
                        title: "User Accounts:",
                        content: [
                            "To access certain features of the website, you may be required to create a user account. You may register using an email address or a Google account. By creating an account, you agree to the following:",
                            "Accuracy of Information: You will provide accurate, current, and complete information during registration and update it as necessary.",
                            "Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
                            "Account Termination: We reserve the right to suspend or terminate your account at our discretion for violations of these terms or any applicable laws."
                        ]
                    },
                    {
                        title: "User-Generated Content:",
                        content: [
                            "Users may submit content, such as comments, feedback, or other materials, through our website. By submitting content, you agree to the following:",
                            "Ownership and Responsibility: You retain ownership of the content you submit, post, or display on or through the Voolata platform. However, by submitting User-Generated Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, distribute, display, and perform the content for the purposes of operating and promoting the website and our services. You are responsible for the content you submit, and you agree that it does not violate any applicable laws or infringe on the rights of any third parties.",
                            "Prohibited Content: You agree not to upload, post, or share content that violates any local, state, or national laws or regulations, is defamatory, obscene, abusive, harassing, threatening, or hateful, contains any viruses, malware, or harmful code, is intended to impersonate another person or entity, or promotes any illegal activity or violates the rights of others.",
                            "Content Moderation: Voolata reserves the right, but is not obligated, to review, monitor, or remove User-Generated Content that we, at our sole discretion, deem inappropriate, offensive, or in violation of these Terms and Conditions. We may also suspend or terminate accounts that repeatedly violate our content guidelines.",
                            "No Endorsement: Voolata does not endorse any User-Generated Content submitted by users. The views expressed in such content are solely those of the users and do not reflect the opinions or views of Voolata or Evool Foundation. We are not liable for any harm or damages resulting from user-submitted content.",
                            "Content Removal: Voolata retains the right to remove any User-Generated Content without prior notice, especially if it violates these terms. Users who repeatedly violate our guidelines may have their accounts suspended or terminated.",
                            "Content Storage: Voolata does not guarantee the permanent storage of User-Generated Content. Users are responsible for maintaining backup copies of their content, and we are not liable for any loss or deletion of data due to system errors or maintenance.",
                            "Reporting Inappropriate Content: If you encounter User-Generated Content that violates these terms, you may report it to us at contactus@evoolfoundation.org. We will review all reported content and take appropriate action where necessary."
                        ]
                    },
                    {
                        title: "Use of Website:",
                        content: [
                            "You agree to use the website for lawful purposes only. Prohibited activities include but are not limited to:",
                            "Attempting to interfere with the proper functioning of the website, including hacking, phishing, or introducing malware.",
                            "Using the website to transmit or distribute harmful, offensive, or illegal materials.",
                            "We reserve the right to suspend or terminate access to the website for any user engaging in prohibited conduct."
                        ]
                    },
                    {
                        title: "Intellectual Property Rights:",
                        content: "All content on the website, including text, images, logos, and designs, is owned by Voolata or its licensors. You may not reproduce, modify, distribute, or create derivative works of any content without our express permission."
                    },
                    {
                        title: "Third-Party Links:",
                        content: "Our website may contain links to third-party websites or services. These links are provided for your convenience, and we do not endorse or assume responsibility for the content, privacy policies, or practices of these external sites."
                    },
                    {
                        title: "Limitation of Liability:",
                        content: "To the fullest extent permitted by law, Evool Foundation and Voolata will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or any of our services. This includes, but is not limited to, loss of data, profits, or goodwill, even if we have been advised of the possibility of such damages."
                    },
                    {
                        title: "Privacy Policy:",
                        content: "Your use of this website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information."
                    },
                    {
                        title: "Amendments to Terms:",
                        content: "We reserve the right to modify or update these Terms and Conditions at any time. Changes will be posted on this page, and your continued use of the website following the posting of such changes constitutes your acceptance of the new terms."
                    },
                    {
                        title: "Governing Law:",
                        content: "These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of Maharashtra, India."
                    },
                    {
                        title: "Contact Information:",
                        content: "If you have any questions or concerns about these Terms and Conditions, please contact us at:",
                        additionalInfo: [
                            "Evool Foundation:",
                            "105, P-17, Omkar CHS Ltd, Noopur Nagar Mataji Mandir, Mira Road, Thane,",
                            "Thane- 401107, Maharashtra, India",
                            "Email: contactus@evoolfoundation.org"
                        ]
                    }
                ].map((section, index) => (
                    <div key={index} className="p-4 md:p-8">
                        <div className="font-extrabold">{section.title}</div>
                        {Array.isArray(section.content) ? (
                            <ul className="list-disc list-inside mt-2 text-sm md:text-base">
                                {section.content.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 text-sm md:text-base">{section.content}</p>
                        )}
                        {section.additionalInfo && (
                            <div className="mt-2 text-sm md:text-base">
                                {section.additionalInfo.map((info, i) => (
                                    <p key={i}>{info}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TermsAndConditions;