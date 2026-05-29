# Video Demonstration Script — Medication Reminder System (10 minutes)

Record in **Canvas Studio** with your **camera ON** (face visible — academic-integrity requirement).
Speak to each point; keep the app, Jira, Figma and GitHub tabs open beforehand.

| # | Time | Scene | What to say / show |
|---|------|-------|--------------------|
| 1 | 0:00–0:40 | Webcam intro | "Hi, I'm Osama Mohamed, student 12281069. This is my IFQ636 Assignment 1 — the Medication Reminder System." State the problem: medication non-adherence and how the app helps. |
| 2 | 0:40–1:30 | Real-world & requirements | Briefly cover the user/admin roles and the key requirements (manage medications, schedule reminders, track adherence, admin oversight). |
| 3 | 1:30–3:00 | SysML (diagrams.net) | Open the .drawio. Walk through the **requirement diagram** (R0 → R1–R5, «deriveReqt», «satisfy»). Show use case, BDD, IBD, activity, sequence, state machine — one sentence each. |
| 4 | 3:00–4:00 | JIRA | Show the board URL, backlog, two non-auth epics with stories+subtasks, the sprints, and a completed sprint. |
| 5 | 4:00–4:45 | Figma | Show low-fi wireframes, high-fi screens and click through the **interactive prototype**. Mention design decisions (big buttons, status colours). |
| 6 | 4:45–7:30 | **Live app demo** (the core — do this on the public EC2 URL) | Register a new patient → log in. Create a medication (CRUD-create), edit it (update), show the list (read). Create a reminder. On the Dashboard, "Mark Taken" / "Skip" a dose and show adherence update. Open History. Log out, log in as admin → show admin stats + user management (promote/demote, delete). Delete a medication to show delete. |
| 7 | 7:30–8:30 | GitHub | Show the repo (backend/ + frontend/), the feature branches, an example pull request, and the commit history. |
| 8 | 8:30–9:30 | CI/CD | Show the Actions run page (test + deploy jobs passing), the ci-cd.yml, the production environment/secrets, and `pm2 status` on the EC2 instance via SSH. |
| 9 | 9:30–10:00 | Wrap-up | Show the browser with the public IP highlighted. One sentence on what you learned (reflection) and thank the viewer. |

**Tips**
- Rehearse once; the live demo (scene 6) is weighted most — make sure every CRUD operation is shown working against the *public* URL, not localhost.
- Keep each non-app section tight; assessors verify functionality through the demo, so spend time on the running system.
- Have the demo data seeded (`node seed.js`) so adherence and lists aren't empty.
