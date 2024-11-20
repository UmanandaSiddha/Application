// import privacy from '/assets/privacy.svg';

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="h-full bg-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 p-10 m-8">
               <div className="flex items-center justify-start p-8">
                <div className="text-4xl">Privacy Policy</div>
               </div>
               <div className="p-8">
                    <div className="font-extrabold">Introduction:-</div>
                    <p className="mt-2">Voolata, operated under Evool Foundation (a Section 8 Non-Profit Company), respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website voolata.com and engage with our services.</p>
                    <p className="mt-2">By using our website, you agree to the collection and use of your information in accordance with this policy. If you do not agree to the terms of this policy, please do not use our services.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Information We Collect:-</div>
                    <div className="font-bold mt-2">Personal Data:-</div>
                    <p>We collect personal data when you voluntarily provide it through various interactions on our website, including:-</p>
                    <li className="mt-1">Registration Data: When you sign up for an account using your email or Google account, we collect your name, email address, and other relevant contact information.</li>
                    <li className="mt-1">Transaction Data: When making purchases, donations, or subscribing to services, we may collect payment and billing information</li>
                    <li className="mt-1">Communication Data: If you contact us via email or other communication methods, we may collect your correspondence details.</li>

                    <div className="font-bold mt-2">Non Personal Data:-</div>
                    <p>We also collect non-personal data, such as:-</p>
                    <li className="mt-1">Usage Data: Information about how you interact with our website, including browser type, IP address, pages visited, and the time spent on each page.</li>
                    <li className="mt-1">Cookies and Tracking Technologies: We use cookies to enhance user experience, track user preferences, and analyse website traffic. You may opt out of cookies through your browser settings, but this could limit certain functionalities.</li>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">How We Use Your Information:-</div>
                    <p>Voolata and Evool Foundation use your personal and non-personal information for the following purposes:-</p>
                    <li className="mt-1">Service Delivery: To provide, maintain, and improve our website and related services.</li>
                    <li className="mt-1">User Authentication: To verify your identity when signing in through email or Google accounts.</li>
                    <li className="mt-1">Payment Processing: To process payments and donations securely.</li>
                    <li className="mt-1">Communication: To send you updates, newsletters, or respond to your inquiries</li>
                    <li className="mt-1">Compliance and Protection: To comply with legal obligations and protect the rights, property, and safety of Voolata, Evool Foundation, and our users.</li>
                </div>

            </div>
            
            {/* <img src={privacy} alt="" /> */}
        </div>
    )
}

export default PrivacyPolicyPage;