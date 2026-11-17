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
 for(const [term,page] of [["theme","appearance.html"],["colors","appearance.html"],["buy resell","products.html"],["reset practice","practice-workspace.html"],["sales tax","settings.html"],["free limits","faq.html"],["settings features","search.html"],["sign in","password-help.html"]])assert.ok(matches(term).includes(page),term);
});
test("user-facing Help has no outdated beta-only instructions",()=>{
 const root=readdirSync(new URL("../",import.meta.url)).filter(f=>f.endsWith(".html"));
 for(const p of [...root,"roadmap/index.html"]){
  assert.ok(!/\bbeta\b/i.test(read(p)), "Outdated beta reference in "+p);
 }
});
test("Appearance, Practice, Plan and Search facts remain accurate",()=>{
 const appearance=read("appearance.html"),practice=read("practice-workspace.html"),faq=read("faq.html"),search=read("search.html");
 for(const theme of ["Current Appearance","Midnight &amp; Gold","Teal &amp; Copper","Slate &amp; Evergreen","Indigo &amp; Coral","Ocean &amp; Sand","Plum &amp; Orchid","Graphite &amp; Citrus"])assert.ok(appearance.includes(theme),theme);
 assert.ok(appearance.includes("No theme has been certified"));
 assert.ok(practice.includes("Business Profile &amp; Practice"));
 assert.ok(practice.includes('data-app-target="/settings?section=business&amp;focus=reset-practice"'));
 assert.ok(practice.includes("real Business or Blank Practice"));
 assert.ok(faq.includes("2 Customers, 10 Catalog products and 10 completed sales total"));
 assert.ok(faq.includes("Full Restore replaces that Business"));
 assert.ok(search.includes("Settings &amp; features")&&search.includes("Reset Sample Practice"));
});
test("What’s New retains current release discovery without old development history",()=>{
 const s=read("whats-new.html");
 assert.ok(s.includes('id="latest"'));
 assert.ok(s.includes('id="nov-16-2026-search-themes-help"'));
 assert.ok(s.includes("eight"));
 assert.ok(s.includes("iPhone Safari"));
 assert.ok(s.length<7000);
});
