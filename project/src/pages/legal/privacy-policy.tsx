import { useSEO } from '@/hooks/use-seo';
import { LegalLayout, LegalList, LegalSubHeading, LEGAL_CONTACT } from '@/components/legal-layout';

export function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy | Jenelle Luxurious',
    description: 'How Jenelle Luxurious collects, uses, stores, protects and discloses personal information in compliance with the Data Protection Act, 2022 of the Kingdom of Eswatini.',
    canonical: 'https://jenelleluxurious.co.sz/legal/privacy-policy',
  });

  const sections = [
    {
      id: 'who-we-are',
      title: '1. Who We Are',
      body: (
        <div className="space-y-2">
          <p><strong className="text-plum">Business:</strong> Jenelle Luxurious</p>
          <p><strong className="text-plum">Address:</strong> Corner Plaza, Tea Road, Ezulwini M200, Eswatini</p>
          <p><strong className="text-plum">Email:</strong> <a href="mailto:hello@jenelleluxurious.com" className="text-primary underline-offset-2 hover:underline">hello@jenelleluxurious.com</a></p>
          <p><strong className="text-plum">Telephone/WhatsApp:</strong> <a href="tel:+26876774779" className="text-primary underline-offset-2 hover:underline">+268 7677 4779</a></p>
          <p>For purposes of applicable data-protection law, Jenelle Luxurious may act as the data controller responsible for personal information collected through this website.</p>
        </div>
      ),
    },
    {
      id: 'information-we-collect',
      title: '2. Information We Collect',
      body: (
        <div className="space-y-3">
          <p>Depending on how you interact with our website, we may collect:</p>
          <LegalSubHeading>Information you provide</LegalSubHeading>
          <LegalList items={[
            'Full name', 'Telephone or mobile number', 'Email address', 'Booking details',
            'Appointment date and time', 'Selected service', 'Product and order information',
            'Delivery information where applicable', 'Billing information',
            'Information provided through contact forms', 'Customer-service communications', 'Marketing preferences',
          ]} />
          <LegalSubHeading>Information collected automatically</LegalSubHeading>
          <p>When you visit our website, certain technical information may be collected automatically, including:</p>
          <LegalList items={[
            'IP address', 'Browser type', 'Device type', 'Operating system',
            'Pages visited', 'Referring website', 'Date and time of visits',
            'Website interaction information', 'Information generated through cookies and similar technologies',
          ]} />
        </div>
      ),
    },
    {
      id: 'how-we-use',
      title: '3. How We Use Personal Information',
      body: (
        <div className="space-y-2">
          <p>We may use personal information to:</p>
          <LegalList items={[
            'Process and manage appointments;', 'Confirm bookings;', 'Send booking reminders and updates;',
            'Provide requested services;', 'Process product orders;', 'Arrange deliveries where applicable;',
            'Process payments through appropriate payment providers;', 'Respond to enquiries;',
            'Provide customer support;', 'Manage cancellations and refunds;', 'Improve our website and services;',
            'Maintain business and transaction records;', 'Detect and prevent fraud, misuse and security incidents;',
            'Communicate important service information;', 'Send promotional communications where permitted by law;',
            'Comply with legal and regulatory obligations.',
          ]} />
          <p>We will not use personal information for purposes incompatible with the purpose for which it was collected unless permitted by applicable law.</p>
        </div>
      ),
    },
    {
      id: 'lawful-processing',
      title: '4. Lawful Processing',
      body: (
        <div className="space-y-2">
          <p>We process personal information on an appropriate lawful basis, which may include:</p>
          <LegalList items={[
            'Your consent;', 'Processing necessary to provide a service you have requested;',
            'Processing necessary to fulfil a booking or transaction;', 'Compliance with a legal obligation;',
            'Protection of legitimate business interests where permitted by law;',
            'Another lawful basis recognised under applicable legislation.',
          ]} />
          <p>Where processing is based on consent, you may withdraw your consent subject to applicable legal limitations.</p>
        </div>
      ),
    },
    {
      id: 'bookings',
      title: '5. Bookings',
      body: (
        <p>When you make a booking, we may collect information necessary to identify you, confirm your appointment and communicate with you about the booking. Booking information may be accessed by authorised Jenelle Luxurious personnel and relevant service providers where necessary to administer the appointment.</p>
      ),
    },
    {
      id: 'online-store',
      title: '6. Online Store',
      body: (
        <div className="space-y-2">
          <p>Jenelle Luxurious may introduce online product sales through the website. When the online store becomes available, we may process information necessary to:</p>
          <LegalList items={[
            'Process orders;', 'Confirm purchases;', 'Process payments;', 'Arrange delivery;',
            'Communicate order status;', 'Handle returns and refunds;', 'Maintain transaction records.',
          ]} />
          <p>Payment-card information may be processed directly by a third-party payment provider rather than being stored by Jenelle Luxurious.</p>
        </div>
      ),
    },
    {
      id: 'payment-providers',
      title: '7. Payment Providers',
      body: (
        <div className="space-y-2">
          <p>Where online payments are offered, payments may be processed by third-party payment providers. These providers may collect and process payment and transaction information according to their own terms and privacy policies.</p>
          <p>Jenelle Luxurious will not intentionally store complete payment-card details unless expressly stated otherwise.</p>
        </div>
      ),
    },
    {
      id: 'sharing',
      title: '8. Sharing Personal Information',
      body: (
        <div className="space-y-2">
          <p>We may share relevant personal information with trusted service providers where reasonably necessary to operate our business, including:</p>
          <LegalList items={[
            'Website and hosting providers;', 'Payment processors;', 'Booking and scheduling providers;',
            'Email and communication providers;', 'Delivery providers;', 'Analytics providers;',
            'Technology providers;', 'Professional advisers;',
            'Government or regulatory authorities where legally required.',
          ]} />
          <p>We do not sell customers' personal information.</p>
        </div>
      ),
    },
    {
      id: 'international-processing',
      title: '9. International Processing',
      body: (
        <p>Some technology and service providers used by Jenelle Luxurious may process information outside Eswatini. Where personal information is transferred or processed outside Eswatini, we will take reasonable steps to ensure that the processing is handled in accordance with applicable data-protection requirements.</p>
      ),
    },
    {
      id: 'data-security',
      title: '10. Data Security',
      body: (
        <div className="space-y-2">
          <p>We take reasonable technical and organisational measures to protect personal information against unauthorised access, loss, misuse, alteration, disclosure or destruction. These measures may include access controls, authentication, secure hosting, restricted administrative access and appropriate security practices.</p>
          <p>No online system can guarantee absolute security.</p>
        </div>
      ),
    },
    {
      id: 'data-retention',
      title: '11. Data Retention',
      body: (
        <div className="space-y-2">
          <p>We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, including to:</p>
          <LegalList items={[
            'Provide services;', 'Complete transactions;', 'Maintain appropriate business records;',
            'Resolve disputes;', 'Enforce agreements;', 'Comply with legal obligations.',
          ]} />
          <p>Retention periods may vary depending on the nature of the information.</p>
        </div>
      ),
    },
    {
      id: 'your-rights',
      title: '12. Your Rights',
      body: (
        <div className="space-y-2">
          <p>Subject to applicable law, you may have rights relating to your personal information, including rights to:</p>
          <LegalList items={[
            'Be informed about how your information is processed;', 'Request access to personal information held about you;',
            'Request correction of inaccurate information;', 'Request deletion where legally applicable;',
            'Object to certain processing;', 'Withdraw consent where applicable;',
            'Exercise other rights provided by applicable data-protection law.',
          ]} />
          <p>Requests may be submitted to <a href="mailto:hello@jenelleluxurious.com" className="text-primary underline-offset-2 hover:underline">hello@jenelleluxurious.com</a>. We may need to verify your identity before processing certain requests.</p>
        </div>
      ),
    },
    {
      id: 'direct-marketing',
      title: '13. Direct Marketing',
      body: (
        <div className="space-y-2">
          <p>Where permitted by law, Jenelle Luxurious may send information about products, services, promotions and events. You may opt out of promotional communications at any time using the unsubscribe mechanism provided or by contacting us.</p>
          <p>Essential transactional communications, such as booking confirmations, appointment changes and order notifications, may still be sent where necessary.</p>
        </div>
      ),
    },
    {
      id: 'childrens-information',
      title: "14. Children's Information",
      body: (
        <p>The website is not intentionally designed to collect personal information from children in circumstances where such collection would be unlawful. If you believe that personal information has been submitted inappropriately, please contact us.</p>
      ),
    },
    {
      id: 'third-party-websites',
      title: '15. Third-Party Websites',
      body: (
        <div className="space-y-2">
          <p>Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of third-party websites.</p>
          <p>Users should review the privacy policies of external services before providing personal information.</p>
        </div>
      ),
    },
    {
      id: 'changes',
      title: '16. Changes to This Privacy Policy',
      body: (
        <p>We may update this Privacy Policy when our services, technology, business practices or legal obligations change. The updated version will be published on this page with a revised "Last Updated" date.</p>
      ),
    },
    {
      id: 'contact',
      title: '17. Contact',
      body: <div className="space-y-2"><p>For privacy enquiries or requests:</p>{LEGAL_CONTACT}</div>,
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      effectiveDate="15 September 2026"
      lastUpdated="15 September 2026"
      description="This Privacy Policy explains how Jenelle Luxurious collects, uses, stores, protects and discloses personal information when you visit jenelleluxurious.com, make a booking, contact us, purchase products, subscribe to communications or otherwise interact with our services. This Privacy Policy is intended to comply with the applicable laws of the Kingdom of Eswatini, including the Data Protection Act, 2022 (Act No. 5 of 2022)."
      canonical="https://jenelleluxurious.co.sz/legal/privacy-policy"
      sections={sections}
    />
  );
}
