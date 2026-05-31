# Assembles docs/evidence-report.html — a self-contained, screenshot-driven storytelling
# evidence report. Embeds every PNG in docs/evidence-assets/ as base64 so the single HTML
# file is fully portable. Run: python build_evidence.py
import base64, os

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, 'evidence-assets')

def uri(name):
    p = os.path.join(ASSETS, name)
    with open(p, 'rb') as f:
        return 'data:image/png;base64,' + base64.b64encode(f.read()).decode()

def fig(name, caption):
    return (f'<figure class="shot reveal" onclick="zoom(this)">'
            f'<img loading="lazy" src="{uri(name)}" alt="{caption}"/>'
            f'<figcaption>{caption}</figcaption></figure>')

# ---- Jira board data (real issues created in project MRS) ----
EPICS = [
    ("Medication Management", "MRS-2", [
        ("As a patient, I can add a medication", "MRS-8", 3),
        ("As a patient, I can view & edit my medications", "MRS-9", 3),
        ("As a patient, I can delete a medication", "MRS-10", 2)]),
    ("Reminder Scheduling", "MRS-3", [
        ("As a patient, I can schedule reminders", "MRS-11", 3),
        ("As a patient, I can edit or cancel a reminder", "MRS-12", 2)]),
    ("Dose Tracking & Adherence", "MRS-4", [
        ("As a patient, I can mark a dose taken/skipped", "MRS-13", 2),
        ("As a patient, I can view adherence & history", "MRS-14", 2)]),
    ("Admin Console", "MRS-5", [
        ("As an admin, I can manage users & roles", "MRS-15", 2),
        ("As an admin, I can view system statistics", "MRS-16", 1)]),
    ("User Authentication", "MRS-1", [
        ("As a patient, I can register & log in securely", "MRS-7", 2)]),
    ("DevOps / CI-CD & Deployment", "MRS-6", [
        ("As a developer, I want automated tests & deployment", "MRS-17", 3)]),
]
def jira_board():
    cols = ""
    for ename, ekey, stories in EPICS:
        scards = ""
        for stitle, skey, subs in stories:
            scards += (f'<div class="jcard"><div class="jkey">{skey} · Story</div>'
                       f'<div class="jtitle">{stitle}</div>'
                       f'<div class="jsub">▸ {subs} sub-tasks</div></div>')
        cols += (f'<div class="jcol"><div class="jepic">{ekey} · EPIC<br><b>{ename}</b></div>{scards}</div>')
    return cols

RUBRIC = [
    ("Project design with SysML", 16, "7 diagrams · requirement traceability"),
    ("Project management with JIRA", 12, "6 epics · 11 stories · 25 sub-tasks"),
    ("UI/UX (Figma)", 12, "lo-fi + hi-fi + interactive prototype"),
    ("Backend with MongoDB", 12, "owner-scoped CRUD · 13 tests"),
    ("Frontend (React)", 12, "responsive · Tailwind · role-gated"),
    ("GitHub version control & branching", 12, "3 feature branches · 3 PRs · 11 commits"),
    ("CI/CD pipeline", 12, "Actions test + deploy · green"),
    ("README & report", 12, "live links · 2,000-word report"),
]
def rubric_rows():
    r = ""
    for name, pts, eviden in RUBRIC:
        r += (f'<div class="rrow"><div class="name">{name}<small>{eviden}</small></div>'
              f'<div class="bar"><i data-w="100"></i></div><div class="pts">{pts} pts</div></div>')
    return r

HTML = r"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>MediRemind — Evidence Report | IFQ636 A1</title>
<style>
:root{--bg:#070b14;--card:#111b2e;--line:#1e2c44;--ink:#e7eefb;--muted:#8da2c0;--teal:#2dd4bf;--blue:#3b82f6;--green:#22c55e;--violet:#a78bfa;--grad:linear-gradient(120deg,#2dd4bf,#3b82f6 55%,#a78bfa)}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:'Segoe UI',system-ui,sans-serif;line-height:1.6;overflow-x:hidden}
.wrap{max-width:1140px;margin:0 auto;padding:0 24px}
h1,h2,h3{line-height:1.15;font-weight:800;letter-spacing:-.02em}
.grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:rgba(7,11,20,.75);border-bottom:1px solid var(--line)}
nav .wrap{display:flex;align-items:center;justify-content:space-between;height:58px}
nav .brand{font-weight:800}nav .links{display:flex;gap:18px;font-size:13.5px;color:var(--muted)}
nav .links a{text-decoration:none}nav .links a:hover{color:var(--teal)}
@media(max-width:820px){nav .links{display:none}}
.hero{position:relative;padding:84px 0 60px;text-align:center}
.hero::before{content:"";position:absolute;inset:-30% -10% auto;height:560px;background:radial-gradient(50% 60% at 50% 0,rgba(59,130,246,.22),transparent 70%),radial-gradient(40% 40% at 80% 10%,rgba(45,212,191,.16),transparent 70%);z-index:-1}
.pill{display:inline-flex;gap:8px;border:1px solid var(--line);background:var(--card);padding:7px 14px;border-radius:999px;font-size:13px;color:var(--muted)}
.hero h1{font-size:clamp(32px,5.5vw,56px);margin:20px 0 8px}
.hero p{color:var(--muted);font-size:clamp(15px,2.2vw,19px);max-width:720px;margin:0 auto}
.status{margin:24px auto 0;display:inline-flex;gap:10px;align-items:center;border:1px solid var(--line);background:var(--card);padding:10px 18px;border-radius:12px;font-size:14px}
.dot{width:10px;height:10px;border-radius:50%;background:var(--muted)}
.dot.live{background:var(--green);animation:pulse 1.8s infinite}.dot.down{background:#ef4444}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,.5)}70%{box-shadow:0 0 0 12px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
.cta{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:26px}
.btn{text-decoration:none;font-weight:600;font-size:13.5px;padding:11px 18px;border-radius:11px;border:1px solid var(--line);background:var(--card);transition:transform .15s,border-color .2s}
.btn:hover{transform:translateY(-2px);border-color:var(--teal)}.btn.p{background:var(--grad);color:#04121f;border:none}
section{padding:60px 0;border-top:1px solid var(--line)}
.eyebrow{color:var(--teal);font-weight:700;font-size:12.5px;letter-spacing:.14em;text-transform:uppercase}
.chapnum{font-size:13px;color:var(--violet);font-weight:700}
.h2{font-size:clamp(24px,3.6vw,38px);margin:6px 0}
.lead{color:var(--muted);max-width:780px;font-size:16.5px;margin-top:6px}
.gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:28px}
.gallery.three{grid-template-columns:repeat(3,1fr)}
@media(max-width:820px){.gallery,.gallery.three{grid-template-columns:1fr}}
.shot{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;cursor:zoom-in;transition:transform .15s,border-color .2s}
.shot:hover{transform:translateY(-3px);border-color:var(--teal)}
.shot img{width:100%;display:block;border-bottom:1px solid var(--line);background:#fff}
.shot figcaption{padding:12px 14px;color:var(--muted);font-size:13px}
.big img{max-height:none}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:26px}
@media(max-width:820px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}
.stat .n{font-size:34px;font-weight:800}.stat .l{color:var(--muted);font-size:12.5px}
.jboard{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:26px}
@media(max-width:820px){.jboard{grid-template-columns:1fr}}
.jcol{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px}
.jepic{font-size:11px;color:var(--violet);font-weight:700;letter-spacing:.06em;padding:8px;border-radius:8px;background:rgba(167,139,250,.08);margin-bottom:10px}
.jepic b{color:var(--ink);font-size:14px;font-weight:700}
.jcard{background:#0a1424;border:1px solid var(--line);border-radius:9px;padding:10px;margin-bottom:8px}
.jkey{font-size:10.5px;color:var(--teal);font-weight:700}.jtitle{font-size:13px;margin:3px 0}.jsub{font-size:11px;color:var(--muted)}
.term{margin-top:24px;background:#05090f;border:1px solid var(--line);border-radius:12px;overflow:hidden;font-family:Consolas,monospace;font-size:12.5px}
.term .tb{background:#0a1424;padding:8px 12px;border-bottom:1px solid var(--line);color:var(--muted)}
.term pre{padding:14px;overflow-x:auto;color:#b9f5e8;white-space:pre}
.rubric{margin-top:26px;display:grid;gap:11px}
.rrow{display:grid;grid-template-columns:1.6fr 2fr auto;gap:14px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:11px;padding:13px 16px}
@media(max-width:760px){.rrow{grid-template-columns:1fr}}
.rrow .name{font-weight:600}.rrow .name small{display:block;color:var(--muted);font-weight:400;font-size:12px}
.bar{height:9px;background:#0a1424;border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;width:0;background:var(--grad);transition:width 1.2s}
.pts{font-weight:800;white-space:nowrap}
.note{margin-top:14px;border:1px dashed var(--line);background:rgba(245,158,11,.06);border-radius:10px;padding:12px 16px;color:var(--muted);font-size:13.5px}
footer{border-top:1px solid var(--line);padding:36px 0 64px;color:var(--muted);font-size:13.5px}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .7s,transform .7s}.reveal.in{opacity:1;transform:none}
#lb{position:fixed;inset:0;background:rgba(2,6,14,.94);display:none;align-items:center;justify-content:center;z-index:100;padding:30px;cursor:zoom-out}
#lb img{max-width:96%;max-height:92%;border-radius:10px;border:1px solid var(--line)}
code{background:#0a1424;border:1px solid var(--line);padding:2px 6px;border-radius:6px;color:var(--teal);font-size:13px}
</style></head><body>

<nav><div class="wrap"><div class="brand">💊 MediRemind <span style="color:var(--muted);font-weight:500;font-size:13px">· Evidence Report</span></div>
<div class="links"><a href="#sysml">SysML</a><a href="#jira">Jira</a><a href="#app">App</a><a href="#github">GitHub</a><a href="#cicd">CI/CD</a><a href="#deploy">Deploy</a><a href="#score">Scorecard</a></div></div></nav>

<header class="hero"><div class="wrap">
<span class="pill">🎓 QUT IFQ636 · Assignment 1 · Evidence Report</span>
<h1>The proof, <span class="grad">screenshot by screenshot</span>.</h1>
<p>Every deliverable of the Medication Reminder System — designed, planned, built, automated and deployed — captured as real evidence. The badge below pings the live AWS server right now.</p>
<div class="status"><span id="dot" class="dot"></span><span id="st">Checking the live server…</span></div>
<div class="cta"><a class="btn p" href="http://3.27.69.84:5001" target="_blank">🌐 Live app</a>
<a class="btn" href="https://github.com/osama-m-qut/medication-reminder-system" target="_blank">⌥ GitHub</a>
<a class="btn" href="https://nomadsps.atlassian.net/jira/software/projects/MRS/boards/" target="_blank">📋 Jira</a>
<a class="btn" href="https://www.figma.com/design/eOTBAmuSM5tgCKIcsGb490" target="_blank">🎨 Figma</a></div>
<div class="stats reveal"><div class="stat"><div class="n" data-count="100">0</div><div class="l">Rubric pts mapped</div></div>
<div class="stat"><div class="n" data-count="20">0</div><div class="l">Evidence screenshots</div></div>
<div class="stat"><div class="n" data-count="14">0</div><div class="l">Tests passing</div></div>
<div class="stat"><div class="n" data-count="42">0</div><div class="l">Jira issues</div></div></div>
</div></header>

<section id="sysml"><div class="wrap reveal">
<div class="chapnum">CHAPTER 1</div><span class="eyebrow">Design · SysML</span>
<h2 class="h2">It was modelled before it was built.</h2>
<p class="lead">Seven SysML diagrams in diagrams.net. The requirement diagram anchors everything: the top requirement decomposes into five sub-requirements, and each design block is tied back with «satisfy». Click any diagram to enlarge.</p>
<div class="gallery">__SYSML__</div>
</div></section>

<section id="jira"><div class="wrap reveal">
<div class="chapnum">CHAPTER 2</div><span class="eyebrow">Plan · JIRA</span>
<h2 class="h2">Planned as epics, stories & sub-tasks.</h2>
<p class="lead">A live Scrum project (key <code>MRS</code>) with 6 epics, 11 user stories and 25 sub-tasks — 42 issues in total, created and linked. Open the live board for the interactive view.</p>
<div class="jboard">__JIRA__</div>
<div class="note">📋 This reproduces the real issue hierarchy created in project <b>MRS</b> (42 issues, verified). The live board — including sprint planning screenshots — is at the Jira link above.</div>
</div></section>

<section id="app"><div class="wrap reveal">
<div class="chapnum">CHAPTER 3</div><span class="eyebrow">Product · The live application</span>
<h2 class="h2">A working product, running on AWS.</h2>
<p class="lead">These are real screenshots of the deployed app at <code>http://3.27.69.84:5001</code> — captured live, with seeded data. Full CRUD for medications & reminders, adherence tracking, and a role-gated admin panel.</p>
<div class="gallery">__APP__</div>
</div></section>

<section id="github"><div class="wrap reveal">
<div class="chapnum">CHAPTER 4</div><span class="eyebrow">Engineering · GitHub</span>
<h2 class="h2">A clean, reviewable history.</h2>
<p class="lead">A feature-branch workflow: <code>main</code> plus three feature branches, each merged through a pull request — 11 commits of traceable history.</p>
<div class="gallery">__GH__</div>
</div></section>

<section id="cicd"><div class="wrap reveal">
<div class="chapnum">CHAPTER 5</div><span class="eyebrow">Automation · CI/CD</span>
<h2 class="h2">Test → build → deploy, automatically.</h2>
<p class="lead">GitHub Actions runs the test suite, builds the frontend on the runner, ships it to EC2 over SSH, and reloads PM2 — using a protected <code>production</code> environment with encrypted secrets. Both jobs green.</p>
<div class="gallery">__CICD__</div>
</div></section>

<section id="deploy"><div class="wrap reveal">
<div class="chapnum">CHAPTER 6</div><span class="eyebrow">Deployment · AWS EC2</span>
<h2 class="h2">Live on the public internet.</h2>
<p class="lead">An Ubuntu EC2 instance in Sydney — <b>MediRemind-EC2</b> (<code>i-0a217255a436bf02d</code>, IP <code>3.27.69.84</code>). The backend runs under PM2 and serves the React build; MongoDB runs in Docker. Real server output:</p>
<div class="term"><div class="tb">ubuntu@MediRemind-EC2 : ~/medication-reminder-system — pm2 status</div><pre>┌────┬───────────────────────────────┬─────────┬─────────┬───────────┬──────────┐
│ id │ name                          │ mode    │ pid     │ status    │ mem      │
├────┼───────────────────────────────┼─────────┼─────────┼───────────┼──────────┤
│ 0  │ medication-reminder-system    │ fork    │ 9682    │ online ✅ │ 91.0mb   │
└────┴───────────────────────────────┴─────────┴─────────┴───────────┴──────────┘

$ sudo docker ps --format '{{.Names}} {{.Status}}'
mongo  Up 7 minutes

$ curl http://3.27.69.84:5001/api/health
{"status":"ok","service":"Medication Reminder System API"}</pre></div>
</div></section>

<section id="score"><div class="wrap reveal">
<span class="eyebrow">Marking criteria</span><h2 class="h2">Every rubric line, mapped to evidence above.</h2>
<div class="rubric">__RUBRIC__</div>
<div style="text-align:right;margin-top:16px;color:var(--muted)">Total mapped: <b style="color:var(--teal);font-size:20px">100 / 100</b> pts</div>
</div></section>

<footer><div class="wrap">
<p><b style="color:var(--ink)">Osama Mohamed</b> · Student ID 12281069 · IFQ636 Software Lifecycle Management — Assignment 1 · Project #17 Medication Reminder System</p>
<p style="margin-top:8px">Demo logins: patient@mediremind.com / Patient@123 · admin@mediremind.com / Admin@123</p>
<p style="margin-top:8px"><b style="color:var(--ink)">Use of GenAI:</b> GitHub Copilot assisted with brainstorming, application-structure advice, Figma guidance, generating &amp; auto-completing code snippets inside VS Code, generating the automated test suites (Mocha + Sinon backend tests and the React Testing Library frontend test), and helping build the CI/CD pipeline; all output was reviewed, run and adapted.</p>
</div></footer>

<div id="lb" onclick="this.style.display='none'"><img id="lbimg" src="" alt=""/></div>
<script>
(function(){var d=document.getElementById('dot'),s=document.getElementById('st');
fetch('http://3.27.69.84:5001/api/health',{cache:'no-store'}).then(r=>r.json()).then(j=>{d.className='dot live';s.innerHTML='Live server responded: <b style="color:#22c55e">'+(j.status||'ok').toUpperCase()+'</b> · '+(j.service||'API');}).catch(()=>{d.className='dot down';s.innerHTML='Server not reachable from this page — open the <a style="color:#2dd4bf" href="http://3.27.69.84:5001" target="_blank">live link</a>.';});})();
function zoom(el){var img=el.querySelector('img');document.getElementById('lbimg').src=img.src;document.getElementById('lb').style.display='flex';}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');
e.target.querySelectorAll('[data-count]').forEach(function(el){var t=+el.dataset.count,s=null;function st(ts){if(!s)s=ts;var p=Math.min((ts-s)/1100,1);el.textContent=Math.round(p*t);if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);});
e.target.querySelectorAll('.bar i').forEach(function(b){b.style.width=b.dataset.w+'%';});io.unobserve(e.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
</script></body></html>"""

sysml = "".join([
    fig('sysml-1-requirement.png', '1 · Requirement diagram — R0 → R1–R5 with «deriveReqt» / «satisfy» traceability.'),
    fig('sysml-2-usecase.png', '2 · Use case diagram — Patient & Admin actors and interactions.'),
    fig('sysml-3-bdd.png', '3 · Block Definition Diagram — entities, associations & multiplicities.'),
    fig('sysml-4-ibd.png', '4 · Internal Block Diagram — React ⇄ Express ⇄ MongoDB on EC2.'),
    fig('sysml-5-activity.png', '5 · Activity diagram — the "log a dose" workflow.'),
    fig('sysml-6-sequence.png', '6 · Sequence diagram — creating a reminder end-to-end.'),
    fig('sysml-7-statemachine.png', '7 · State machine — DoseLog lifecycle.'),
])
app = "".join([
    fig('01-login.png', 'Secure JWT login — served live from EC2.'),
    fig('02-dashboard.png', 'Patient dashboard — 67% adherence + today\'s schedule with one-tap logging.'),
    fig('03-medications.png', 'Medications — full CRUD (create form + list with edit/delete).'),
    fig('04-reminders.png', 'Reminders — dose schedules per medication (CRUD).'),
    fig('05-history.png', 'Dose history — every logged dose with status badge.'),
    fig('06-admin.png', 'Admin panel — system stats + user management (promote/demote/delete).'),
])
gh = "".join([
    fig('07-github-repo.png', 'Repository — backend/ + frontend/ with README.'),
    fig('08-branches.png', 'Branches — main + 3 feature branches.'),
    fig('09-pull-requests.png', 'Pull requests — 3 merged PRs.'),
    fig('10-commits.png', 'Commit history on main.'),
])
cicd = "".join([
    fig('12-pipeline-run.png', 'A pipeline run — Build & Test + Deploy to EC2, both green.'),
    fig('11-actions-list.png', 'GitHub Actions — workflow run history.'),
    fig('13-workflow-yml.png', 'The CI/CD workflow definition (ci-cd.yml).'),
])

out = (HTML.replace('__SYSML__', sysml).replace('__JIRA__', jira_board())
       .replace('__APP__', app).replace('__GH__', gh).replace('__CICD__', cicd)
       .replace('__RUBRIC__', rubric_rows()))

with open(os.path.join(HERE, 'evidence-report.html'), 'w', encoding='utf-8') as f:
    f.write(out)
print('Wrote evidence-report.html (%.1f KB)' % (len(out)/1024))
