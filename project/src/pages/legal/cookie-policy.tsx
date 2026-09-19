import { useSEO } from '@/hooks/use-seo';
import { LegalLayout, LegalList, LegalSubHeading, LEGAL_CONTACT } from '@/components/legal-layout';

export function CookiePolicyPage() {
  useSEO({
    title: 'Cookie Policy | Jenelle Luxurious',
    description: 'How Jenelle Luxurious uses cookies and similar technologies on jenelleluxurious.com.',
    canonical: 'https://jenelleluxurious.co.sz/legal/cookie-policy',
  });

  const sections = [
    {
      id: 'what-are-cookies',
      title: '1. What Are Cookies?',
      body: (
        <div className="space-y-2">
          <p>Cookies are small files stored on your device when you visit a website. They help websites remember information, operate correctly and understand how visitors interact with them.</p>
        </div>
      ),
    },
    {
      id: 'how-we-use-cookies',
      title: '2. How Jenelle Luxurious Uses Cookies',
      body: (
        <div className="space-y-2">
          <p>We may use cookies and similar technologies to:</p>
          <LegalList items={[
            'Keep the website functioning;', 'Maintain booking functionality;', 'Remember preferences;',
            'Support online-store functionality;', 'Improve website performance;', 'Understand website usage;',
            'Measure marketing performance;', 'Improve the customer experience.',
          ]} />
        </div>
      ),
    },
    {
      id: 'types-of-cookies',
      title: '3. Types of Cookies',
      body: (
        <div className="space-y-3">
          <LegalSubHeading>Essential Cookies</LegalSubHeading>
          <p>These cookies are necessary for core website functionality, including security, bookings and shopping functionality.</p>
          <LegalSubHeading>Functional Cookies</LegalSubHeading>
          <p>These may remember preferences and improve the website experience.</p>
          <LegalSubHeading>Analytics Cookies</LegalSubHeading>
          <p>Where enabled, analytics technologies may help us understand visitor numbers, traffic sources and how visitors interact with the website.</p>
          <LegalSubHeading>Marketing Cookies</LegalSubHeading>
          <p>Where applicable, marketing technologies may be used to measure advertising campaigns or support relevant marketing.</p>
        </div>
      ),
    },
    {
      id: 'third-party-technologies',
      title: '4. Third-Party Technologies',
      body: (
        <div className="space-y-2">
          <p>Certain third-party services integrated into the website may use cookies or similar technologies. These may include:</p>
          <LegalList items={[
            'Analytics services;', 'Payment providers;', 'Booking providers;', 'Social-media services;',
            'Advertising services;', 'Other website technology providers.',
          ]} />
          <p>Third parties may process information according to their own privacy policies.</p>
        </div>
      ),
    },
    {
      id: 'managing-cookies',
      title: '5. Managing Cookies',
      body: (
        <div className="space-y-2">
          <p>Most web browsers allow users to control cookies through browser settings. Disabling certain cookies may affect the functionality of the website, particularly booking, account or shopping functionality.</p>
          <p>Where required, Jenelle Luxurious may provide additional cookie-consent controls for non-essential technologies.</p>
        </div>
      ),
    },
    {
      id: 'changes-to-policy',
      title: '6. Changes to This Policy',
      body: (
        <p>We may update this Cookie Policy when our website, technology or third-party services change. The latest version will be published on this page.</p>
      ),
    },
    {
      id: 'contact',
      title: '7. Contact',
      body: (
        <div className="space-y-2">
          <p>For questions regarding cookies:</p>
          {LEGAL_CONTACT}
        </div>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Cookie Policy"
      effectiveDate="15 September 2026"
      lastUpdated="15 September 2026"
      description="This Cookie Policy explains how Jenelle Luxurious uses cookies and similar technologies on jenelleluxurious.com."
      canonical="https://jenelleluxurious.co.sz/legal/cookie-policy"
      sections={sections}
    />
  );
}
