import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync,readdirSync} from "node:fs";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path,root),"utf8");
const exists = path => existsSync(new URL(path,root));
const covered = {
  "customers.html":"guide-customer-workflow.svg",
  "create-sale.html":"guide-sale-chooser.svg",
  "dashboard.html":"guide-sale-chooser.svg",
  "quick-sale.html":"guide-quick-sale-workflow.svg",
  "create-invoice.html":"guide-invoice-workflow.svg",
  "quotes.html":"guide-quote-workflow.svg",
  "payments.html":"guide-payment-workflow.svg",
  "reports.html":"guide-report-workflow.svg",
  "events.html":"guide-event-workflow.svg",
  "practice-workspace.html":"guide-practice-workflow.svg",
  "search.html":"guide-search-workflow.svg",
  "settings.html":"guide-settings-workflow.svg",
  "products.html":"guide-inventory-workflow.svg"
};

test("major authenticated Help workflows have clearly labeled, linked visual guides", () => {
  for (const [page,image] of Object.entries(covered)) {
    const html=read(page);
    const asset="media/"+image;
    assert.ok(html.includes('src="'+asset+'"'),page+" missing "+image);
    assert.ok(html.includes('href="'+asset+'"'),page+" missing enlarge link");
    assert.ok(exists(asset),"Missing asset: "+asset);
    assert.ok(html.includes("not an application screenshot"),page+" must distinguish diagrams from screenshots");
  }
  assert.ok(read("settings.html").includes('src="media/guide-backup-workflow.svg"'));
});

test("each SVG workflow has accessible labels and safe standalone markup", () => {
  for (const image of [...new Set([...Object.values(covered),"guide-backup-workflow.svg"])]) {
    const svg=read("media/"+image);
    assert.match(svg,/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.ok(svg.includes("<title id=\"ttl\">"),image);
    assert.ok(svg.includes("<desc id=\"dsc\">"),image);
    assert.ok(svg.includes("not a screenshot"),image);
    assert.ok(!/<script\b/i.test(svg),image);
    assert.ok(!/&(?!amp;|lt;|gt;|quot;|apos;|#(?:\d+|x[a-f\d]+);)/i.test(svg),"Unescaped entity "+image);
  }
});

test("real password recovery screenshot has accurate labels and provenance", () => {
  const p=read("password-help.html"),name="media/forgot-password-20261117-chromium.webp";
  assert.ok(p.includes('src="'+name+'"'));
  assert.ok(p.includes('href="'+name+'"'));
  assert.ok(p.includes("Actual public password-recovery page"));
  for(const label of ["Forgot password?","Email password reset link","Save Password"])assert.ok(p.includes(label),label);
  const bytes=readFileSync(new URL(name,root));
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
  assert.ok(bytes.length>3000 && bytes.length<40000);
  const rules=read("HELP_CONTENT_STANDARDS.md");
  assert.ok(rules.includes(name));
  assert.ok(rules.includes("d34d75b6b985e2299d1260d225062354467d5f1e"));
});

test("all Help images have meaningful alternative text and working links",()=>{
  const pages=readdirSync(root).filter(f=>f.endsWith(".html"));
  pages.push("roadmap/index.html");
  for(const page of pages) {
    const html=read(page);
    const imgs=[...html.matchAll(/<img\b([^>]+)>/g)];
    for(const m of imgs) {
      const attrs=m[1];
      const src=attrs.match(/\bsrc="([^"]+)"/)?.[1];
      const alt=attrs.match(/\balt="([^"]+)"/)?.[1]||"";
      assert.ok(src,page+" has image without src");
      assert.ok(alt.length>32,page+" image "+src+" needs descriptive alt text");
      if(src.startsWith("media/")){
        assert.ok(exists((page.includes("/")?"roadmap/":"")+src)||exists(src),page+" missing "+src);
        assert.ok(html.includes('href="'+src+'"'),page+" must link full-size visual");
      }
    }
    assert.ok(!/\bbeta\b/i.test(html),page+" has beta-only wording");
  }
});

test("Appearance shows all eight real account-theme palettes and remains text accessible",()=>{
  const html=read("appearance.html"),css=read("styles.css");
  for(const label of ["Current Appearance","Midnight &amp; Gold","Teal &amp; Copper","Slate &amp; Evergreen","Indigo &amp; Coral","Ocean &amp; Sand","Plum &amp; Orchid","Graphite &amp; Citrus"])assert.ok(html.includes(label),label);
  for(const color of ["#172033","#D6B64C","#155C63","#A75B2C","#164B70","#9ABB35"])assert.ok(html.includes(color),color);
  assert.equal((html.match(/class="help-theme-preview"/g)||[]).length,8);
  assert.ok(css.includes(".help-theme-grid{display:grid"));
  assert.ok(css.includes("@media(max-width:720px)"));
  assert.ok(html.includes("palette samples, not screenshots"));
});

test("instructions use current source-verified key controls",()=>{
  const events=read("events.html"),reports=read("reports.html"),payments=read("payments.html");
  assert.ok(events.includes("<strong>New Event</strong>"));
  assert.ok(events.includes("<strong>Add Expense</strong>")||events.includes("Event expenses"));
  assert.ok(reports.includes("<strong>Run Report</strong>"));
  assert.ok(payments.includes("<strong>Record Payment</strong>"));
});
