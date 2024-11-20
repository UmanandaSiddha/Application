import React from 'react';
import terms from '/assets/terms.png';


const TermsAndConditions: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="h-full bg-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 p-10 m-8">
                <div className="flex items-center justify-start p-8">
                    <img
                        src={terms}
                        alt="Terms"
                        className='w-14 h-14 mr-4'
                    />
                    <div className="text-4xl">Terms and Conditions</div>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Introduction:-</div>
                    <p>Welcome to voolata.com , a website operated by Evool Foundation, a nonprofit organization registered under Section 8 of the Companies Act, 2013. These Terms and Conditions govern your access to and use of our website and services. By using our website, you agree to comply with these terms. If you do not agree with these terms, please do not use our website or services.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Definitions:-</div>

                    <li className="mt-2">“We”, “Us”, or “Our” refers to Voolata, operated by Evool Foundation.</li>
                    <li className="mt-2">“You” or “User” refers to any individual accessing or using the website or services.</li>
                    <li className="mt-2">“Service” refers to the features, functionality, and information provided through our website.</li>

                </div>
                <div className="p-8">
                    <div className="font-extrabold">Eligibility:-</div>
                    <p>By accessing the website, you affirm that you are at least 18 years old or have the consent of a parent or legal guardian to use the website. You agree to comply with all applicable laws and regulations while using the site.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold"> Donations:-</div>
                    <p className="mb-4">Voolata, through Evool Foundation, accepts voluntary donations to support its charitable work. By making a donation, you agree that:</p>

                    <li className="mt-2">Donations are voluntary and non-refundable, except under exceptional circumstances outlined in our Refund Policy.</li>
                    <li className="mt-2">Donations are used for general charitable purposes unless otherwise specified</li>

                    <p className="mt-2 font-bold">*Please refer to our Refund Policy for more details on refund requests.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">User Accounts:-</div>
                    <p className="mb-4">
                        To access certain features of the website, you may be required to create a user account. You may register using an email address or a Google account. By creating an account, you agree to the following:
                    </p>

                    <li className="mt-3">
                        Accuracy of Information: You will provide accurate, current, and complete information during registration and update it as necessary.
                    </li>
                    <li className="mt-3">
                        Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                    </li>
                    <li className="mt-3">
                        Account Termination: We reserve the right to suspend or terminate your account at our discretion for violations of these terms or any applicable laws.
                    </li>

                </div>
                <div className="p-8">
                    <div className="font-extrabold">User-Generated Content:-</div>
                    <p className="mb-4">Users may submit content, such as comments, feedback, or other materials, through our website. By submitting content, you agree to the following:-</p>

                    <li>
                        Ownership and Responsibility: You retain ownership of the content you submit, post, or display on or through the Voolata platform. However, by submitting User-Generated Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, distribute, display, and perform the content for the purposes of operating and promoting the website and our services. You are responsible for the content you submit, and you agree that it does not violate any applicable laws or infringe on the rights of any third parties.
                    </li>
                    <li className="mt-3">
                        Prohibited Content: You agree not to upload, post, or share content that:
                        <li className="ml-5">Violates any local, state, or national laws or regulations;</li>
                        <li className="ml-5">Is defamatory, obscene, abusive, harassing, threatening, or hateful;</li>
                        <li className="ml-5">Contains any viruses, malware, or harmful code;</li>
                        <li className="ml-5">Is intended to impersonate another person or entity;</li>
                        <li className="ml-5">Promotes any illegal activity or violates the rights of others.</li>

                    </li>
                    <li className="mt-3">
                        Content Moderation: Voolata reserves the right, but is not obligated, to review, monitor, or remove User-Generated Content that we, at our sole discretion, deem inappropriate, offensive, or in violation of these Terms and Conditions. We may also suspend or terminate accounts that repeatedly violate our content guidelines.
                    </li>
                    <li className="mt-3">
                        No Endorsement: Voolata does not endorse any User-Generated Content submitted by users. The views expressed in such content are solely those of the users and do not reflect the opinions or views of Voolata or Evool Foundation. We are not liable for any harm or damages resulting from user-submitted content.
                    </li>
                    <li className="mt-3">
                        Content Removal: Voolata retains the right to remove any User-Generated Content without prior notice, especially if it violates these terms. Users who repeatedly violate our guidelines may have their accounts suspended or terminated.
                    </li>
                    <li className="mt-3">
                        Content Storage: Voolata does not guarantee the permanent storage of User-Generated Content. Users are responsible for maintaining backup copies of their content, and we are not liable for any loss or deletion of data due to system errors or maintenance.
                    </li>
                    <li className="mt-3">
                        Reporting Inappropriate Content: If you encounter User-Generated Content that violates these terms, you may report it to us at contactus@evoolfoundation.org. We will review all reported content and take appropriate action where necessary.
                    </li>

                </div>
                <div className="p-8">
                    <div className="font-extrabold">Use of Website:-</div>
                    <p>You agree to use the website for lawful purposes only. Prohibited activities include but are not limited to:</p>

                    <li className="mt-2">Attempting to interfere with the proper functioning of the website, including hacking, phishing, or introducing malware.</li>
                    <li className="mt-2">Using the website to transmit or distribute harmful, offensive, or illegal materials.</li>

                    <p className="mt-3">We reserve the right to suspend or terminate access to the website for any user engaging in prohibited conduct.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Intellectual Property Rights:-</div>
                    <p>All content on the website, including text, images, logos, and designs, is owned by Voolata or its licensors. You may not reproduce, modify, distribute, or create derivative works of any content without our express permission.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Third-Party Links:-</div>
                    <p>Our website may contain links to third-party websites or services. These links are provided for your convenience, and we do not endorse or assume responsibility for the content, privacy policies, or practices of these external sites.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Limitation of Liability:-</div>
                    <p>To the fullest extent permitted by law, Evool Foundation and Voolata will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or any of our services. This includes, but is not limited to, loss of data, profits, or goodwill, even if we have been advised of the possibility of such damages.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Privacy Policy:-</div>
                    <p>Your use of this website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Amendments to Terms:-</div>
                    <p>We reserve the right to modify or update these Terms and Conditions at any time. Changes will be posted on this page, and your continued use of the website following the posting of such changes constitutes your acceptance of the new terms.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Governing Law:-</div>
                    <p>These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of Maharashtra, India.</p>
                </div>
                <div className="p-8">
                    <div className="font-extrabold">Contact Information:-</div>
                    <p>If you have any questions or concerns about these Terms and Conditions, please contact us at:</p>
                    <p className="font-bold mt-3">Evool Foundation:</p>
                    <p>105, P-17, Omkar CHS Ltd, Noopur Nagar Mataji Mandir, Mira Road, Thane,</p>
                    <p>Thane- 401107, Maharashtra, India</p>
                    <p>Email: contactus@evoolfoundation.org</p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
