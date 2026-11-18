import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("Help articles keep navigation and related links",()=>{
 const s=read("script.js"),css=read("styles.css");
 for(const phrase of ["function enhanceHelpArticles()","Article contents","tocDetails.open","main.classList.contains('guide-main')","Practice workspace","Practice guide"])assert.ok(s.includes(phrase),phrase);
 assert.ok(css.includes(".doc-layout{display:grid"));
 assert.ok(css.includes(".doc-toc{position:sticky"));
 assert.ok(css.includes(".doc-related{"));
 assert.ok(css.includes("@media(max-width:900px)"));
});
test("getting started is concise, current, and directs to sign-in guide",()=>{
 const s=read("getting-started.html");
 assert.ok(s.includes("Sign in"));
 assert.ok(s.includes('href="password-help.html"'));
 assert.ok(s.includes("Business Profile &amp; Practice"));
 assert.ok(!s.includes("invite")&&!s.includes("security acceptance"));
 assert.ok(s.length<5000);
});
test("Catalog illustrates the right actions without fabricated screenshots",()=>{
 const s=read("products.html");
 assert.ok(s.includes('href="catalog-add-item.html"'));
 assert.ok(s.includes("Type</strong>"));
 assert.ok(s.includes("Category</strong>"));
 assert.ok(s.includes("Buy &amp; Resell"));
 assert.ok(s.includes("Save Item"));
 assert.ok(s.includes("Receive"));
 assert.ok(s.includes("src=\"media/practice-method.webp\""));
 assert.ok(existsSync(new URL("../media/practice-method.webp",import.meta.url)));
});
test("Help writing stays short and avoids historical implementation notes",()=>{
 for(const [path,max] of [["getting-started.html",5000],["settings.html",5000],["payments.html",4500],["quick-sale.html",4500],["reports.html",4500],["faq.html",5000],["password-help.html",5000]]){
  const s=read(path).replace(/<section id="[^"]+" class="help-task-demo"[\s\S]*?<\/section>/g,"");
  assert.ok(s.length<max,path+": "+s.length);
 }
});
