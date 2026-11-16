import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import test from "node:test";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const index=read("index.html");
const cards=[...index.matchAll(/<a class="card" href="([^"]+)" data-search="([^"]+)">([\s\S]*?)<\/a>/g)]
 .map(([,href,meta,html])=>({href,haystack:(meta+" "+html.replace(/<[^>]+>/g," ")).toLowerCase()}));
const matches=q=>{const words=q.trim().toLowerCase().split(/\s+/).filter(Boolean);return cards.filter(c=>words.every(w=>c.haystack.includes(w))).map(c=>c.href);};
test("all Help card links resolve to actual pages",()=>{
 assert.ok(cards.length>=20);
 for(const card of cards){if(card.href==="roadmap/")continue;assert.ok(existsSync(new URL("../"+card.href,import.meta.url)),card.href);}
});
test("Theme, colors, Appearance and palette all find the dedicated article",()=>{
 for(const term of ["theme","themes","colors","color","appearance","palette","color blindness"]){
  assert.ok(matches(term).includes("appearance.html"),term);
 }
});
test("Help finds Catalog acquisition, Practice reset, tax and Free limits",()=>{
 assert.ok(matches("buy resell").includes("products.html"));
 assert.ok(matches("reset practice").includes("practice-workspace.html"));
 assert.ok(matches("sales tax").includes("settings.html"));
 assert.ok(matches("free limits").includes("faq.html"));
 assert.ok(matches("settings features").includes("search.html"));
});
test("Appearance article matches all eight app themes and documents access rules",()=>{
 const doc=read("appearance.html");
 for(const theme of ["Current Appearance","Midnight &amp; Gold","Teal &amp; Copper","Slate &amp; Evergreen","Indigo &amp; Coral","Ocean &amp; Sand","Plum &amp; Orchid","Graphite &amp; Citrus"])assert.ok(doc.includes(theme),theme);
 assert.ok(doc.includes("eligible approved beta/internal"));
 assert.ok(doc.includes("Sample Practice, or Blank Practice"));
 assert.ok(doc.includes("No theme has been certified"));
 assert.ok(doc.includes("Required"));
});
test("Global Search Help separates records and secure feature navigation",()=>{
 const doc=read("search.html");
 assert.ok(doc.includes("Settings &amp; features"));
 assert.ok(doc.includes("Appearance only for accounts"));
 assert.ok(doc.includes("Plan &amp; Account"));
 assert.ok(doc.includes("Reset Sample Practice"));
 assert.ok(doc.includes("business-record"));
});
test("Practice Help points to the current confirmed reset location",()=>{
 const doc=read("practice-workspace.html");
 assert.ok(doc.includes('data-app-target="/settings?section=business&focus=reset-practice"'));
 assert.ok(doc.includes("Sample Practice Customers")===false||doc.includes("can be edited"));
 assert.ok(doc.includes("250 total Catalog items"));
 assert.ok(doc.includes("real Business or Blank Practice"));
 assert.ok(!doc.includes("section=data&focus=reset-practice"));
});
test("Catalog Help covers the latest entry, costing, Category and stock rules",()=>{
 const doc=read("products.html");
 for(const phrase of ["Buy &amp; Resell","Handmade Products","3D Printing","Type is not Category","Choose or create category","Required","Optional","Save Item","Receive","Assembly"])assert.ok(doc.includes(phrase),phrase);
 assert.ok(!doc.includes("One simple Catalog editor — all seven item types"));
});
test("Settings and FAQ are corrected for current appearance, Practice and Free plan",()=>{
 const settings=read("settings.html"),faq=read("faq.html");
 assert.ok(settings.includes("appearance.html"));
 assert.ok(settings.includes("Reset Sample Practice"));
 assert.ok(!settings.includes("Business Info → Current area"));
 assert.ok(faq.includes("2 Customers, 10 Catalog products and 10 completed sales total"));
 assert.ok(faq.includes("Full Restore replaces that Business"));
 assert.ok(!faq.includes("business with no existing records"));
});
test("Whats New describes the current release without claiming hands-on phone acceptance",()=>{
 const news=read("whats-new.html");
 assert.ok(news.includes("nov-16-2026-search-themes-help"));
 assert.ok(news.includes("eight"));
 assert.ok(news.includes("not replace iPhone Safari"));
 assert.ok(news.includes('id="latest"'));
});
