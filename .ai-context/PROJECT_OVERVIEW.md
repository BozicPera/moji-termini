# Project Overview: Moji Termini

## Vision

Create a simple, reliable appointment scheduling system tailored for small clinics in Serbia, eliminating scheduling chaos and reducing no-shows through automated SMS reminders.

## Problem Statement

Small clinics (dental, general practice, physiotherapy) in Serbia face daily challenges:

1. **Double bookings** - Paper calendars lead to conflicts
2. **Forgotten appointments** - Patients don't show up, wasting clinic time
3. **Phone call overload** - Staff constantly interrupted to schedule appointments
4. **Disorganized patient records** - No centralized patient database
5. **No automation** - Everything manual, time-consuming

## Solution

**Moji Termini** - A web-based appointment scheduling application with:

- ✅ Visual calendar for easy scheduling
- ✅ Automated SMS reminders (24h before appointment)
- ✅ Patient database with search
- ✅ Multi-user support (staff logins)
- ✅ Simple statistics and reporting
- ✅ One treatment room, fixed time slots (optimized for small clinics)

## Target Users

### Primary Audience
- **Solo practitioners** (1 doctor/therapist)
- **Small clinics** (2-3 staff members)
- **Clinic types:** Dental, general practice, physiotherapy

### User Personas

#### 1. Dr. Petar - Dentist (Solo Practice)
- 45 years old, runs small dental clinic in Belgrade
- Frustrated with paper calendar, double bookings
- Not very tech-savvy, needs simple interface
- Wants to reduce no-shows
- **Pain Point:** Patients forget appointments, wasted time slots

#### 2. Marija - Receptionist (Small Clinic)
- 32 years old, works at physiotherapy clinic with 3 therapists
- Handles phone calls, scheduling, patient records
- Constantly interrupted by phone calls
- Wants faster way to book appointments
- **Pain Point:** Too much time on phone, hard to track availability

## Core Features (MVP - Version 1.0)

### 1. Authentication & Users
- Staff login (email/password)
- Multi-user support
- JWT-based authentication

### 2. Patient Management
- Create, edit, delete patients
- Store: name, phone, email
- Search patients by name/phone
- Patient list with pagination

### 3. Appointment Scheduling
- Calendar view (daily time slots)
- Book appointments (patient + service + time)
- Edit/cancel appointments
- Prevent double bookings
- Fixed time slots (e.g., every 30 minutes)
- Fields: reason for visit, notes

### 4. Service Types
- Define clinic services (e.g., "Pregled", "Čišćenje zuba")
- Color-coded for calendar visualization
- Fixed duration (MVP)

### 5. SMS Reminders
- Automated SMS sent 24 hours before appointment
- One-way notification (no patient response)
- SMS logging and tracking

### 6. Clinic Settings
- Configure working hours (same every day for MVP)
- Set time slot duration (15, 30, 60 minutes)
- Clinic basic info (name, address, phone)

### 7. Basic Statistics
- Total appointments (scheduled, completed, cancelled, no-show)
- Utilization rate (% of slots booked)
- Daily/weekly breakdown

## Post-MVP Features (Version 2.0+)

### Patient Self-Booking
- Patients can book online themselves
- Clinic staff approval workflow
- Patient portal with login

### Advanced Scheduling
- Custom time slot durations per service
- Drag-and-drop rescheduling
- Manual time selection (not fixed slots)
- Different working hours per day
- Days off / vacation mode

### Enhanced Features
- Patient recognition (returning patients)
- Patient medical history/notes
- Payment tracking
- Recurring appointments
- Waiting list management
- Email notifications
- Two-way SMS (patient can confirm/cancel)
- Multi-location support (clinic branches)
- Integration with ERP systems

## Business Model (Future)

### Pricing Strategy
- **Free Trial:** 30 days, full features
- **Subscription:** ~2000-3000 RSD/month per clinic
- **Includes:**
  - Unlimited appointments
  - Unlimited patients
  - SMS reminders (up to 200/month)
  - Multi-user support
  - Email support

### Revenue Streams
- Monthly SaaS subscription
- Additional SMS packs (if over limit)
- Premium features (future): advanced reports, integrations

### Target Market Size
- **Serbia:** ~5,000 small clinics (estimated)
- **Initial focus:** Belgrade, Novi Sad, Niš
- **Expansion:** Regional cities, then neighboring countries (Bosnia, Croatia, Montenegro)

## Success Metrics (KPIs)

### MVP Success (Beta Phase)
- 10 active clinics using the system
- 80% SMS delivery rate
- Average 30 appointments/clinic/week
- < 5 critical bugs reported
- 4/5 user satisfaction score

### Year 1 Goals
- 100 paying clinics
- 50,000 appointments scheduled
- 10% reduction in no-show rate for clinics
- 90% customer retention
- Break-even on costs

## Technical Constraints

### MVP Constraints
- Single treatment room per clinic (simplifies scheduling)
- Fixed time slots (no overlapping appointments)
- Same working hours every day (no per-day configuration)
- One-way SMS (no patient responses)
- Serbian language only

### Future Enhancements
- Multi-room scheduling
- Flexible time slots
- Multi-language support (English, regional languages)
- Mobile apps (iOS, Android)

## User Flow (Primary Use Case)

### Booking an Appointment

1. **Staff logs in** to the system
2. **Navigates to Calendar** page, selects date
3. **Clicks on available time slot** (e.g., 10:00 AM)
4. **Modal opens** with appointment form
5. **Searches for patient** (or creates new patient inline)
6. **Selects service type** (e.g., "Pregled")
7. **Adds reason for visit** and notes (optional)
8. **Clicks "Book Appointment"**
9. **System saves** and shows success message
10. **Calendar refreshes** to show booked slot
11. **24 hours before appointment:** System automatically sends SMS reminder to patient

### Result
- ✅ Appointment booked in < 1 minute
- ✅ No phone call needed
- ✅ Patient receives reminder
- ✅ Reduced no-show likelihood

## Competitive Landscape

### Existing Solutions (International)
- **Calendly:** Too generic, no clinic-specific features, expensive
- **Acuity Scheduling:** Complex, overkill for small clinics
- **SimplyBook.me:** Not localized for Serbia, no Serbian SMS

### Existing Solutions (Serbia)
- **Limited options** specific to Serbian market
- Most clinics use: Paper calendars, Excel sheets, Google Calendar
- Opportunity: First simple, affordable, localized solution

### Competitive Advantages
- ✅ **Localized:** Serbian language, Serbian SMS provider integration
- ✅ **Simple:** Designed for non-technical users
- ✅ **Affordable:** Pricing tailored for small clinics
- ✅ **Automated reminders:** Reduce no-shows
- ✅ **Fast setup:** Clinic can start using in < 15 minutes

## Risks & Mitigation

### Technical Risks
- **SMS delivery failures** → Use reliable Serbian provider (Serpent.rs), retry logic
- **Scalability** → Start small, optimize as needed
- **Security (patient data)** → HTTPS, secure auth, regular backups

### Business Risks
- **Low adoption** → Beta testing with 5-10 clinics first, gather feedback
- **Churn** → Focus on UX, customer support, regular updates
- **Competition** → Move fast, build relationships, listen to users

### Market Risks
- **Clinics prefer paper** → Emphasize time savings, show ROI (reduced no-shows)
- **Low willingness to pay** → Free trial, flexible pricing, demonstrate value

## Development Approach

### Methodology
- **Agile/Iterative:** Build MVP, gather feedback, iterate
- **User-centered:** Talk to clinic owners frequently
- **Lean:** Ship fast, avoid over-engineering

### Timeline
- **Week 1-2:** Foundation (auth, database, basic UI)
- **Week 3-4:** Patient management, service types
- **Week 5-6:** Appointment scheduling, calendar UI
- **Week 7:** SMS integration
- **Week 8:** Statistics, polish, testing
- **Week 9-10:** Beta testing with 3-5 clinics

### Beta Testing Strategy
1. Recruit 3-5 small clinics (friends, network)
2. Onboard personally (in-person or video call)
3. Gather feedback weekly
4. Fix bugs, improve UX
5. Validate pricing model

## Long-Term Vision (3-5 Years)

1. **Year 1:** Establish in Serbia (100 clinics)
2. **Year 2:** Expand to regional markets (Bosnia, Croatia, Montenegro)
3. **Year 3:** Add advanced features (patient portals, integrations, mobile apps)
4. **Year 4:** Scale to 1,000+ clinics, explore enterprise segment (larger clinics)
5. **Year 5:** Consider exit options (acquisition, sustainable business)

## Core Values

1. **Simplicity** - Easy to use for non-technical users
2. **Reliability** - System must work 99.9% of the time
3. **Affordability** - Pricing accessible for small clinics
4. **Localization** - Tailored for Serbian market (language, culture, providers)
5. **Customer-Centric** - Build what users need, not what we think is cool

## Design Principles

1. **Minimal clicks** - Book appointment in 3-5 clicks
2. **Clear feedback** - Always show success/error messages
3. **Forgiving UX** - Easy to undo/edit actions
4. **Mobile-friendly** - Responsive design (staff use tablets/phones)
5. **Fast loading** - Optimize for Serbian internet speeds

## Stakeholders

- **Owner/Developer:** Petar (DevOps Engineer, 10+ years experience)
- **Target Users:** Clinic staff (doctors, receptionists)
- **End Beneficiaries:** Patients (better experience, fewer missed appointments)
- **SMS Provider:** Serpent.rs (or similar Serbian provider)
- **Hosting:** VPS in Serbia or Europe (low latency)

---

**Document Status:** Living document, updated as project evolves  
**Last Updated:** 2026-05-04  
**Next Review:** After Beta Phase
