# JIRA Backlog — Medication Reminder System

Scrum project. Epics → user stories → sub-tasks. Sprint column shows the planned sprint.
Two non-authentication epics (Medication Management, Reminder Scheduling) are highlighted for
the report's required epic screenshots.

## Epic: User Authentication  *(starter — do NOT use for the report's epic screenshots)*
- Story: As a patient, I can register and log in securely. *(Sprint 1)*
  - Sub-tasks: User model + bcrypt hashing · JWT generation · register/login controllers · protect middleware · auth tests

## ⭐ Epic: Medication Management  *(use for report)*
- Story: As a patient, I can add a medication so my regimen is recorded. *(Sprint 1)*
  - Sub-tasks: Medication model · createMedication controller · MedicationForm UI · validation · controller test
- Story: As a patient, I can view and edit my medications. *(Sprint 1)*
  - Sub-tasks: getMedications/getById · updateMedication (owner check) · MedicationList UI · edit flow
- Story: As a patient, I can delete a medication I no longer take. *(Sprint 1)*
  - Sub-tasks: deleteMedication (owner check) · delete confirmation UI · test

## ⭐ Epic: Reminder Scheduling  *(use for report)*
- Story: As a patient, I can schedule reminders for a medication. *(Sprint 2)*
  - Sub-tasks: Reminder model · createReminder (validate medication ownership) · ReminderForm UI · time parsing
- Story: As a patient, I can edit or cancel a reminder. *(Sprint 2)*
  - Sub-tasks: updateReminder · deleteReminder · ReminderList UI · active toggle

## Epic: Dose Tracking & Adherence
- Story: As a patient, I can mark a dose as taken or skipped. *(Sprint 2)*
  - Sub-tasks: DoseLog model · createDoseLog · Dashboard quick-log buttons
- Story: As a patient, I can see my adherence and dose history. *(Sprint 2)*
  - Sub-tasks: adherence aggregation · getDoseLogs · Dashboard stats · History table

## Epic: Admin Console
- Story: As an admin, I can manage users and roles. *(Sprint 2)*
  - Sub-tasks: admin middleware · getUsers/updateRole/deleteUser · Admin users table UI
- Story: As an admin, I can view system statistics. *(Sprint 2)*
  - Sub-tasks: getSystemStats aggregation · Admin stats cards UI

## Epic: DevOps / CI-CD & Deployment
- Story: As a developer, I want automated tests and deployment. *(Sprint 2)*
  - Sub-tasks: GitHub Actions workflow · EC2 provisioning · pm2 config · SSH deploy + secrets

---
### Sprint plan
- **Sprint 1** — Authentication + Medication Management (foundation + first CRUD).
- **Sprint 2** — Reminders, Dose Tracking, Admin Console, DevOps.

### Report screenshot checklist (rubric)
Backlog · roadmap/timeline (epics+stories) · a story with sub-tasks (x2 epics) · all sprints
planned · a started-but-incomplete sprint · full board after sprint start · a completed sprint ·
board URL in report + README.
