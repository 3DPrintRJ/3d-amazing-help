import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import test from "node:test";
const read = name => readFileSync(new URL("../"+name,import.meta.url),"utf8");

test("existing articles acquire a contents navigation without rewriting records", () => {
  const script = read("script.js"), css = read("styles.css");
  assert.ok(script.includes("function enhanceHelpArticles()"));
  assert.ok(script.includes("article.querySelectorAll('h2')"));
  assert.ok(script.includes("Article contents"));
  assert.ok(script.includes("tocDetails.open"));
  assert.ok(script.includes("main.classList.contains('guide-main')"));
  assert.ok(script.includes("parameters.get('workspace') === 'practice'"));
  assert.ok(css.includes(".doc-layout{display:grid"));
  assert.ok(css.includes(".doc-toc{position:sticky"));
  assert.ok(css.includes(".doc-related{"));
  assert.ok(css.includes("@media(max-width:900px)"));
});

test("Practice banner does not use prominent remote reset action", () => {
  const script = read("script.js");
  assert.ok(script.includes("Practice workspace"));
  assert.ok(script.includes("Practice guide"));
  assert.ok(!script.includes('data-app-target="/settings?section=data&focus=reset-practice"'));
});

test("Catalog illustrations remain adjacent to correct sections and labeled accurately", () => {
  const p = read("products.html");
  for(const name of ["catalog-chooser.svg","catalog-basic.svg","catalog-costing.svg","catalog-save.svg"]){
    assert.ok(existsSync(new URL("../media/"+name,import.meta.url)));
    assert.ok(p.includes('href="media/'+name+'"'));
  }
  assert.equal((p.match(/Interface illustration \(not a screenshot\)/g)||[]).length,4);
  assert.ok(p.indexOf("catalog-chooser.svg") < p.indexOf('id="required-optional"'));
  assert.ok(p.indexOf("catalog-costing.svg") < p.indexOf('id="inventory"'));
});

test("getting started leads with steps before release and troubleshooting notes", () => {
  const s = read("getting-started.html");
  assert.ok(s.indexOf("<h2>First steps</h2>") < s.indexOf("<h2>1. Sign up or sign in</h2>"));
  assert.ok(s.indexOf("<h2>1. Sign up or sign in</h2>") < s.indexOf("<h2>More guidance and troubleshooting</h2>"));
  assert.ok(s.includes("Find Settings and features with Search"));
});

test("guide layout uses right-side article contents and protects mobile", () => {
  const css=read("styles.css");
  assert.ok(css.includes(".guide-sidebar{grid-column:2;grid-row:1"));
  assert.ok(css.includes(".guide-article{grid-column:1;grid-row:1"));
  assert.ok(css.includes(".doc-figure img{display:block;width:100%;height:auto"));
  assert.ok(css.includes(".practice-context-banner{display:flex;align-items:center"));
});
