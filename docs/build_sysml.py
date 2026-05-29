# Generates docs/sysml-diagrams.drawio (multi-page diagrams.net file) for the
# Medication Reminder System. Run: python build_sysml.py
# Each helper appends mxCell XML; we keep ids unique per page.
import html

def esc(s):
    return html.escape(str(s), quote=True)

class Page:
    def __init__(self, name, pid):
        self.name = name
        self.pid = pid
        self.cells = []
        self.n = 1
    def _id(self, key=None):
        self.n += 1
        return f"{self.pid}-{key or self.n}"
    def node(self, cid, label, x, y, w, h, style):
        self.cells.append(
            f'<mxCell id="{cid}" value="{esc(label)}" style="{style}" vertex="1" parent="1">'
            f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')
        return cid
    def edge(self, src, dst, label="", style="endArrow=open;html=1;"):
        cid = self._id()
        self.cells.append(
            f'<mxCell id="{cid}" value="{esc(label)}" style="{style}" edge="1" parent="1" '
            f'source="{src}" target="{dst}"><mxGeometry relative="1" as="geometry"/></mxCell>')
        return cid
    def xml(self):
        body = "".join(self.cells)
        return (f'<diagram name="{esc(self.name)}" id="{self.pid}">'
                f'<mxGraphModel dx="1100" dy="700" grid="1" gridSize="10" guides="1" '
                f'tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" '
                f'pageWidth="1169" pageHeight="826" math="0" shadow="0"><root>'
                f'<mxCell id="0"/><mxCell id="1" parent="0"/>{body}</root></mxGraphModel></diagram>')

# ---- styles ----
REQ = "rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;verticalAlign=top;"
BLK = "rounded=0;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;verticalAlign=top;"
UC  = "ellipse;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;"
ACTOR = "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;"
STATE = "rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;"
ACT = "rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
START = "ellipse;whiteSpace=wrap;html=1;fillColor=#000000;strokeColor=#000000;"
END = "ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;"
DECISION = "rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
LIFELINE = "shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=0;fillColor=#dae8fc;strokeColor=#6c8ebf;"
NOTE = "shape=note;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;align=left;verticalAlign=top;"
DERIVE = "endArrow=open;html=1;dashed=1;startArrow=none;"
SATISFY = "endArrow=open;html=1;dashed=1;"
CONTAIN = "endArrow=none;html=1;startArrow=circlePlus;startFill=0;"

pages = []

# ============ PAGE 1: REQUIREMENT DIAGRAM ============
p = Page("1. Requirement Diagram", "req")
def req(cid, name, rid, text, x, y, w=210, h=90):
    label = f"&laquo;requirement&raquo;<br/><b>{name}</b><hr/>id = {rid}<br/>{text}"
    return p.node(cid, label, x, y, w, h, REQ)

p.node("req-title", "req [package] Medication Reminder System [Requirements]", 40, 10, 520, 24,
       "text;html=1;fontStyle=2;align=left;")
root = req("R0", "Medication Reminder System", "R0",
           "The system shall help patients manage medications and adherence.", 460, 60, 250, 80)
r1 = req("R1", "Medication Management", "R1", "Patients manage their medication records (CRUD).", 60, 200)
r2 = req("R2", "Reminder Scheduling", "R2", "Patients schedule dose reminders per medication.", 300, 200)
r3 = req("R3", "Dose Tracking & Adherence", "R3", "System records doses and computes adherence.", 540, 200)
r4 = req("R4", "User Authentication", "R4", "Secure registration and login (JWT).", 780, 200)
r5 = req("R5", "Admin Management", "R5", "Admins manage users and view system stats.", 1000, 200, 150, 90)
for c in (r1, r2, r3, r4, r5):
    p.edge(root, c, "", CONTAIN)
# derived sub-requirements for R1
r11 = req("R11", "Add/Edit/Delete Medication", "R1.1", "Create, update, delete medications.", 20, 360, 200, 80)
r12 = req("R12", "View Medications", "R1.2", "List a patient's own medications only.", 240, 360, 200, 80)
p.edge(r1, r11, "&laquo;deriveReqt&raquo;", DERIVE)
p.edge(r1, r12, "&laquo;deriveReqt&raquo;", DERIVE)
r31 = req("R31", "Compute Adherence", "R3.1", "adherence = taken / (taken+skipped+missed).", 540, 360, 220, 80)
p.edge(r3, r31, "&laquo;deriveReqt&raquo;", DERIVE)
# design blocks that satisfy requirements
b_med = p.node("B-med", "&laquo;block&raquo;<br/><b>MedicationService</b>", 20, 500, 200, 50, BLK)
b_rem = p.node("B-rem", "&laquo;block&raquo;<br/><b>ReminderService</b>", 300, 500, 200, 50, BLK)
b_dose = p.node("B-dose", "&laquo;block&raquo;<br/><b>DoseLogService</b>", 540, 500, 220, 50, BLK)
b_auth = p.node("B-auth", "&laquo;block&raquo;<br/><b>AuthService</b>", 780, 500, 160, 50, BLK)
b_admin = p.node("B-admin", "&laquo;block&raquo;<br/><b>AdminService</b>", 980, 500, 170, 50, BLK)
p.edge(b_med, r1, "&laquo;satisfy&raquo;", SATISFY)
p.edge(b_rem, r2, "&laquo;satisfy&raquo;", SATISFY)
p.edge(b_dose, r3, "&laquo;satisfy&raquo;", SATISFY)
p.edge(b_auth, r4, "&laquo;satisfy&raquo;", SATISFY)
p.edge(b_admin, r5, "&laquo;satisfy&raquo;", SATISFY)
p.node("req-note", "Relationships: containment (⊕) decomposes R0; &laquo;deriveReqt&raquo; derives "
       "detailed requirements; &laquo;satisfy&raquo; links design blocks to the requirements they fulfil.",
       20, 600, 600, 60, NOTE)
pages.append(p)

# ============ PAGE 2: USE CASE DIAGRAM ============
p = Page("2. Use Case Diagram", "uc")
p.node("uc-title", "uc [Medication Reminder System]", 40, 10, 360, 24, "text;html=1;fontStyle=2;align=left;")
p.node("uc-boundary", "Medication Reminder System", 300, 50, 520, 620,
       "rounded=0;whiteSpace=wrap;html=1;fillColor=none;verticalAlign=top;")
patient = p.node("A-patient", "Patient", 80, 250, 40, 80, ACTOR)
admin = p.node("A-admin", "Admin", 880, 250, 40, 80, ACTOR)
ucs = [
    ("U1", "Register / Login", 360, 90),
    ("U2", "Manage Medications", 360, 170),
    ("U3", "Schedule Reminders", 360, 250),
    ("U4", "Log Dose (taken/skipped)", 360, 330),
    ("U5", "View Adherence Dashboard", 360, 410),
    ("U6", "View Dose History", 360, 490),
    ("U7", "Manage Users", 560, 250),
    ("U8", "View System Statistics", 560, 410),
]
ids = {}
for cid, label, x, y in ucs:
    ids[cid] = p.node(cid, label, x, y, 180, 50, UC)
for u in ("U1", "U2", "U3", "U4", "U5", "U6"):
    p.edge(patient, ids[u])
for u in ("U1", "U7", "U8"):
    p.edge(admin, ids[u])
# include relationship
p.edge(ids["U2"], ids["U1"], "&laquo;include&raquo;", DERIVE)
pages.append(p)

# ============ PAGE 3: BLOCK DEFINITION DIAGRAM ============
p = Page("3. Block Definition Diagram (BDD)", "bdd")
p.node("bdd-title", "bdd [System Blocks]", 40, 10, 300, 24, "text;html=1;fontStyle=2;align=left;")
def block(cid, name, attrs, x, y, w=210, h=120):
    label = f"&laquo;block&raquo;<br/><b>{name}</b><hr/>{attrs}"
    return p.node(cid, label, x, y, w, h, BLK)
sys = block("S", "MedicationReminderSystem", "parts: see below", 460, 50, 260, 60)
user = block("Buser", "User", "name, email, password<br/>role: user|admin", 40, 200)
med = block("Bmed", "Medication", "name, dosage, form<br/>instructions, quantity, active", 280, 200)
rem = block("Brem", "Reminder", "times[], frequency<br/>startDate, endDate, active", 520, 200)
dose = block("Bdose", "DoseLog", "scheduledTime, status<br/>takenAt, notes", 760, 200)
for c in (user, med, rem, dose):
    p.edge(sys, c, "", CONTAIN)
# associations with multiplicities
p.edge(user, med, "1 owns 0..*", "endArrow=open;html=1;")
p.edge(med, rem, "1 has 0..*", "endArrow=open;html=1;")
p.edge(rem, dose, "1 generates 0..*", "endArrow=open;html=1;")
p.edge(med, dose, "1 logged-as 0..*", "endArrow=open;html=1;")
pages.append(p)

# ============ PAGE 4: INTERNAL BLOCK DIAGRAM ============
p = Page("4. Internal Block Diagram (IBD)", "ibd")
p.node("ibd-title", "ibd [MedicationReminderSystem]", 40, 10, 360, 24, "text;html=1;fontStyle=2;align=left;")
fe = p.node("ibd-fe", "&laquo;part&raquo; : ReactClient<br/>(Dashboard, CRUD pages)", 60, 90, 220, 70, BLK)
api = p.node("ibd-api", "&laquo;part&raquo; : ExpressAPI<br/>(REST controllers + JWT)", 460, 90, 220, 70, BLK)
db = p.node("ibd-db", "&laquo;part&raquo; : MongoDB<br/>(users, medications,<br/>reminders, doselogs)", 460, 260, 220, 80, BLK)
p.edge(fe, api, "HTTPS / JSON  (port 5001)", "endArrow=open;startArrow=open;html=1;")
p.edge(api, db, "Mongoose (TCP 27017)", "endArrow=open;startArrow=open;html=1;")
p.node("ibd-note", "Deployed on a single AWS EC2 instance: Express (PM2) serves the React build and the "
       "REST API; MongoDB runs locally on the instance.", 60, 380, 620, 50, NOTE)
pages.append(p)

# ============ PAGE 5: ACTIVITY DIAGRAM (Log a Dose) ============
p = Page("5. Activity Diagram - Log a Dose", "act")
p.node("act-title", "act [Log a Dose]", 40, 10, 240, 24, "text;html=1;fontStyle=2;align=left;")
s = p.node("act-start", "", 120, 60, 30, 30, START)
a1 = p.node("act-1", "Open Dashboard", 80, 130, 130, 50, ACT)
a2 = p.node("act-2", "View today's reminders", 80, 210, 130, 50, ACT)
d1 = p.node("act-d1", "Dose due?", 90, 300, 110, 70, DECISION)
a3 = p.node("act-3", "Tap 'Mark Taken' / 'Skip'", 280, 300, 150, 50, ACT)
a4 = p.node("act-4", "POST /api/doselogs", 280, 390, 150, 50, ACT)
a5 = p.node("act-5", "Persist DoseLog + recompute adherence", 280, 470, 200, 50, ACT)
a6 = p.node("act-6", "Refresh dashboard stats", 280, 550, 200, 50, ACT)
e = p.node("act-end", "", 350, 640, 30, 30, END)
p.edge(s, a1); p.edge(a1, a2); p.edge(a2, d1)
p.edge(d1, a3, "yes"); p.edge(d1, a2, "no")
p.edge(a3, a4); p.edge(a4, a5); p.edge(a5, a6); p.edge(a6, e)
pages.append(p)

# ============ PAGE 6: SEQUENCE DIAGRAM (Create Reminder) ============
p = Page("6. Sequence Diagram - Create Reminder", "seq")
p.node("seq-title", "sd [Create Reminder]", 40, 10, 260, 24, "text;html=1;fontStyle=2;align=left;")
ll = [
    ("L1", "Patient", 80),
    ("L2", "ReactClient", 260),
    ("L3", "ExpressAPI /reminders", 460),
    ("L4", "ReminderController", 700),
    ("L5", "MongoDB", 940),
]
lids = {}
for cid, label, x in ll:
    lids[cid] = p.node(cid, label, x, 50, 150, 560, LIFELINE)
def msg(src, dst, label, y, dashed=False):
    style = "html=1;endArrow=open;" + ("dashed=1;" if dashed else "")
    cid = p._id()
    p.cells.append(
        f'<mxCell id="{cid}" value="{esc(label)}" style="{style}" edge="1" parent="1">'
        f'<mxGeometry relative="1" as="geometry">'
        f'<mxPoint x="{src}" y="{y}" as="sourcePoint"/>'
        f'<mxPoint x="{dst}" y="{y}" as="targetPoint"/></mxGeometry></mxCell>')
msg(155, 335, "fill reminder form + submit", 130)
msg(335, 535, "POST /api/reminders (JWT)", 180)
msg(535, 775, "createReminder(req)", 230)
msg(775, 1015, "validate medication ownership", 280)
msg(1015, 775, "medication found", 330, dashed=True)
msg(775, 1015, "insert Reminder", 380)
msg(1015, 775, "saved doc", 430, dashed=True)
msg(775, 535, "201 Created (reminder)", 480, dashed=True)
msg(535, 335, "JSON response", 530, dashed=True)
msg(335, 155, "show new reminder in list", 580, dashed=True)
pages.append(p)

# ============ PAGE 7: STATE MACHINE (Dose lifecycle) ============
p = Page("7. State Machine - Dose Lifecycle", "stm")
p.node("stm-title", "stm [DoseLog.status]", 40, 10, 260, 24, "text;html=1;fontStyle=2;align=left;")
s = p.node("stm-start", "", 80, 90, 30, 30, START)
sched = p.node("stm-sched", "Scheduled", 200, 80, 140, 50, STATE)
taken = p.node("stm-taken", "Taken", 460, 30, 120, 50, STATE)
skipped = p.node("stm-skip", "Skipped", 460, 130, 120, 50, STATE)
missed = p.node("stm-miss", "Missed", 460, 230, 120, 50, STATE)
e = p.node("stm-end", "", 700, 140, 30, 30, END)
p.edge(s, sched)
p.edge(sched, taken, "markTaken / takenAt=now")
p.edge(sched, skipped, "skip")
p.edge(sched, missed, "time elapsed (no action)")
p.edge(taken, e); p.edge(skipped, e); p.edge(missed, e)
pages.append(p)

# ---- assemble file ----
out = '<mxfile host="app.diagrams.net" type="device">' + "".join(pg.xml() for pg in pages) + '</mxfile>'
with open("sysml-diagrams.drawio", "w", encoding="utf-8") as f:
    f.write(out)
print(f"Wrote sysml-diagrams.drawio with {len(pages)} diagrams.")

# validate well-formed XML
import xml.dom.minidom as md
md.parseString(out)
print("XML is well-formed.")
