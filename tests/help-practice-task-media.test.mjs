import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const exists=p=>existsSync(new URL("../"+p,import.meta.url));
const base="https://oqcugkkojpvjpdtjoszl.supabase.co/storage/v1/object/public/help-guides/practice-20261117/";
const tasks=[
["customers.html","customers-add-video","customers-add-customer",["customers-add-form","customers-saved"]],
["products.html","inventory-receive-video","inventory-receive-stock",["inventory-receive"]],
["products.html","inventory-low-stock-video","inventory-low-stock",["inventory-low-stock-choices"]],
["quick-sale.html","quick-sale-create-video","quick-sale-create",["quick-sale-choose-product","quick-sale-paid-receipt"]],
["create-invoice.html","invoice-draft-video","invoices-draft-and-finalize",["invoices-draft-form","invoices-finalized"]],
["quotes.html","quotes-convert-video","quotes-convert-to-invoice",["quotes-conversion-warning","quotes-converted-invoice"]],
["payments.html","payments-record-video","payments-record-payment",["payments-history","payments-recorded"]],
["reports.html","reports-export-video","reports-generate-export",["reports-date-range","reports-export"]],
["events.html","events-create-video","events-create-and-manage",["events-new-event","events-updated"]],
["settings.html","settings-workspace-video","business-settings-workspace-options",["business-settings-workspace-chooser","business-settings-practice-payments"]]
];
test("all ten narrated Practice task videos are embedded in their correct Help pages",()=>{
 const library=read("videos.html");
 for(const [page,id,stem,shots] of tasks){
  const html=read(page);
  assert.ok(html.includes('id="'+id+'"'),id);
  assert.ok(html.includes(base+stem+".mp4?v=narrated1"),stem+" video missing");
  assert.ok(html.includes('media/task-'+stem+'.vtt'),stem+" caption track missing");
  assert.ok(exists("media/task-"+stem+".vtt"),stem+" caption file missing");
  const vtt=read("media/task-"+stem+".vtt");
  assert.ok(vtt.startsWith("WEBVTT\n\n"),stem+" invalid VTT header");
  assert.match(vtt,/00:00:\d\d\.\d\d\d --> 00:00:\d\d\.\d\d\d/);
  assert.ok(html.includes("<video controls playsinline preload="),stem+" native video controls missing");
  assert.ok(html.includes("Practice — Sample Data"),stem+" Practice context missing");
  assert.ok(library.includes(page+"#"+id),stem+" video library missing link");
  for(const shot of shots){
   const u=base+shot+".png";
   assert.ok(html.includes('src="'+u+'"'),shot+" screenshot missing");
   assert.ok(html.includes('href="'+u+'"'),shot+" full image link missing");
  }
 }
});
test("Practice media has explicit provenance, no anonymous upload instructions and a readable layout",()=>{
 const docs=read("HELP_CONTENT_STANDARDS.md"),css=read("styles.css");
 assert.ok(docs.includes("ChatGPT Work captured original"));
 assert.ok(docs.includes("original assets remain in Dropbox unchanged"));
 assert.ok(docs.includes("Only the media assets are public"));
 assert.ok(css.includes(".article .help-task-demo video{"));
 assert.ok(css.includes("height:auto;aspect-ratio:1362/936"));
 assert.ok(css.includes(".task-demo-figure img"));
 assert.ok(read("invoices.html").includes('href="create-invoice.html#invoice-draft-video"'));
});
