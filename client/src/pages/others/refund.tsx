import refund from '/assets/refund.png'; // Assuming you have a relevant SVG image

const RefundPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="h-full bg-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl p-10 m-8">
                {/* Title and Image Section */}
                <div className="flex items-center justify-between p-8 mb-4">
                    <div className="text-4xl font-bold">Refund Policy for Donations</div>
                    <img
                        src={refund}
                        alt="Refund Policy Icon"
                        className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36"
                    />
                </div>

                {/* Refund Policy Content */}
                <div className="p-8">
                    <div className="font-extrabold">1. Introduction</div>
                    <p className="mt-2">Evool Foundation, operating under the platform Voolata, greatly appreciates the donations that support our mission. As a nonprofit organization registered under Section 8 of the Companies Act, 2013, your contributions are vital to furthering our cause. This refund policy outlines the circumstances under which we may process refund requests for donations.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">2. Donations are Non-Refundable</div>
                    <p className="mt-2">In general, donations made to Evool Foundation via voolata.com are considered final and are not eligible for refunds. Once a donation is made, it is immediately put to use in our charitable projects and programs, and we cannot typically offer refunds.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">3. Exceptional Circumstances for Refunds</div>
                    <p>We understand that there may be situations where a refund request is warranted. Refunds may be considered under the following exceptional circumstances:</p>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Accidental Donations:</strong> If you made a donation by mistake (e.g., you accidentally donated a larger amount than intended or made multiple donations), you may request a refund.</li>
                        <li className="mt-2"><strong>Unauthorized Transactions:</strong> If you believe that your donation was made fraudulently or without your permission, please contact us immediately to resolve the issue.</li>
                        <li className="mt-2"><strong>Technical Errors:</strong> In case of technical issues on our platform, such as duplicate donations due to a payment system error, you may be eligible for a refund.</li>
                    </ul>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">4. Refund Request Process</div>
                    <p>If you believe that your donation meets the criteria for a refund as outlined above, please follow the steps below to request a refund:</p>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Email Us:</strong> Submit your refund request via email to <a href="mailto:contactus@evoolfoundation.org" className="text-blue-600">contactus@evoolfoundation.org</a>.</li>
                        <li className="mt-2"><strong>Include Details:</strong> In your email, please include your full name, donation amount, date of donation, and the reason for your refund request.</li>
                        <li className="mt-2"><strong>Time Frame:</strong> Refund requests must be made within 14 days of the donation date. We will not be able to process refund requests received after this period.</li>
                    </ul>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">5. Processing of Refunds</div>
                    <p>Once we receive your refund request, we will review it and notify you of our decision within 10 business days. If approved, refunds will be processed through the original payment method used for the donation. Please allow 5-7 business days for the refund to appear in your account after approval, depending on your payment provider.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">6. Tax Deductions and Refunds</div>
                    <p>If you have received a tax deduction receipt for your donation, you must relinquish the tax benefit claim for the refunded amount. Evool Foundation will issue a corrected donation receipt, reflecting the refunded donation. Please consult with your tax advisor if needed.</p>
                </div>

                <div className="p-8">
                    <div className="font-extrabold">7. Contact Information</div>
                    <p>For further inquiries or assistance regarding donation refunds, please contact us at:</p>
                    <p className="font-bold mt-4">Evool Foundation</p>
                    <p>105, P-17, Omkar CHS Ltd, Noopur Nagar Mataji Mandir, Mira Road, Thane,</p>
                    <p>Thane- 401107, Maharashtra, India</p>
                    <p>Email: <a href="mailto:contactus@evoolfoundation.org" className="text-blue-600">contactus@evoolfoundation.org</a></p>
                </div>
            </div>
        </div>
    );
}

export default RefundPolicyPage;
