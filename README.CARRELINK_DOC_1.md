# CareLink Website - Participant & Admin Portal Functional Specification (Detailed Version)

## Purpose
This document provides an in-depth functional breakdown of the participant-facing features and back-end admin/trainer portal for the CareLink website and platform. It outlines the end-to-end user experience, key data collection requirements, security protocols, and integration points necessary for a fully operational and NDIS-compliant platform. This will serve as a reference for the development team to ensure a seamless user journey and system efficiency.

---

## Step 1: Visit CareLink Website
- Participant lands on the homepage (desktop and mobile responsive design).
- Main CTA button **'Get Started'** should be clearly visible and strategically placed above the fold.
- Top navigation bar includes links to: Home, About Us, Services, Contact, FAQ, and Login.
- Optional: Include animated hero banner or carousel with brief feature highlights for participants.

---

## Step 2: Click 'Get Started'
- System redirects to onboarding selection page with two prominent options: **'Sign Up as Participant'** or **'Trainer'**.
- Each option is clickable with icons for visual distinction (e.g., wheelchair icon for participant, clipboard for trainer).

---

## Step 3: Participant Registration Form
- Form displayed in multi-step format with field validation at each step.  
- **Fields to capture:**
  - Full Name  
  - NDIS Number  
  - Date of Birth (with calendar selector)  
  - Residential Address (auto-complete via Google API)  

**Contact Info:**  
- Email (with format validation)  
- Mobile Number (with Australian number format check)  

**Guardian/Carer Details:**  
- Optional Full Name, Phone, Email (appears if 'Under 18' or ticked).  

**Interests:**  
- Checkboxes – Boxing, Fitness, Outdoors, Cooking, Community Participation, Arts & Crafts, etc.  

**Preferred Days/Times:**  
- Custom availability grid or dropdowns for days + time ranges (e.g., Mon: 9am–12pm).  

**Funding Type:**  
- Dropdown with Plan Managed, Self-Managed, NDIA Managed.  
- If Plan Managed or Self-Managed: additional fields appear for Plan Manager Name & Invoice Email.  

---

## Step 4: Service Agreement Page
- Page contains scrollable agreement text covering: Terms of Service, Privacy Policy, Consent to Share Info.  
- Embedded PDF viewer or long-form text with clear section headings for easier reading.  
- User must tick checkboxes acknowledging understanding and agreement before proceeding.  
- Signature field: digital signature capture (typed or drawn) + date picker.  
- Upon signing, a signed PDF is generated and automatically emailed to the participant.  
- Welcome email includes: signed PDF, Google Drive link to Participant Handbook, and login credentials setup link.  

---

## Step 5: Create Participant Login
- Redirects to secure page to create Username and Password (rules: min 8 characters, at least 1 number/special character).  
- Participant account is created and saved with an assigned participant ID.  
- System redirects user to participant dashboard upon completion.  

---

## Step 6: Participant Portal Dashboard
- Dashboard UI is clean, accessible, and responsive.  
- Top banner: Welcome message with participant's first name and profile picture (optional).  
- **Main Buttons:**  
  - View Upcoming Shifts  
  - Request a Shift  
  - My Previous Shifts  
  - Support Notes  

**Request a Shift Functionality:**  
- Date picker, time slot, duration, and dropdown for preferred support type.  
- All shift requests logged in backend as **Pending** until approved by admin.  
- Participants can cancel future shifts (reason required) or request changes (admin notified).  

**Shift History:**  
- Previous shifts listed chronologically with date, time, and worker notes (read-only).  

**Security:**  
- Password reset and basic contact info updates only.  

---

## Step 7: Admin/Trainer Back-End Portal

### Trainer Dashboard
- Weekly calendar view (Mon–Sun).  
- Clickable shifts to view client details (name, DOB, address, notes, NDIS ID).  
- **Clock In** button activates at shift start time.  
- **Clock Out** button prompts shift report form: Activities Completed, Client Progress, Incidents, Kilometres Driven.  
- All shift notes stored in both trainer and participant profiles.  
- **Availability Tab:** recurring or one-off availability.  
- **News & Updates Tab:** admin announcements.  
- **Timesheet Auto-Generator:** compiles weekly invoice summary with trainer name, clients, hours, mileage.  

### Admin Features
- Full calendar view with trainer-client shift assignments.  
- Access to all participant and trainer profiles, documents, agreements, notes.  
- Approve, edit, or cancel shift requests.  
- Exportable shift logs & timesheets (PDF, CSV) for payroll/NDIS auditing.  
- Messaging system (email + internal notifications).  

### Security
- Role-based access control (admin, trainer, participant).  
- Data encrypted at rest and in transit.  
- Auto-logouts, audit logs, GDPR/NDIS-compliant retention.  

---

# CareLink Website - Trainer Path Functional Specification

## Purpose
This document outlines the detailed step-by-step functionality of the Trainer Path on the CareLink website. It is intended for the website and software development team to understand and implement the core features, user experience, and backend processes that will support trainers onboarding and operating through the CareLink platform.

---

## Step 1: Visit CareLink Website
**Functionality:**
- User lands on homepage.  
- Prominent **"Get Started"** button displayed clearly.  
- Navigation menu includes login, About Us, Services, Contact, FAQs.  

---

## Step 2: Click "Get Started"
**Functionality:**
- Launches onboarding modal or redirects to page.  
- Asks user to select **"Client"** or **"Trainer."**  

---

## Step 3: Choose "Trainer"
**Functionality:**
- Redirects to Trainer Onboarding form.  
- User creates account or signs in with Google or email/password.  

---

## Step 4: Trainer Fills Form
**Functionality:**
- **Fields:** Full Name, Email, Mobile, Home Address (optional), Availability, Travel Areas, Specialisations (e.g., Autism, Disabilities, Mental Health).  
- Data stored securely in trainer database.  

---

## Step 5: Upload Documents
**Functionality:**
- Accepts JPEG, PNG, PDF.  

**Compulsory:**  
- NDIS Worker Screening Check  
- Working With Children Check  
- Driver’s Licence  

**Optional:**  
- First Aid Certificate  
- CPR Certificate  
- Disability Qualification  

---

## Step 6: CareLink Training & Assessment Modules
**Functionality:**
- Access to onboarding training after documents submitted.  
- **5 Sections:**  
  1. Company Orientation  
  2. Dealing with People with Disabilities  
  3. Our Processes  
  4. Privacy & Confidentiality  
  5. Our Mission & Values  

Each section includes:  
- Reading/video content  
- Quiz (must answer all correctly)  
- Reattempt required for wrong answers  
- Resume progress option  

---

## Step 7: Book a Video Interview
**Functionality:**
- Prompted after training completion.  
- Displays available interview slots.  
- Booking integrated with Google Meet.  

---

## Step 8: Interview & Activation
**Functionality:**
- CareLink manager conducts interview.  
- Admin updates status to **Approved** if successful.  
- Confirmation email sent; account activated.  

---

## Step 9: Trainer Portal Access
**Functionality:**
Trainer can:  
- Edit profile  
- Update availability  
- See client matches  
- Respond to booking requests  
- View schedule & appointments  
- Access historical logs  

---

## Step 10: Session Management
**Functionality:**
For each shift:  
- **Clock In** at start.  
- **Clock Out** at end.  
- Complete Shift Report: Activities, Client Progress, Incidents, Kilometres Driven.  

Stored in trainer profile & linked to client.  

Enables:  
- Timesheet reporting  
- Payroll calculation  
- Performance tracking  

---

## Trainer Dashboard Summary
- Editable Profile  
- Document Uploads & Expiry Reminders  
- Availability Calendar  
- Booking Overview  
- Shift Reports & History  
- Client Notes  
- Internal Messaging System (with clients & admin)  
- Notification Center  

---

## Security & Compliance
- Complies with Australian privacy laws & NDIS requirements.  
- Documents encrypted & securely stored.  
- Role-based access controls.  

---

## Future Integration Notes
- Google/iCal calendar integration  
- Automated email/SMS reminders  
- Invoicing & payroll automation  
- Timesheet exports (Xero, MYOB, etc.)  
- Analytics for trends & performance  
