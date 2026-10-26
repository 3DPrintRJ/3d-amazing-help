import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import test from "node:test";

const source=readFileSync(new URL("../script.js",import.meta.url),"utf8");

function createLink(href,classes=[]){
 const listeners={};
 const link={
  href, classList:{contains:cls=>classes.includes(cls)},
  hasAttribute:key=>key==="download"?false:false,
  getAttribute:key=>key==="href"?link.href:null,
  addEventListener:(type,listener)=>{listeners[type]=listener;},
  click(){const event={defaultPrevented:false,currentTarget:link,preventDefault(){this.defaultPrevented=true;}};listeners.click?.(event);return event;}
 };
 return link;
}

function run(search,extra={}){
 const location={href:"https://help.3damazing.com/events.html"+search,origin:"https://help.3damazing.com",search,assigned:[],assign(url){this.assigned.push(url);}};
 const returned=createLink("https://app.3damazing.com/events",["app-return"]);
 const article=createLink("https://help.3damazing.com/quotes.html");
 const appAction=createLink("https://help.3damazing.com/settings.html");
 const appActions=[];
 const messages=[];
 const bar={insertAdjacentElement(_where,notice){messages.push(notice.textContent);}};
 const document={
  getElementById:()=>null,
  querySelectorAll(selector){
   if(selector==="a.app-return")return [returned];
   if(selector==="[data-app-target]")return appActions;
   if(selector===".topbar nav")return [];
   if(selector==="a[href]")return [returned,article];
   return [];
  },
  querySelector:selector=>selector===".topbar"?bar:null,
  createElement(){return {id:"",className:"",textContent:"",setAttribute(){},focus(){}};},
  body:{prepend(notice){messages.push(notice.textContent);}}
 };
 const window={location,closed:0,close(){this.closed++;},opener:null};
 vm.runInNewContext(source,{window,document,URL,URLSearchParams,console});
 return {window,returned,article,messages};
}

test("browser returns in the same tab to original Event detail",()=>{
 const page=run("?help_mode=browser&app_return=%2Fevents%3Fevent%3D42");
 assert.equal(page.returned.href,"https://app.3damazing.com/events?event=42");
 assert.ok(page.returned.click().defaultPrevented);
 assert.deepEqual(page.window.location.assigned,["https://app.3damazing.com/events?event=42"]);
 assert.equal(page.window.closed,0);
});

test("internal articles preserve return route and mode",()=>{
 const page=run("?help_mode=browser&app_return=%2Fsettings%3Fsection%3Ddata&workspace=practice");
 const url=new URL(page.article.href);
 assert.equal(url.pathname,"/quotes.html");
 assert.equal(url.searchParams.get("app_return"),"/settings?section=data");
 assert.equal(url.searchParams.get("help_mode"),"browser");
 assert.equal(url.searchParams.get("workspace"),"practice");
});

test("direct Help with no opener uses safe original app fallback",()=>{
 const page=run("");
 assert.equal(page.returned.click().defaultPrevented,true);
 assert.deepEqual(page.window.location.assigned,["https://app.3damazing.com/events"]);
});

test("reject open-redirect attempts",()=>{
 const page=run("?help_mode=browser&app_return=%2F%2Fevil.example%2Fattack");
 page.returned.click();
 assert.deepEqual(page.window.location.assigned,["https://app.3damazing.com/events"]);
});

test("installed PWA Help never opens a duplicate browser copy of app",()=>{
 const page=run("?help_mode=installed");
 assert.equal(page.returned.href,"#");
 assert.ok(page.returned.click().defaultPrevented);
 assert.equal(page.window.location.assigned.length,0);
 assert.equal(page.window.closed,1);
 assert.ok(page.messages[0].includes("installed 3D Amazing"));
 assert.equal(new URL(page.article.href).searchParams.get("help_mode"),"installed");
});
