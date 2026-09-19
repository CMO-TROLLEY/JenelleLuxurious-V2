import { useSEO } from '@/hooks/use-seo';
import { LegalLayout, LegalList, LEGAL_CONTACT } from '@/components/legal-layout';

export function TermsConditionsPage() {
  useSEO({
    title: 'Terms & Conditions | Jenelle Luxurious',
    description: 'Terms and conditions governing your use of jenelleluxurious.com, bookings with Jenelle Luxurious, and purchases through the online store.',
    canonical: 'https://jenelleluxurious.co.sz/legal/terms-conditions',
  });

  const sections = [
    {
      id: 'business-information',
      title: '1. Business Information',
      body: (
        <div className="space-y-2">
          <p><strong className="text-plum">Business:</strong> Jenelle Luxurious</p>
          <p><strong className="text-plum">Address:</strong> Corner Plaza, Tea Road, Ezulwini M200, Eswatini</p>
          <p><strong className="text-plum">Email:</strong> <a href="mailto:hello@jenelleluxurious.com" className="text-primary underline-offset-2 hover:underline">hello@jenelleluxurious.com</a></p>
          <p><strong className="text-plum">Telephone/WhatsApp:</strong> <a href="tel:+26876774779" className="text-primary underline-offset-2 hover:underline">+268 7677 4779</a></p>
        </div>
      ),
    },
    {
      id: 'website-use',
      title: '2. Website Use',
      body: (
        <div className="space-y-2">
          <p>You agree to use the website lawfully and responsibly. You must not:</p>
          <LegalList items={[
            'Attempt to gain unauthorised access to the website;', 'Interfere with website security;',
            'Submit false or fraudulent information;', 'Abuse booking or ordering functionality;',
            'Attempt to disrupt website operation;', 'Use the website for unlawful purposes.',
          ]} />
        </div>
      ),
    },
    {
      id: 'services',
      title: '3. Services',
      body: (
        <div className="space-y-2">
          <p>Services, descriptions, prices and availability displayed on the website may change from time to time. We will make reasonable efforts to ensure that information displayed on the website is accurate.</p>
          <p>A service booking becomes confirmed only when confirmation has been issued through the booking system or by Jenelle Luxurious.</p>
        </div>
      ),
    },
    {
      id: 'prices',
      title: '4. Prices',
      body: (
        <div className="space-y-2">
          <p>Prices displayed on the website will be stated in the applicable currency. Jenelle Luxurious reserves the right to change prices before a transaction is completed.</p>
          <p>The price applicable to a confirmed booking or order will be the price displayed or communicated at the time of confirmation, subject to genuine errors and applicable law.</p>
        </div>
      ),
    },
    {
      id: 'bookings',
      title: '5. Bookings',
      body: (
        <div className="space-y-2">
          <p>Customers are responsible for providing accurate booking information. A booking request does not necessarily constitute a confirmed appointment.</p>
          <p>Customers should retain their booking confirmation.</p>
        </div>
      ),
    },
    {
      id: 'cancellation',
      title: '6. Cancellation',
      body: (
        <div className="space-y-2">
          <p>Customers must cancel or request to reschedule a booking <strong className="text-plum">at least 4 hours before the scheduled appointment time</strong>.</p>
          <p>Cancellations made with at least 4 hours' notice will generally not incur a cancellation charge. Where a customer cancels less than 4 hours before the appointment or fails to attend, Jenelle Luxurious may apply the applicable cancellation or no-show charge communicated to the customer at the time of booking.</p>
          <p>Any charge will be applied reasonably and subject to applicable law.</p>
        </div>
      ),
    },
    {
      id: 'late-arrival',
      title: '7. Late Arrival',
      body: (
        <div className="space-y-2">
          <p>Customers are expected to arrive on time. Late arrival may reduce the amount of time available for the booked service where the appointment schedule does not allow the appointment to be extended.</p>
          <p>Where a customer is significantly late, Jenelle Luxurious may treat the appointment as cancelled.</p>
        </div>
      ),
    },
    {
      id: 'rescheduling',
      title: '8. Rescheduling',
      body: (
        <div className="space-y-2">
          <p>Requests to reschedule should be made as early as possible. Rescheduling is subject to availability.</p>
          <p>The 4-hour cancellation requirement applies to changes made close to the scheduled appointment time.</p>
        </div>
      ),
    },
    {
      id: 'online-store',
      title: '9. Online Store',
      body: (
        <div className="space-y-2">
          <p>Jenelle Luxurious may offer products for sale through the website. Product information, prices and availability will be displayed at the time of purchase.</p>
          <p>An order is subject to confirmation and successful payment where applicable. Jenelle Luxurious may correct genuine pricing or product-information errors and will communicate with customers where this materially affects an order.</p>
        </div>
      ),
    },
    {
      id: 'payment',
      title: '10. Payment',
      body: (
        <div className="space-y-2">
          <p>Payments may be processed using third-party payment providers. Customers must provide accurate payment information. Payment providers may apply their own terms and conditions.</p>
        </div>
      ),
    },
    {
      id: 'delivery',
      title: '11. Delivery',
      body: (
        <p>Where products are delivered, available delivery areas, delivery charges and estimated delivery times will be communicated during the ordering process. Delivery times may vary due to circumstances outside Jenelle Luxurious' reasonable control.</p>
      ),
    },
    {
      id: 'returns-refunds',
      title: '12. Returns and Refunds',
      body: (
        <p>Product returns and refunds will be handled according to the applicable return/refund policy displayed on the website and applicable law. Nothing in these Terms is intended to remove rights that cannot lawfully be excluded.</p>
      ),
    },
    {
      id: 'customer-conduct',
      title: '13. Customer Conduct',
      body: (
        <div className="space-y-2">
          <p>Customers are expected to treat Jenelle Luxurious employees, contractors and other customers respectfully.</p>
          <p>Jenelle Luxurious reserves the right to refuse or restrict service where reasonably necessary because of abusive, threatening, fraudulent or unlawful conduct.</p>
        </div>
      ),
    },
    {
      id: 'intellectual-property',
      title: '14. Intellectual Property',
      body: (
        <div className="space-y-2">
          <p>Unless otherwise stated, content appearing on the website, including branding, logos, photography, graphics, text, videos and designs, belongs to or is licensed to Jenelle Luxurious.</p>
          <p>Website content may not be reproduced, modified, distributed or commercially exploited without permission.</p>
        </div>
      ),
    },
    {
      id: 'website-availability',
      title: '15. Website Availability',
      body: (
        <p>We aim to maintain reliable website availability but cannot guarantee uninterrupted access. The website may occasionally be unavailable because of maintenance, technical failures, updates, security incidents or circumstances outside our reasonable control.</p>
      ),
    },
    {
      id: 'privacy',
      title: '16. Privacy',
      body: (
        <p>Personal information collected through the website is processed in accordance with the Jenelle Luxurious Privacy Policy.</p>
      ),
    },
    {
      id: 'limitation-of-liability',
      title: '17. Limitation of Liability',
      body: (
        <p>To the extent permitted by applicable law, Jenelle Luxurious will not be responsible for losses arising from circumstances outside its reasonable control. Nothing in these Terms excludes liability or consumer rights that cannot lawfully be excluded.</p>
      ),
    },
    {
      id: 'changes-to-terms',
      title: '18. Changes to These Terms',
      body: (
        <p>We may update these Terms from time to time. The current version will be published on the website.</p>
      ),
    },
    {
      id: 'governing-law',
      title: '19. Governing Law',
      body: (
        <p>These Terms are governed by the laws of the <strong className="text-plum">Kingdom of Eswatini</strong>. Any dispute will be dealt with in accordance with applicable Eswatini law and the jurisdiction of the appropriate courts or dispute-resolution mechanisms.</p>
      ),
    },
    {
      id: 'contact',
      title: '20. Contact',
      body: <div className="space-y-2"><p>For any questions regarding these Terms:</p>{LEGAL_CONTACT}</div>,
    },
  ];

  return (
    <LegalLayout
      title="Terms & Conditions"
      effectiveDate="15 September 2026"
      lastUpdated="15 September 2026"
      description="These Terms & Conditions govern your use of jenelleluxurious.com, your bookings with Jenelle Luxurious and, when available, your purchase of products through our online store. By using the website, submitting a booking or placing an order, you agree to these Terms & Conditions."
      canonical="https://jenelleluxurious.co.sz/legal/terms-conditions"
      sections={sections}
    />
  );
}
