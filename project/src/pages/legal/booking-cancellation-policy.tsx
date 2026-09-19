import { useSEO } from '@/hooks/use-seo';
import { LegalLayout, LegalList, LEGAL_CONTACT } from '@/components/legal-layout';

export function BookingCancellationPolicyPage() {
  useSEO({
    title: 'Booking & Cancellation Policy | Jenelle Luxurious',
    description: 'How bookings, cancellations, rescheduling and late arrivals are handled at Jenelle Luxurious.',
    canonical: 'https://jenelleluxurious.co.sz/legal/booking-cancellation-policy',
  });

  const sections = [
    {
      id: 'making-a-booking',
      title: '1. Making a Booking',
      body: (
        <div className="space-y-2">
          <p>Customers may book available services through the Jenelle Luxurious website or other official booking channels.</p>
          <p>Customers must provide accurate information, including their name and contact details.</p>
        </div>
      ),
    },
    {
      id: 'booking-confirmation',
      title: '2. Booking Confirmation',
      body: (
        <div className="space-y-2">
          <p>A booking is confirmed when the customer receives a booking confirmation from Jenelle Luxurious or through the website's booking system.</p>
          <p>Customers should retain their confirmation for their records.</p>
        </div>
      ),
    },
    {
      id: 'cancellation-requirement',
      title: '3. Cancellation Requirement',
      body: (
        <div className="space-y-2">
          <p><strong className="text-plum">All cancellations must be made at least 4 hours before the scheduled booking time.</strong></p>
          <p>For example, if an appointment is scheduled for 14:00, the customer should cancel no later than 10:00 on the same day.</p>
        </div>
      ),
    },
    {
      id: 'cancellations-4-plus-hours',
      title: '4. Cancellations Made 4+ Hours Before the Appointment',
      body: (
        <div className="space-y-2">
          <p>Where a customer cancels at least 4 hours before the scheduled appointment:</p>
          <LegalList items={[
            'The cancellation will generally be accepted without a cancellation charge; and',
            'The customer may request to reschedule, subject to availability.',
          ]} />
          <p>Where a deposit has been paid, its treatment will depend on the applicable booking terms communicated at the time of booking.</p>
        </div>
      ),
    },
    {
      id: 'cancellations-less-than-4-hours',
      title: '5. Cancellations Made Less Than 4 Hours Before the Appointment',
      body: (
        <p>Where a customer cancels less than 4 hours before the scheduled appointment, Jenelle Luxurious may apply a cancellation charge or retain an applicable deposit where this was communicated to the customer before or during booking. Any applicable charge will be reasonable and subject to applicable law.</p>
      ),
    },
    {
      id: 'no-shows',
      title: '6. No-Shows',
      body: (
        <div className="space-y-2">
          <p>A no-show occurs when a customer does not attend a confirmed appointment and does not provide the required cancellation notice. A reasonable no-show charge may apply where applicable.</p>
          <p>Repeated no-shows may result in future bookings requiring an advance deposit.</p>
        </div>
      ),
    },
    {
      id: 'rescheduling',
      title: '7. Rescheduling',
      body: (
        <div className="space-y-2">
          <p>Customers wishing to reschedule should contact Jenelle Luxurious as early as possible. Rescheduling is subject to availability.</p>
          <p>Where a rescheduling request is made less than 4 hours before the appointment, it may be treated in the same manner as a late cancellation.</p>
        </div>
      ),
    },
    {
      id: 'late-arrival',
      title: '8. Late Arrival',
      body: (
        <div className="space-y-2">
          <p>Customers are expected to arrive at their scheduled appointment time. If a customer arrives late, the service may need to be shortened to avoid affecting other customers.</p>
          <p>Where the delay is substantial, Jenelle Luxurious may treat the booking as a no-show or cancellation.</p>
        </div>
      ),
    },
    {
      id: 'cancellation-by-jenelle',
      title: '9. Cancellation by Jenelle Luxurious',
      body: (
        <div className="space-y-2">
          <p>Jenelle Luxurious may occasionally need to cancel or reschedule an appointment due to circumstances such as:</p>
          <LegalList items={[
            'Staff availability;', 'Operational issues;', 'Emergencies;', 'Safety concerns;',
            'Technical problems;', 'Circumstances outside our reasonable control.',
          ]} />
          <p>Where Jenelle Luxurious cancels an appointment, reasonable efforts will be made to offer an alternative appointment. Where a refund is due, it will be processed using the applicable payment method.</p>
        </div>
      ),
    },
    {
      id: 'service-concerns',
      title: '10. Service Concerns',
      body: (
        <p>Customers who have concerns about a service should contact Jenelle Luxurious as soon as reasonably possible. We will review the concern and determine an appropriate response based on the circumstances and applicable law.</p>
      ),
    },
    {
      id: 'policy-changes',
      title: '11. Policy Changes',
      body: (
        <p>Jenelle Luxurious may update this policy when its booking procedures, services or legal requirements change. The latest version will always be published on the website.</p>
      ),
    },
    {
      id: 'contact',
      title: '12. Contact',
      body: <div className="space-y-2"><p>For any questions regarding this policy:</p>{LEGAL_CONTACT}</div>,
    },
  ];

  return (
    <LegalLayout
      title="Booking & Cancellation Policy"
      effectiveDate="15 September 2026"
      lastUpdated="15 September 2026"
      description="This policy explains how bookings, cancellations and appointment changes are handled by Jenelle Luxurious."
      canonical="https://jenelleluxurious.co.sz/legal/booking-cancellation-policy"
      sections={sections}
    />
  );
}
