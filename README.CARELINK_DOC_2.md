# CareLink Website - Trainer Path Functional Specification

## Purpose
This document outlines the detailed step-by-step functionality of the Trainer Path on the CareLink website. It is intended for the website and software development team to understand and implement the core features, user experience, and backend processes that will support trainers onboarding and operating through the CareLink platform.

---

## Step 1: Visit CareLink Website
**Functionality:**
- The user lands on the homepage of CareLink.
- Prominent **"Get Started"** button is displayed clearly on the homepage for new users.
- Navigation menu includes options for existing user login, About Us, Services, Contact, and FAQs.

---

## Step 2: Click "Get Started"
**Functionality:**
- Clicking this button launches an onboarding modal or redirects to a new page.
- The page asks the user to select one of two options: **"Client"** or **"Trainer."**

---

## Step 3: Choose "Trainer"
**Functionality:**
- If "Trainer" is selected, the site redirects the user to the Trainer Onboarding form.
- The user is prompted to create an account or sign in with Google or email/password.

---

## Step 4: Trainer Fills Form (Certifications, Availability, Specialisations)
**Functionality:**
Form fields include:
- Full Name  
- Email Address  
- Mobile Number  
- Home Address (optional)  
- Availability (Days of the week & time slots)  
- Areas they can travel to  
- Areas of Specialisation (e.g., Autism, Physical Disabilities, Mental Health, etc.)  

All form data is stored securely in the trainer profile database.

---

## Step 5: Upload Documents (Compulsory & Optional)
**Functionality:**
- Upload section accepts multiple files in JPEG, PNG, and PDF formats.  

**Compulsory uploads:**
- NDIS Worker Screening Check  
- Working With Children Check  
- Driver’s Licence  

**Optional uploads:**
- First Aid Certificate  
- CPR Certificate  
- Disability Qualification  

All documents are securely stored and linked to the trainer's profile.

---

## Step 6: CareLink Training & Assessment Modules
**Functionality:**
- Once documents are submitted, the trainer is granted access to the internal onboarding training.  
- The training is broken into **5 mandatory sections:**
  1. Company Orientation  
  2. Dealing with People with Disabilities  
  3. Our Processes  
  4. Privacy & Confidentiality  
  5. Our Mission & Values  

Each section includes:
- Reading materials and/or video/slideshow  
- A multiple-choice or short-answer quiz  
- All questions must be answered correctly to proceed  
- If incorrect answers are given, the section must be reattempted  
- Trainers can log in and resume from where they left off  

---

## Step 7: Book a Video Interview
**Functionality:**
- Once training is completed successfully, the trainer is prompted to book a **15-minute interview.**  
- A calendar with available interview slots (set by CareLink management) is displayed.  
- Trainer selects a suitable time and books the meeting.  
- Meeting is conducted via **Google Meet.**

---

## Step 8: Interview & Activation
**Functionality:**
- A CareLink manager conducts the interview.  
- Upon successful completion, admin updates trainer profile status to **"Approved."**  
- Trainer receives a confirmation email and their account is activated.  

---

## Step 9: Trainer Accesses Portal (Client Matches, Schedule & Logs)
**Functionality:**
Trainer logs into their CareLink portal where they can:
- View & edit their profile  
- Set and update availability calendar  
- See available client matches  
- View and respond to booking requests  
- View their shift schedule & upcoming appointments  
- Access historical session logs  

---

## Step 10: Session Management (Clock In/Out & Reports)
**Functionality:**
For each shift:
- Trainer clicks into the appointment and selects **“Clock In”** at start of shift.  
- At end of shift, they **“Clock Out.”**  
- Prompted to complete a Shift Report, including:  
  - Description of activities completed  
  - Client progress notes  
  - Incident/Behavioural Notes (if any)  
  - Total kilometres driven during the shift (for mileage tracking)  

Once submitted, the report is stored in the trainer’s profile and linked to the client.  

This enables weekly aggregation (Monday to Sunday) for:
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
- Internal Messaging System (with clients and CareLink admin)  
- Notification Center (approvals, reminders, alerts)  

---

## Security & Compliance
- All personal data complies with Australian privacy laws and NDIS provider requirements.  
- Documents are encrypted and stored securely.  
- Role-based access controls ensure data integrity.  

---

## Future Integration Notes
- Calendar integration (Google Calendar, iCal)  
- Automated session reminders via email/SMS  
- Invoicing and payroll automation  
- Timesheet exports (Xero, MYOB, etc.)  
- Analytics for shift trends, trainer performance  
