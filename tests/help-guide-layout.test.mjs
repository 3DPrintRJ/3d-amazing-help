import assert from "node:assert/strict";
import {readFileSync,existsSync,statSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const exists=p=>existsSync(new URL("../"+p,import.meta.url));
const home=read("index.html"),guide=read("catalog-add-item.html"),password=read("password-help.html"),css=read("styles.css"),script=read("script.js");
const cards=[...home.matchAll(/<a class="card(?: [^"]*)?" href="([^"]+)" data-search="([^"]+)">/g)].map(x=>x[1]);
test("Help overview retains 23 valid topics in six groups",()=>{
 assert.equal(cards.length,23);
 assert.equal(new Set(cards).size,23);
 assert.equal((home.match(/data-topic-group/g)||[]).length,6);
 for(const p of cards) assert.ok(exists(p==="roadmap/"?"roadmap/index.html":p),p);
 assert.ok(home.includes('id="help-search"')&&home.includes('id="search-status"'));
 assert.ok(script.includes("group.hidden = !hasVisibleArticles"));
});
test("sign-in help uses a real verified screenshot of public controls",()=>{
 assert.ok(password.includes("Sign In &amp; Password Help"));
 for(const label of ["Email","Password","Sign in","Forgot password?","Email password reset link","Save Password"])assert.ok(password.includes(label),label);
 const img="media/sign-in-20261117-live-chromium.webp";
 assert.ok(password.includes('src="'+img+'"'));
 assert.ok(password.includes('href="'+img+'"'));
 assert.ok(password.includes("Actual public sign-in screen"));
 assert.ok(exists(img));
 const bytes=readFileSync(new URL("../"+img,import.meta.url));
 assert.ok(bytes.length>2000);
 assert.equal(bytes.toString("ascii",0,4),"RIFF");
 assert.equal(bytes.toString("ascii",8,12),"WEBP");
 assert.ok(read("HELP_CONTENT_STANDARDS.md").includes("d34d75b6b985e2299d1260d225062354467d5f1e"));
});
test("Catalog guide retains five actions and four accurately labeled illustrations",()=>{
 for(const id of ["before-start","step-one","step-two","step-three","step-four","step-five","other-workflows","mobile"])assert.ok(guide.includes('id="'+id+'"'),id);
 for(const phrase of ["What are you adding?","3D Printing","I print / make it","3D Printed Item","Required","Optional","Manual price","Selling price","Cost + markup","Filament / Material","Choose or create category","No category","Save Item","Receive","Use","Adjust","Buy &amp; Resell","Assembly / Gift Set"])assert.ok(guide.includes(phrase),phrase);
 const matches=[...guide.matchAll(/<img src="([^"]+)" alt="([^"]+)" loading="lazy"/g)].filter(x=>x[1].endsWith(".svg"));
 assert.equal(matches.length,8);
 for(const x of matches){assert.ok(exists(x[1]));assert.ok(x[2].length>30);assert.ok(guide.includes('href="'+x[1]+'"'));}
 assert.ok(guide.includes("cropped interface illustrations, not real app screenshots"));
 assert.ok(!guide.includes('<button class="button"'));
 assert.ok(guide.includes('data-app-target="/products"'));
 assert.ok(css.includes("grid-template-columns:minmax(0,480px) minmax(155px,190px)"));
 assert.ok(css.includes(".guide-detail-figure{max-width:450px"));
 assert.ok(css.includes("body .topbar{background:#fff"));

});
test("shared Help navigation and responsive behavior are preserved",()=>{
 assert.ok(script.includes("safeReturnAddress"));
 assert.ok(script.includes("helpMode === 'installed'"));
 assert.ok(script.includes("appReturnAddress"));
 assert.ok(css.includes(".doc-toc{position:sticky"));
 assert.ok(css.includes(".guide-article{grid-column:1;grid-row:1"));
 assert.ok(css.includes("@media(max-width:750px)"));
 assert.ok(css.includes(".help-topic-group[hidden]{display:none!important}"));
});

test("Catalog detail visuals use natural size and remain responsive",()=>{
 assert.ok(css.includes(".guide-main .guide-detail-figure img{width:auto;max-width:100%;height:auto;object-fit:contain}"));
 assert.ok(css.includes("grid-template-columns:minmax(0,570px) minmax(155px,190px)"));
 assert.ok(css.includes(".guide-main .guide-detail-figure{max-width:100%!important}"));
 assert.ok(guide.includes("styles.css?v=20261117-adaptive-details"));
});
