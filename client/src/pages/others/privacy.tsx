import { Helmet } from "react-helmet-async";

const PrivacyPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Voolata | Privacy Policy</title>
                <meta name="description" content={`This is the privacy policy page of Voolata`} />
                <meta name="keywords" content="privacy policy, voolata" />
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] px-4">
                <div className="h-full bg-white shadow-2xl w-full max-w-[1000px] rounded-lg p-6 md:p-10 m-8">
                    {/* Title and Image Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8 mb-4 gap-4 md:gap-0">
                        <div className="text-3xl md:text-4xl font-bold text-center md:text-left">Privacy Policy</div>
                        <img
                            src="/privacy.svg"
                            alt="Privacy Icon"
                            className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36"
                        />
                    </div>

                    {/* Privacy Content */}
                    <div className="p-4 md:p-8">
                        <div className="font-extrabold">Introduction:</div>
                        <p className="mt-2 text-sm md:text-base">Voolata, operated under Evool Foundation (a Section 8 Non-Profit Company), respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website voolata.com and engage with our services.</p>
                        <p className="mt-2 text-sm md:text-base">By using our website, you agree to the collection and use of your information in accordance with this policy. If you do not agree to the terms of this policy, please do not use our services.</p>
                    </div>

                    {/* Information We Collect Section */}
                    <div className="p-4 md:p-8">
                        <div className="font-extrabold">Information We Collect:</div>
                        <div className="font-bold mt-2">Personal Data:</div>
                        <p className="text-sm md:text-base">We collect personal data when you voluntarily provide it through various interactions on our website, including:</p>
                        <ul className="list-disc list-inside mt-2 text-sm md:text-base">
                            <li>Registration Data: When you sign up for an account using your email or Google account, we collect your name, email address, and other relevant contact information.</li>
                            <li>Transaction Data: When making purchases, donations, or subscribing to services, we may collect payment and billing information.</li>
                            <li>Communication Data: If you contact us via email or other communication methods, we may collect your correspondence details.</li>
                        </ul>

                        <div className="font-bold mt-4">Non Personal Data:</div>
                        <p className="text-sm md:text-base">We also collect non-personal data, such as:</p>
                        <ul className="list-disc list-inside mt-2 text-sm md:text-base">
                            <li>Usage Data: Information about how you interact with our website, including browser type, IP address, pages visited, and the time spent on each page.</li>
                            <li>Cookies and Tracking Technologies: We use cookies to enhance user experience, track user preferences, and analyse website traffic. You may opt out of cookies through your browser settings, but this could limit certain functionalities.</li>
                        </ul>
                    </div>

                    {/* Additional Sections */}
                    {[
                        { title: "How We Use Your Information:", text: "Voolata and Evool Foundation use your personal and non-personal information for the following purposes:", items: ["Service Delivery: To provide, maintain, and improve our website and related services.", "User Authentication: To verify your identity when signing in through email or Google accounts.", "Payment Processing: To process payments and donations securely.", "Communication: To send you updates, newsletters, or respond to your inquiries.", "Compliance and Protection: To comply with legal obligations and protect the rights, property, and safety of Voolata, Evool Foundation, and our users."] },
                        { title: "Data Sharing and Disclosure:", text: "We do not sell or rent your personal information to third parties. However, we may share your data in the following instances:", items: ["Service Providers: We engage trusted third-party vendors for services such as payment processing, data storage, and email marketing. These vendors are contractually bound to maintain the confidentiality and security of your information.", "Legal Obligations: We may disclose your data when required by law, such as in response to a court order or government request, or to protect our rights and the safety of others.", "Business Transfers: In the event of a merger, acquisition, or restructuring of Voolata or Evool Foundation, your information may be transferred as part of the business assets."] },
                        { title: "Data Security:", text: "We are committed to securing your personal data and have implemented appropriate technical and organizational measures to prevent unauthorized access, misuse, or loss of your data. Despite these measures, no internet-based service is completely secure, and we cannot guarantee the absolute security of your information." }
                    ].map((section, index) => (
                        <div key={index} className="p-4 md:p-8">
                            <div className="font-extrabold">{section.title}</div>
                            <p className="mt-2 text-sm md:text-base">{section.text}</p>
                            {section.items && (
                                <ul className="list-disc list-inside mt-2 text-sm md:text-base">
                                    {section.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {/* Contact Information Section */}
                    <div className="p-4 md:p-8">
                        <div className="font-extrabold">Contact Information:</div>
                        <p className="text-sm md:text-base">If you have any questions or concerns about this Privacy Policy or wish to exercise your rights, please contact us at:</p>
                        <p className="font-bold mt-2 text-sm md:text-base">Voolata</p>
                        <p className="text-sm md:text-base">c/o Evool Foundation</p>
                        <p className="text-sm md:text-base">105, P-17, Omkar CHS Ltd, Noopur Nagar Mataji Mandir, Mira Road, Thane,</p>
                        <p className="text-sm md:text-base">Thane- 401107, Maharashtra, India</p>
                        <p className="text-sm md:text-base">Email: contactus@evoolfoundation.org</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PrivacyPolicyPage;