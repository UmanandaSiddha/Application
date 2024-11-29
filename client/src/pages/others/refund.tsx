import React from 'react';

const RefundPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] px-4">
            <div className="h-full bg-white shadow-2xl w-full max-w-[1000px] rounded-lg p-6 md:p-10 m-8">
                {/* Title and Image Section */}
                <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8 mb-4 gap-4 md:gap-0">
                    <div className="text-3xl md:text-4xl font-bold text-center md:text-left">Refund Policy for Donations</div>
                    <img
                        src="/refund.png"
                        alt="Refund Policy Icon"
                        className="w-20 h-20 md:w-32 md:h-32 lg:w-36 lg:h-36"
                    />
                </div>

                {/* Refund Policy Content */}
                {[
                    {
                        title: "1. Introduction",
                        content: "Evool Foundation, operating under the platform Voolata, greatly appreciates the donations that support our mission. As a nonprofit organization registered under Section 8 of the Companies Act, 2013, your contributions are vital to furthering our cause. This refund policy outlines the circumstances under which we may process refund requests for donations."
                    },
                    {
                        title: "2. Donations are Non-Refundable",
                        content: "In general, donations made to Evool Foundation via voolata.com are considered final and are not eligible for refunds. Once a donation is made, it is immediately put to use in our charitable projects and programs, and we cannot typically offer refunds."
                    },
                    {
                        title: "3. Exceptional Circumstances for Refunds",
                        content: [
                            "We understand that there may be situations where a refund request is warranted. Refunds may be considered under the following exceptional circumstances:",
                            "Accidental Donations: If you made a donation by mistake (e.g., you accidentally donated a larger amount than intended or made multiple donations), you may request a refund.",
                            "Unauthorized Transactions: If you believe that your donation was made fraudulently or without your permission, please contact us immediately to resolve the issue.",
                            "Technical Errors: In case of technical issues on our platform, such as duplicate donations due to a payment system error, you may be eligible for a refund."
                        ]
                    },
                    {
                        title: "4. Refund Request Process",
                        content: [
                            "If you believe that your donation meets the criteria for a refund as outlined above, please follow the steps below to request a refund:",
                            "Email Us: Submit your refund request via email to contactus@evoolfoundation.org.",
                            "Include Details: In your email, please include your full name, donation amount, date of donation, and the reason for your refund request.",
                            "Time Frame: Refund requests must be made within 14 days of the donation date. We will not be able to process refund requests received after this period."
                        ]
                    },
                    {
                        title: "5. Processing of Refunds",
                        content: "Once we receive your refund request, we will review it and notify you of our decision within 10 business days. If approved, refunds will be processed through the original payment method used for the donation. Please allow 5-7 business days for the refund to appear in your account after approval, depending on your payment provider."
                    },
                    {
                        title: "6. Tax Deductions and Refunds",
                        content: "If you have received a tax deduction receipt for your donation, you must relinquish the tax benefit claim for the refunded amount. Evool Foundation will issue a corrected donation receipt, reflecting the refunded donation. Please consult with your tax advisor if needed."
                    },
                    {
                        title: "7. Contact Information",
                        content: [
                            "For further inquiries or assistance regarding donation refunds, please contact us at:",
                            "Evool Foundation",
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
                                    <li key={i}>
                                        {item.includes("contactus@evoolfoundation.org") ? (
                                            <a
                                                href={`mailto:${item}`}
                                                className="text-blue-600"
                                            >
                                                {item}
                                            </a>
                                        ) : (
                                            item
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 text-sm md:text-base">{section.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RefundPolicyPage;