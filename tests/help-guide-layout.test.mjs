import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import test from "node:test";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const exists=name=>existsSync(new URL("../"+name,import.meta.url));
const home=read("index.html"),guide=read("catalog-add-item.html");
const script=read("script.js"),css=read("styles.css"),rules=read("HELP_CONTENT_STANDARDS.md");
const cards=[...home.matchAll(/<a class="card(?: [^"]*)?" href="([^"]+)" data-search="([^"]+)">/g)].map(m=>({href:m[1],keywords:m[2]}));
test("home groups exactly 23 searchable articles under six clear topics",()=>{
 assert.equal(cards.length,23);
 assert.equal(new Set(cards.map(x=>x.href)).size,23);
 assert.equal((home.match(/data-topic-group/g)||[]).length,6);
 for(const name of ["Getting started","Catalog &amp; inventory","Sales &amp; payments","Run your business","Settings &amp; setup","Answers &amp; support"])assert.ok(home.includes(name),name);
 for(const c of cards){assert.ok(exists(c.href==="roadmap/"?"roadmap/index.html":c.href),c.href);assert.ok(c.keywords.length>8,c.href);}
});
test("home has prominent task-based starting points, working search and no second empty-state message",()=>{
 assert.ok(home.includes('id="help-search"'));
 assert.ok(home.includes('id="help-cards"'));
 assert.ok(home.includes('id="search-status"'));
 assert.ok(home.includes('href="catalog-add-item.html"'));
 assert.ok(home.includes('href="practice-workspace.html"'));
 assert.ok(home.includes('href="create-sale.html"'));
 assert.ok(home.includes('id="no-results"')&&home.includes('hidden>No matching Help topics'));
 assert.ok(script.includes("helpTopicGroups.forEach(group =>"));
 assert.ok(script.includes("group.hidden = !hasVisibleArticles"));
 assert.ok(script.includes("No topics found for"));
 assert.ok(script.includes("help-search-active"));
});
test("illustrated Catalog tutorial follows real required-first workflow",()=>{
 for(const anchor of ["before-start","step-one","step-two","step-three","step-four","step-five","other-workflows","mobile"])assert.ok(guide.includes('id="'+anchor+'"'),anchor);
 for(const phrase of ["What are you adding?","3D Printing","I print / make it","3D Printed Item","Item name","Selling price","Manual price","Cost + markup","Filament / Material","Choose or create category","No category","Save Item","Receive","Use","Adjust","Buy &amp; Resell","Assembly / Gift Set"])assert.ok(guide.includes(phrase),phrase);
 assert.ok(guide.includes("not screenshots of a signed-in session"));
 assert.ok(guide.includes("fictional training values"));
 assert.ok(guide.includes("separate verified iPhone screenshots"));
 assert.ok(guide.includes("no real sale"));
 assert.ok(!guide.includes("Required fields have a copper outline"));
});
test("all four illustrations have full-size links, descriptive alt and valid SVG text",()=>{
 const imgs=[...guide.matchAll(/<img src="(media\/[^"]+\.svg)" alt="([^"]+)" loading="lazy" width="(\d+)" height="(\d+)"/g)];
 assert.equal(imgs.length,4);
 assert.equal(new Set(imgs.map(x=>x[1])).size,4);
 for(const [,src,alt,w,h] of imgs){
  assert.ok(exists(src),src);
  assert.ok(alt.length>55,src);
  assert.ok(Number(w)>900&&Number(h)>600,src);
  assert.ok(guide.includes('href="'+src+'" target="_blank" rel="noopener"'),src);
  const svg=read(src);
  assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.ok(svg.endsWith("</svg>"));
  assert.ok(svg.includes('<title id="ttl">')&&svg.includes('<desc id="dsc">'));
  assert.ok(!/<script\b/i.test(svg));
  assert.ok(!/&(?!amp;|lt;|gt;|quot;|apos;|#(?:\d+|x[a-fA-F\d]+);)/.test(svg),"Unescaped entity in "+src);
 }
});
test("help navigation, accessibility and mobile layout remain functional",()=>{
 for(const p of ["search-status","help-results-heading","help-cards"])assert.ok(home.includes('id="'+p+'"'));
 assert.ok(home.includes('class="app-return"'));
 assert.ok(guide.includes('class="app-return"'));
 assert.ok(script.includes("safeReturnAddress"));
 assert.ok(script.includes("helpMode === 'installed'"));
 assert.ok(script.includes('document.querySelectorAll(\'a.app-return\')'));
 assert.ok(css.includes(".help-topic-group[hidden]{display:none!important}"));
 assert.ok(css.includes(".help-home .help-topic-link:focus-visible"));
 assert.ok(css.includes("@media(max-width:750px)"));
 assert.ok(css.includes("@media(prefers-reduced-motion:reduce)"));
 assert.ok(css.includes(".guide-figure img{width:100%;height:auto"));
});
test("related articles link to tutorial and screenshots have an explicit future acceptance rule",()=>{
 assert.ok(read("products.html").includes('href="catalog-add-item.html"'));
 assert.ok(read("getting-started.html").includes('href="catalog-add-item.html"'));
 assert.ok(rules.includes("not captured screenshots"));
 assert.ok(rules.includes("real Business customers"));
 assert.ok(rules.includes("app commit SHA"));
 assert.ok(rules.includes("iPhone"));
});
