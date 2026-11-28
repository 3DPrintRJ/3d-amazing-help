import assert from "node:assert/strict";
import {readFileSync,existsSync,readdirSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const home=read("index.html");
const cards=[...home.matchAll(/<a class="card(?: [^"]*)?" href="([^"]+)" data-search="([^"]+)">([\s\S]*?)<\/a>/g)]
 .map(([,href,keywords,html])=>({href,search:(keywords+" "+html.replace(/<[^>]+>/g," ")).toLowerCase()}));
const matches=q=>cards.filter(c=>q.toLowerCase().split(/\s+/).every(w=>c.search.includes(w))).map(c=>c.href);
test("Help search keeps current topic aliases and valid links",()=>{
 for(const c of cards) assert.ok(existsSync(new URL("../"+(c.href==="roadmap/"?"roadmap/index.html":c.href),import.meta.url)),c.href);
 for(const [term,page] of [["theme","appearance.html"],["colors","appearance.html"],["buy resell","products.html"],["reset practice","practice-workspace.html"],["sales tax","settings.html"],["free limits","faq.html"],["settings features","search.html"],["sign in","password-help.html"],["beta testing","beta-testing.html"],["screenshot","beta-testing.html"]])assert.ok(matches(term).includes(page),term);
});
test("Beta testing help is current and normal Help stays available",()=>{
 const guide=read("beta-testing.html"),faq=read("faq.html"),support=read("support.html");
 assert.ok(guide.includes("For accepted beta testers"));
 assert.ok(guide.includes("eight short tasks")&&guide.includes("dark header"));
 assert.ok(guide.includes("3 MB")&&guide.includes("Send Report to Support"));
 assert.ok(guide.includes("not a Zoho Desk ticket number")&&guide.includes("manual completion review"));
 assert.ok(faq.includes("Accepted beta testers are exempt"));
 assert.ok(support.includes('href="beta-testing.html"'));
 assert.ok(!read("getting-started.html").includes("Beta access is required"));
});
test("Appearance, Practice, Plan and Search facts remain accurate",()=>{
 const appearance=read("appearance.html"),practice=read("practice-workspace.html"),faq=read("faq.html"),search=read("search.html");
 for(const theme of ["Current Appearance","Midnight &amp; Gold","Teal &amp; Copper","Slate &amp; Evergreen","Indigo &amp; Coral","Ocean &amp; Sand","Plum &amp; Orchid","Graphite &amp; Citrus"])assert.ok(appearance.includes(theme),theme);
 assert.ok(appearance.includes("No theme has been certified"));
 assert.ok(practice.includes("Business Profile &amp; Practice"));
 assert.ok(practice.includes('data-app-target="/settings?section=business&amp;focus=reset-practice"'));
 assert.ok(practice.includes("real Business or Blank Practice"));
 assert.ok(faq.includes("10 catalog items, 5 saved customers, 10 completed sales per calendar month and 1 craft-show event per calendar month"));
 assert.ok(faq.includes("Existing Free accounts retain their existing access"));
 assert.ok(faq.includes("21-day Starter trial without a credit card"));
 assert.ok(faq.includes("$2.95/month only after you explicitly subscribe"));
 assert.ok(faq.includes("no annual Starter plan or automatic trial charge"));
 assert.ok(faq.includes("Registration is temporarily unavailable"));
 const onboarding=read("getting-started.html");
 for(const phrase of ["first and last name","Terms of Service and Privacy Policy","Submit Registration","a red notice explains why registration is unavailable and the button is disabled","verify your email address"])assert.ok(onboarding.includes(phrase),phrase);
 assert.ok(faq.includes("Full Restore replaces that Business"));
 assert.ok(search.includes("Settings &amp; features")&&search.includes("Reset Sample Practice"));
});
test("What’s New retains current release discovery without old development history",()=>{
 const s=read("whats-new.html");
 assert.ok(s.includes('id="latest"'));
 assert.ok(s.includes('id="nov-16-2026-search-themes-help"'));
 assert.ok(s.includes("eight"));
 assert.ok(s.includes("iPhone Safari"));
 assert.ok(s.length<10000);
 assert.ok(s.includes('id="nov-26-2026-beta-testing"'));
 assert.ok(s.includes("November 26 — Beta testing"));
});

test("Help Overview starts with task-based choices before the full directory",()=>{
 const i=read("index.html");
 const start=i.indexOf('class="help-featured"');
 const directory=i.indexOf('id="help-cards"');
 assert.ok(start>=0&&directory>start,"Start choices must precede the directory");
 const links=[
  ['href="getting-started.html"','I\'m new here'],
  ['href="practice-workspace.html"','I want to practice'],
  ['href="create-sale.html"','I want to make a sale'],
  ['href="troubleshooting.html"','Something isn\'t working']
 ];
 for(const [target,text] of links)assert.ok(i.slice(start,directory).includes(target)&&i.slice(start,directory).includes(text),text);
 assert.ok(i.slice(start,directory).includes('href="beta-testing.html"'),"Accepted testers need a prominent path");
 assert.ok(i.slice(start,directory).includes('href="videos.html"'),"Video alternative remains accessible");
 assert.equal(cards.length,24,"Directory retains every help topic");
 assert.equal(new Set(cards.map(card=>card.href)).size,24,"No guide is duplicated in the directory");
});
test("Overview topic flow follows how a seller uses the app",()=>{
 const i=read("index.html");
 const groups=['id="getting-started"','id="catalog-inventory"','id="sales-payments"','id="manage-business"','id="settings-setup"','id="help-support"'];
 const positions=groups.map(id=>i.indexOf(id));
 assert.ok(positions.every(v=>v>=0)&&positions.every((v,n)=>!n||v>positions[n-1]),"Groups appear in usage order");
 const catalog=i.slice(positions[1],positions[2]);
 assert.ok(catalog.includes('href="customers.html"')&&catalog.includes('href="catalog-add-item.html"'),"Customers and products are together before sales");
 const other=i.slice(positions[3],positions[4]);
 assert.ok(!other.includes('href="customers.html"')&&other.includes('href="events.html"')&&other.includes('href="reports.html"'),"Events and reports do not hide customer setup");
 assert.ok(i.includes('id="no-results"')&&i.includes('<a href="support.html">contact Support</a>'),"Search has a usable recovery path");
 const script=read("script.js");
 assert.ok(script.includes('noResults.hidden = !q || shown !== 0'),"Empty-state guidance appears only without matches");
 const css=read("styles.css");
 assert.ok(css.includes('.help-home .help-topic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))'),"Desktop layout groups links by task");
 assert.ok(css.includes('@media(max-width:780px)'),"Guide remains readable on a phone");
});

test("Revised Starter and Maker sales allowances are documented as pending release",()=>{const faq=read("faq.html"); assert.ok(faq.includes("20 completed sales per calendar month and 1 event per month")); assert.ok(faq.includes("35 completed sales per calendar month and 3 events per month")); assert.ok(faq.includes("pending the application release"));});
