import privacy from '/assets/privacy.svg';

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="h-full bg-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl p-10 m-8">
                {/* Title and Image Section */}
                <div className="flex items-center justify-between p-8 mb-4">
                    <div className="text-4xl font-bold">Privacy Policy</div>
                    <img 
                        src={privacy} 
                        alt="Privacy Icon" 
                        className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36" 
                    />
                </div>
                
                {/* Privacy Content */}
                <div className="p-8">
                    <div className="font-extrabold">Introduction:-</div>
                    <p className="mt-2">Voolata, operated under Evool Foundation (a Section 8 Non-Profit Company), respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website voolata.com and engage with our services.</p>
                    <p className="mt-2">By using our website, you agree to the collection and use of your information in accordance with this policy. If you do not agree to the terms of this policy, please do not use our services.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Information We Collect:-</div>
                    <div className="font-bold mt-2">Personal Data:-</div>
                    <p>We collect personal data when you voluntarily provide it through various interactions on our website, including:-</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Registration Data: When you sign up for an account using your email or Google account, we collect your name, email address, and other relevant contact information.</li>
                        <li>Transaction Data: When making purchases, donations, or subscribing to services, we may collect payment and billing information.</li>
                        <li>Communication Data: If you contact us via email or other communication methods, we may collect your correspondence details.</li>
                    </ul>

                    <div className="font-bold mt-4">Non Personal Data:-</div>
                    <p>We also collect non-personal data, such as:-</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Usage Data: Information about how you interact with our website, including browser type, IP address, pages visited, and the time spent on each page.</li>
                        <li>Cookies and Tracking Technologies: We use cookies to enhance user experience, track user preferences, and analyse website traffic. You may opt out of cookies through your browser settings, but this could limit certain functionalities.</li>
                    </ul>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">How We Use Your Information:-</div>
                    <p>Voolata and Evool Foundation use your personal and non-personal information for the following purposes:-</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Service Delivery: To provide, maintain, and improve our website and related services.</li>
                        <li>User Authentication: To verify your identity when signing in through email or Google accounts.</li>
                        <li>Payment Processing: To process payments and donations securely.</li>
                        <li>Communication: To send you updates, newsletters, or respond to your inquiries.</li>
                        <li>Compliance and Protection: To comply with legal obligations and protect the rights, property, and safety of Voolata, Evool Foundation, and our users.</li>
                    </ul>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Data Sharing and Disclosure:-</div>
                    <p>We do not sell or rent your personal information to third parties. However, we may share your data in the following instances:-</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Service Providers: We engage trusted third-party vendors for services such as payment processing, data storage, and email marketing. These vendors are contractually bound to maintain the confidentiality and security of your information.</li>
                        <li>Legal Obligations: We may disclose your data when required by law, such as in response to a court order or government request, or to protect our rights and the safety of others.</li>
                        <li>Business Transfers: In the event of a merger, acquisition, or restructuring of Voolata or Evool Foundation, your information may be transferred as part of the business assets.</li>
                    </ul>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Data Security:-</div>
                    <p>We are committed to securing your personal data and have implemented appropriate technical and organizational measures to prevent unauthorized access, misuse, or loss of your data. Despite these measures, no internet-based service is completely secure, and we cannot guarantee the absolute security of your information.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Your Data Protection Rights:-</div>
                    <p>As a user in India, you have specific rights under the Information Technology Act, 2000, and other applicable data protection laws:-</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Right to Access: You can request a copy of the personal data we hold about you.</li>
                        <li>Right to Correction: You have the right to request corrections of any inaccurate or incomplete personal information.</li>
                        <li>Right to Deletion: You can request the deletion of your personal data, subject to certain conditions, such as for fulfilling legal obligations.</li>
                        <li>Right to Object: You may object to certain uses of your personal data, such as marketing communications.</li>
                    </ul>
                    <p className="mt-2">To exercise any of these rights, please contact us at contactus@evoolfoundation.org. We will respond to your requests in accordance with applicable laws.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Retention of Data:-</div>
                    <p>We retain your personal data only as long as necessary to fulfil the purposes outlined in this Privacy Policy or as required by law. When your personal data is no longer needed, we securely delete or anonymize it.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Use of Third-Party Services:-</div>
                    <p>Our website may contain links to third-party websites or services, such as payment processors or social media platforms. Voolata and Evool Foundation are not responsible for the privacy practices or content of these third-party sites. We recommend reviewing their privacy policies before interacting with them.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Children's Privacy:-</div>
                    <p>Our website and services are not directed toward children under the age of 13. We do not knowingly collect personal information from children. If we discover that we have collected information from a child, we will promptly take steps to delete such data.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Changes to This Privacy Policy:-</div>
                    <p>We may update this Privacy Policy periodically to reflect changes in our practices, legal requirements, or regulatory changes. Any updates will be posted on this page, with an updated "Effective Date." We encourage you to review this page regularly.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">Contact Information:-</div>
                    <p>If you have any questions or concerns about this Privacy Policy or wish to exercise your rights, please contact us at:</p>
                    <p className="font-bold mt-2">Voolata</p>
                    <p>c/o Evool Foundation</p>
                    <p>105, P-17, Omkar CHS Ltd, Noopur Nagar Mataji Mandir, Mira Road, Thane,</p>
                    <p>Thane- 401107, Maharashtra, India</p>
                    <p>Email: contactus@evoolfoundation.org</p>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicyPage;
