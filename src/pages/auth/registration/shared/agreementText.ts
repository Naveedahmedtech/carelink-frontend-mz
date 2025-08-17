// shared/agreementText.ts

export type AgreementSection = {
  title: string;
  body: string;     // plain text with \n\n paragraphs and - bullet points
  hints?: string[]; // short “Key points” helpers shown above the body
};

export type AgreementMeta = {
  version: string;          // e.g. "1.0"
  effectiveDate: string;    // ISO date "YYYY-MM-DD"
  jurisdiction: string;     // e.g. "Australia"
  governingLaw?: string;    // e.g. "New South Wales, Australia"
  companyName: string;      // used by email/PDF titles
  contactEmail: string;
  contactPhone?: string;
};

export const AGREEMENT_META: AgreementMeta = {
  version: '1.0',
  effectiveDate: '2025-08-17',
  jurisdiction: 'Australia',
  governingLaw: 'New South Wales, Australia',
  companyName: 'CareLink',
  contactEmail: 'support@carelink.example',
  contactPhone: '+61 4XX XXX XXX',
};

/**
 * NOTE:
 * - Replace bracketed tokens like {{participantName}} at render time if you want dynamic text.
 * - Keep wording generic; your welcome email can link to canonical /legal pages.
 */
// shared/agreementText.ts
// (Assumes type AgreementSection is already declared above)

export const AGREEMENT_SECTIONS: AgreementSection[] = [
  {
    title: 'Terms of Service (Acknowledgement)',
    body: `This section summarises the conditions under which services are provided by {{providerName}} to the Participant ({{participantName}}). By acknowledging and signing, you agree to these terms.

What services include
- Supports listed and booked through the CareLink portal or confirmed in writing.
- Delivery by personnel who hold required checks/clearances and complete induction/training.
- Reasonable adjustments to support your goals, safety and preferences.

Your responsibilities
- Provide accurate and up-to-date information (health, risks, contacts, funding).
- Be available for booked sessions or cancel within the required notice period.
- Treat staff with dignity and respect, and maintain a safe environment for service delivery.
- Tell us when contact details, funding arrangement, or support needs change.

Our responsibilities
- Deliver services with due care, skill and diligence, aligned to NDIS Practice Standards.
- Communicate changes, incidents and progress as appropriate.
- Keep records, schedules and invoices accurate, and be transparent about fees and any changes permitted by the NDIS rules.

Fees & payment
- Fees follow the current NDIS Pricing Arrangements and Price Limits (where applicable) or a separately agreed rate in writing.
- If plan-managed: invoices are sent to your Plan Manager. If self-managed: invoices are sent to you. If NDIA-managed: claims are lodged via the NDIS portal.
- Travel, report-writing and non–face-to-face time may be billed where the NDIS allows and where disclosed to you.

Cancellations & no-shows
- Please cancel as early as possible. Short-notice cancellations may be billed in line with the NDIS Pricing Arrangements.
- Repeated no-shows may trigger a service review.

Scheduling & communication
- We may contact you via phone, SMS or email about bookings, changes and updates.
- Important notices are sent to the email on file—keep it current.

Complaints & feedback
- If you have concerns, contact {{providerName}} at {{contactEmail}}{{contactPhone ? ' or ' + contactPhone : ''}}.
- If unresolved, you may contact the NDIS Quality and Safeguards Commission.

Changes and ending
- We may update these terms to reflect law/NDIS changes; we will advise of material changes and seek consent where required.
- Either party may end services with reasonable written notice (e.g., 14 days), unless a shorter period applies due to serious risk or breach.

Governing law
- This agreement is governed by the laws of {{governingLaw}}.`,

    hints: [
      'Scope of supports and how they’re delivered',
      'Your responsibilities vs. our responsibilities',
      'Fees follow NDIS rules; cancellations may be billed',
      'How to complain and how to end services',
    ],
  },

  {
    title: 'Privacy & Data Use (Acknowledgement)',
    body: `This section explains how {{providerName}} handles your personal information in line with Australian privacy law.

What we collect
- Identity/contact details, emergency contacts, relevant health and support information.
- Service history (bookings, notes, incident/feedback records), funding details needed for invoicing/claims.
- Device and usage metadata from our portal for security, fraud prevention and service quality.

Why we collect it
- To deliver and coordinate supports, meet legal/clinical/NDIS compliance obligations, and improve safety and quality.
- To verify identity and manage bookings, invoices and communications you request.

How we protect it
- Access is role-based and logged; data is encrypted in transit and stored securely.
- We retain records only as long as required by law and policy, then securely destroy or de-identify them.

Your rights
- You can request access to your information and ask us to correct it if inaccurate.
- You can make a privacy complaint to us at {{contactEmail}}; if unresolved, you may contact the Office of the Australian Information Commissioner (OAIC).

Third parties
- We may share information with service providers who help us operate our systems (e.g., secure hosting, email), under confidentiality and privacy obligations.
- We do not sell your personal information.
- Any overseas disclosures (if applicable) will be limited and protected by appropriate safeguards.

Policies & contact
- Our full Privacy Policy explains these points in detail. You can request a copy or view it online.
- Privacy questions or complaints: {{contactEmail}}{{contactPhone ? ' / ' + contactPhone : ''}}.`,

    hints: [
      'Complies with Australian privacy law (APPs)',
      'Collected only for service delivery, safety and compliance',
      'Role-based access, encryption and limited retention',
      'You can access/correct your data and make complaints',
    ],
  },

  {
    title: 'Consent to Share Information (Acknowledgement)',
    body: `By acknowledging and signing, you give {{providerName}} permission to share relevant information to deliver safe, coordinated services.

Who we may share with
- Your authorised representative/guardian and nominated emergency contacts.
- Other health/support providers involved in your care to coordinate services.
- Funding bodies (including NDIS/Plan Manager) for claims, audits and compliance.

How sharing works
- We share only the minimum necessary information for the stated purpose.
- We keep records of disclosures where required by law/NDIS rules.
- In an emergency or to prevent serious risk, we may share information with emergency services.

Your choices
- You can limit or withdraw consent at any time; we will explain any impact on coordination or availability of certain services.
- You can request a summary of who we share with and why.

Marketing & research
- We will not use your information for marketing without your separate opt-in.
- Any research use would be de-identified or require additional explicit consent.

How to change your consent
- Update consent preferences via the portal or by contacting us at {{contactEmail}}{{contactPhone ? ' / ' + contactPhone : ''}}.
- We will confirm changes in writing and update our records promptly.`,

    hints: [
      'Sharing is limited to what’s necessary for care and compliance',
      'Includes reps/guardians, providers, and funding bodies',
      'You can change or withdraw consent anytime',
      'Emergencies may require disclosure to reduce serious risk',
    ],
  },
];
