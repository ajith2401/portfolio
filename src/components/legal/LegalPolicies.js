// src/components/legal/LegalPolicies.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Main wrapper component for all legal policies
export const LegalPoliciesLayout = ({ children, title, backUrl = null }) => {
    const router = useRouter();
  
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={() => backUrl ? router.push(backUrl) : router.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-900">{title}</h1>
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="text-sm text-gray-500 hover:text-gray-900">
              Terms & Conditions
            </Link>
            <Link href="/cancellation-refund" className="text-sm text-gray-500 hover:text-gray-900">
              Cancellation & Refund
            </Link>
            <Link href="/shipping-delivery" className="text-sm text-gray-500 hover:text-gray-900">
              Shipping & Delivery
            </Link>
          </div>
        </div>
      </div>
    );
  };

// Privacy Policy Component
export const PrivacyPolicy = () => {
  return (
    <LegalPoliciesLayout title="Privacy Policy">
      <h2>1. Introduction</h2>
      <p>
        Welcome to our Photography Services. This Privacy Policy explains how we collect, use, disclose, 
        and safeguard your information when you visit our website or use our photography services, including 
        any related mobile applications or features (collectively, the &quot;Services&quot;).
      </p>
      <p>
        We respect your privacy and are committed to protecting your personal data. Please read this 
        Privacy Policy carefully to understand our practices regarding your personal data.
      </p>
      
      <h2>2. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li>
          <strong>Personal Identification Information:</strong> Name, email address, phone number, billing 
          address, and other similar contact data.
        </li>
        <li>
          <strong>Payment Information:</strong> Credit card details, bank account numbers, and other payment 
          details (which are securely processed through our payment processors).
        </li>
        <li>
          <strong>Photography Content:</strong> Images and videos created during our service delivery.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you use our website, products, and services.
        </li>
        <li>
          <strong>Device Information:</strong> Information about the device you use to access our Services.
        </li>
      </ul>
      
      <h2>3. How We Use Your Information</h2>
      <p>We may use the information we collect for various purposes, including to:</p>
      <ul>
        <li>Provide, maintain, and improve our Services</li>
        <li>Process transactions and send related information</li>
        <li>Send administrative information, such as updates or changes to our terms</li>
        <li>Respond to inquiries and provide customer support</li>
        <li>Deliver and maintain the photographs and videos we create for you</li>
        <li>Send marketing communications, if you have opted in to receive them</li>
        <li>Monitor and analyze usage patterns and trends</li>
      </ul>
      
      <h2>4. Sharing Your Information</h2>
      <p>We may share your information with:</p>
      <ul>
        <li>
          <strong>Service Providers:</strong> Third parties that perform services on our behalf, such as payment 
          processing, data analysis, email delivery, and customer service.
        </li>
        <li>
          <strong>Business Partners:</strong> With your consent, we may share your information with business 
          partners to offer you certain products, services, or promotions.
        </li>
        <li>
          <strong>Legal Requirements:</strong> We may disclose your information when required by law or in response 
          to valid legal process.
        </li>
      </ul>
      
      <h2>5. Your Rights and Choices</h2>
      <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
      <ul>
        <li>Access to your personal data</li>
        <li>Correction of inaccurate data</li>
        <li>Deletion of your data</li>
        <li>Restriction or objection to certain processing activities</li>
        <li>Data portability</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
      </p>
      
      <h2>6. Data Security</h2>
      <p>
        We have implemented appropriate technical and organizational measures to protect your personal information 
        from unauthorized access, use, disclosure, alteration, or destruction. However, no method of transmission 
        over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
      </p>
      
      <h2>7. Children&apos;s Privacy</h2>
      <p>
        Our Services are not intended for children under the age of 16. We do not knowingly collect personal 
        information from children under 16. If you are a parent or guardian and believe that your child has 
        provided us with personal information, please contact us so that we can take necessary actions.
      </p>
      
      <h2>8. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
        &quot;Last Updated&quot; date. We encourage you to review this Privacy Policy frequently to stay informed about how 
        we are protecting your information.
      </p>
      
      <h2>9. Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
      </p>
      <p>
        Email: privacy@yourphotographystudio.com<br />
        Phone: +1 (555) 123-4567<br />
        Address: 123 Photography Lane, City, State, ZIP
      </p>
    </LegalPoliciesLayout>
  );
};

// Terms and Conditions Component
export const TermsAndConditions = () => {
  return (
    <LegalPoliciesLayout title="Terms and Conditions">
      <h2>1. Agreement to Terms</h2>
      <p>
        By accessing or using our website, mobile applications, or any of our photography services (collectively, the &quot;Services&quot;), 
        you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, please do not use our Services.
      </p>
      
      <h2>2. Services Description</h2>
      <p>
        We provide professional photography services for various events and purposes including but not limited to weddings, 
        portraits, corporate events, and product photography. The specific services to be provided will be outlined in a 
        separate agreement or booking confirmation.
      </p>
      
      <h2>3. Booking and Payment</h2>
      <p>
        Booking is confirmed upon receipt of a signed contract and the required deposit payment. The deposit amount varies 
        based on the service package selected and is non-refundable except under circumstances outlined in our Cancellation 
        and Refund Policy.
      </p>
      <p>
        Full payment is due according to the payment schedule specified in your booking confirmation. We accept various 
        payment methods including credit/debit cards, bank transfers, and digital payment services.
      </p>
      
      <h2>4. Rescheduling</h2>
      <p>
        Requests to reschedule must be made in writing at least 14 days before the scheduled service date. Rescheduling 
        is subject to our availability and may incur additional fees.
      </p>
      
      <h2>5. Copyright and Usage Rights</h2>
      <p>
        All photographs and videos created by us remain our intellectual property. We grant you a license to use the 
        images for personal and non-commercial purposes. Commercial usage rights may be negotiated separately.
      </p>
      <p>
        We reserve the right to use any photographs or videos created during our service delivery for our portfolio, 
        marketing materials, contests, and other promotional purposes, unless explicitly agreed otherwise in writing.
      </p>
      
      <h2>6. Client Responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate information when booking our services</li>
        <li>Cooperate with photographers and follow reasonable instructions during photo sessions</li>
        <li>Obtain necessary permissions for photography at private venues</li>
        <li>Ensure that all subjects to be photographed have given their consent</li>
      </ul>
      
      <h2>7. Limitation of Liability</h2>
      <p>
        While we take all reasonable care to provide high-quality services, we cannot guarantee specific results or that 
        all images will meet your subjective expectations. Our liability is limited to the amount paid for our services.
      </p>
      <p>
        We are not liable for any failure to perform due to factors beyond our reasonable control, including but not 
        limited to weather conditions, illness, accidents, or equipment failure.
      </p>
      
      <h2>8. Dispute Resolution</h2>
      <p>
        Any disputes arising from or relating to these Terms shall first be attempted to be resolved through good-faith 
        negotiation. If such negotiations fail, the dispute shall be submitted to binding arbitration in accordance with 
        the laws of [Your Jurisdiction].
      </p>
      
      <h2>9. Modifications to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Updated Terms will be posted on our website with the 
        &quot;Last Updated&quot; date. Your continued use of our Services after such changes constitutes your acceptance of the new Terms.
      </p>
      
      <h2>10. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard 
        to its conflict of law provisions.
      </p>
      
      <h2>11. Contact Information</h2>
      <p>
        If you have any questions about these Terms, please contact us at:
      </p>
      <p>
        Email: terms@yourphotographystudio.com<br />
        Phone: +1 (555) 123-4567<br />
        Address: 123 Photography Lane, City, State, ZIP
      </p>
    </LegalPoliciesLayout>
  );
};

// Cancellation and Refund Policy Component
export const CancellationRefund = () => {
  return (
    <LegalPoliciesLayout title="Cancellation and Refund Policy">
      <h2>1. Booking Deposits</h2>
      <p>
        To secure your booking date, we require a non-refundable deposit of 25% of the total service fee at the time of 
        booking. This deposit serves to reserve our services for your specific date and time.
      </p>
      
      <h2>2. Client Cancellations</h2>
      <p>All cancellations must be submitted in writing to bookings@yourphotographystudio.com.</p>
      
      <h3>Cancellation Timeline and Refunds:</h3>
      <ul>
        <li>
          <strong>More than 30 days before the scheduled date:</strong> The deposit is non-refundable, but any additional 
          payments made will be refunded in full.
        </li>
        <li>
          <strong>15-30 days before the scheduled date:</strong> 50% of the total fee (minus the deposit) will be refunded.
        </li>
        <li>
          <strong>Less than 15 days before the scheduled date:</strong> No refund will be provided, and the full payment 
          is due as per the contract.
        </li>
      </ul>
      
      <h2>3. Rescheduling</h2>
      <p>
        If you need to reschedule your photography session:
      </p>
      <ul>
        <li>
          <strong>More than 14 days&apos; notice:</strong> One-time rescheduling is available at no additional cost, subject to our availability.
        </li>
        <li>
          <strong>7-14 days&apos; notice:</strong> Rescheduling fee of 15% of the total service fee applies.
        </li>
        <li>
          <strong>Less than 7 days&apos; notice:</strong> Rescheduling fee of 30% of the total service fee applies.
        </li>
      </ul>
      <p>
        All rescheduling requests are subject to our availability. If we cannot accommodate your new date, it will be treated 
        as a cancellation according to the above policy.
      </p>
      
      <h2>4. Photographer Cancellation</h2>
      <p>
        In the unlikely event that we need to cancel due to illness, emergency, or other unforeseeable circumstances:
      </p>
      <ul>
        <li>We will make all reasonable efforts to find a suitable replacement photographer of similar style and experience.</li>
        <li>If no replacement can be found, you will receive a full refund including the deposit.</li>
        <li>If the cancellation occurs during an ongoing multi-day event, a pro-rated refund will be provided for the uncovered portion.</li>
      </ul>
      
      <h2>5. Weather Conditions and Force Majeure</h2>
      <p>
        For outdoor photo sessions affected by inclement weather, we offer rescheduling at no additional cost. The decision 
        to reschedule due to weather will be made no more than 24 hours before the scheduled session and will be at the 
        discretion of the photographer.
      </p>
      <p>
        If your event cannot take place due to circumstances beyond reasonable control (natural disasters, governmental actions, 
        etc.), we will offer rescheduling at no additional cost or a full refund at your choice.
      </p>
      
      <h2>6. Refund Processing</h2>
      <p>
        All approved refunds will be processed within 14 business days and will be issued using the original payment method 
        when possible. If the original payment method is unavailable, an alternative method will be arranged.
      </p>
      
      <h2>7. Special Circumstances</h2>
      <p>
        We understand that special circumstances may arise. If you need to cancel for a genuine emergency or extenuating 
        circumstances, please contact us as soon as possible to discuss options. Each situation will be reviewed on a 
        case-by-case basis.
      </p>
      
      <h2>8. Changes to Services</h2>
      <p>
        If you wish to upgrade or modify your package after booking, we will accommodate such requests subject to availability 
        and schedule adjustments. Additional charges may apply for upgrades or added services.
      </p>
      <p>
        Downgrading your package after booking is subject to the same refund terms as cancellations.
      </p>
      
      <h2>9. Contact for Cancellations and Refunds</h2>
      <p>
        For all cancellation, refund, or rescheduling requests, please contact us at:
      </p>
      <p>
        Email: bookings@yourphotographystudio.com<br />
        Phone: +1 (555) 123-4567
      </p>
    </LegalPoliciesLayout>
  );
};

// Shipping and Delivery Policy Component
export const ShippingDelivery = () => {
  return (
    <LegalPoliciesLayout title="Shipping and Delivery Policy">
      <h2>1. Digital Delivery</h2>
      <p>
        For digital photography deliverables (digital image files, online galleries, etc.):
      </p>
      <ul>
        <li>
          <strong>Turnaround Time:</strong> Standard delivery is within 2-4 weeks from the photography session date, depending 
          on the package selected and the season. Rush delivery options are available for an additional fee.
        </li>
        <li>
          <strong>Delivery Method:</strong> Digital files will be delivered via a secure online gallery with download capability. 
          You will receive an email notification when your gallery is ready.
        </li>
        <li>
          <strong>Access Period:</strong> Online galleries remain accessible for 60 days from the delivery date. We recommend 
          downloading and backing up your images promptly. Extended gallery hosting is available for an additional fee.
        </li>
      </ul>
      
      <h2>2. Physical Products</h2>
      <p>
        For physical products (prints, albums, USB drives, etc.):
      </p>
      <ul>
        <li>
          <strong>Production Time:</strong> After final approval of designs or selections:
          <ul>
            <li>Prints: 7-10 business days</li>
            <li>Photo albums: 4-6 weeks</li>
            <li>Custom framed prints: 3-4 weeks</li>
            <li>USB drives and packaging: 2-3 weeks</li>
          </ul>
        </li>
        <li>
          <strong>Shipping Methods and Timeframes:</strong>
          <ul>
            <li>Standard Shipping: 3-5 business days after production (free for orders over $150)</li>
            <li>Expedited Shipping: 2-3 business days after production (additional $25)</li>
            <li>Priority Shipping: 1-2 business days after production (additional $45)</li>
          </ul>
        </li>
      </ul>
      
      <h2>3. Shipping Carriers and Coverage</h2>
      <p>
        We use reputable shipping carriers including FedEx, UPS, and USPS. All physical product shipments include tracking 
        and insurance up to the full value of your order.
      </p>
      
      <h2>4. International Shipping</h2>
      <p>
        We ship internationally to most countries. International shipping costs are calculated at checkout based on destination 
        and package specifications. Please note that:
      </p>
      <ul>
        <li>Delivery times for international shipments typically range from 7-21 business days after production</li>
        <li>The recipient is responsible for any customs duties, taxes, or import fees</li>
        <li>Tracking may be limited once the package leaves the country of origin</li>
      </ul>
      
      <h2>5. Local Pickup</h2>
      <p>
        Local pickup is available at our studio for clients within the [City Name] area. Pickup appointments can be 
        scheduled Monday through Friday between 10:00 AM and 5:00 PM after you receive notification that your order is ready.
      </p>
      
      <h2>6. Shipping Addresses</h2>
      <p>
        It is your responsibility to provide an accurate shipping address. We cannot be responsible for delays or losses 
        resulting from incorrect address information. If a package is returned to us due to an incorrect address or failure 
        to receive the delivery, reshipment will incur additional shipping charges.
      </p>
      
      <h2>7. Delivery Delays</h2>
      <p>
        While we make every effort to deliver products within the stated timeframes, delays may occasionally occur due to:
      </p>
      <ul>
        <li>High volume periods (e.g., wedding season, holidays)</li>
        <li>Custom product manufacturing issues</li>
        <li>Shipping carrier delays</li>
        <li>Customs processing for international shipments</li>
        <li>Weather or natural events</li>
      </ul>
      <p>
        We will communicate any significant delays and provide updated delivery estimates as soon as possible.
      </p>
      
      <h2>8. Damaged or Lost Shipments</h2>
      <p>
        In the event that your shipment arrives damaged or is lost in transit:
      </p>
      <ul>
        <li>Document any visible damage to the packaging before opening</li>
        <li>Take photographs of damaged items as evidence</li>
        <li>Contact us within 3 business days of delivery (for damaged items) or within 10 business days of the expected delivery date (for lost items)</li>
        <li>We will work with the shipping carrier to file a claim and arrange for replacement items to be produced and reshipped at no additional cost</li>
      </ul>
      
      <h2>9. Contact Information for Shipping Inquiries</h2>
      <p>
        For questions about shipping, delivery status, or issues with received products, please contact us at:
      </p>
      <p>
        Email: shipping@yourphotographystudio.com<br />
        Phone: +1 (555) 123-4567
      </p>
    </LegalPoliciesLayout>
  );
};

// Legal Policies Navigator Component
export const LegalPoliciesNavigator = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Legal Policies</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3">Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            Learn how we collect, use, and protect your personal information.
          </p>
          <Link href="/privacy-policy" className="text-primary-600 hover:text-primary-700 font-medium">
            Read Privacy Policy →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3">Terms and Conditions</h2>
          <p className="text-gray-600 mb-4">
            Understand the terms governing the use of our services.
          </p>
          <Link href="/terms-conditions" className="text-primary-600 hover:text-primary-700 font-medium">
            Read Terms and Conditions →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3">Cancellation and Refund</h2>
          <p className="text-gray-600 mb-4">
            Our policies regarding booking cancellations and refunds.
          </p>
          <Link href="/cancellation-refund" className="text-primary-600 hover:text-primary-700 font-medium">
            Read Cancellation Policy →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3">Shipping and Delivery</h2>
          <p className="text-gray-600 mb-4">
            Details about our delivery timeframes and shipping methods.
          </p>
          <Link href="/shipping-delivery" className="text-primary-600 hover:text-primary-700 font-medium">
            Read Shipping Policy →
          </Link>
        </div>
      </div>
    </div>
  );
};

// Create a named variable for the exported object
const LegalPolicies = {
    PrivacyPolicy,
    TermsAndConditions,
    CancellationRefund,
    ShippingDelivery,
    LegalPoliciesNavigator
  };
  
  // Export the variable as the default export
  export default LegalPolicies;