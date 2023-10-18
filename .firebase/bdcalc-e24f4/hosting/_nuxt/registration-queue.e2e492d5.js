import{g as y,r as b,h as N,c as u,_ as S,i as F,j as T,w as E,o as d,a as e,k as I,v as R,l as w,F as k,m as C,n as A,b as _,q as v,t as g}from"./entry.bf9a7952.js";const D=y({name:"ClientOnly",inheritAttrs:!1,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(t,{slots:n,attrs:l}){const a=b(!1);return N(()=>{a.value=!0}),o=>{var i;if(a.value)return(i=n.default)==null?void 0:i.call(n);const s=n.fallback||n.placeholder;if(s)return s();const r=o.fallback||o.placeholder||"",c=o.fallbackTag||o.placeholderTag||"span";return u(c,l,r)}}});/*! js-cookie v3.0.5 | MIT */function p(t){for(var n=1;n<arguments.length;n++){var l=arguments[n];for(var a in l)t[a]=l[a]}return t}var U={read:function(t){return t[0]==='"'&&(t=t.slice(1,-1)),t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(t){return encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};function x(t,n){function l(o,s,r){if(!(typeof document>"u")){r=p({},n,r),typeof r.expires=="number"&&(r.expires=new Date(Date.now()+r.expires*864e5)),r.expires&&(r.expires=r.expires.toUTCString()),o=encodeURIComponent(o).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var i in r)r[i]&&(c+="; "+i,r[i]!==!0&&(c+="="+r[i].split(";")[0]));return document.cookie=o+"="+t.write(s,o)+c}}function a(o){if(!(typeof document>"u"||arguments.length&&!o)){for(var s=document.cookie?document.cookie.split("; "):[],r={},c=0;c<s.length;c++){var i=s[c].split("="),f=i.slice(1).join("=");try{var m=decodeURIComponent(i[0]);if(r[m]=t.read(f,m),o===m)break}catch{}}return o?r[o]:r}}return Object.create({set:l,get:a,remove:function(o,s){l(o,"",p({},s,{expires:-1}))},withAttributes:function(o){return x(this.converter,p({},this.attributes,o))},withConverter:function(o){return x(p({},this.converter,o),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(t)}})}var h=x(U,{path:"/"});const B={data(){return{connection:null,registrationQueue:[],centralMarketData:[],region:h.get("region")||"NA",notificationItemFilters:JSON.parse(h.get("notificationItemFilters")||"[]"),selectedNotificationItemIndex:null,filterItem:""}},mounted(){this.countdownInterval=setInterval(this.updateCountdown,1e3)},created(){this.fetchItems()},beforeDestroy(){clearInterval(this.countdownInterval)},methods:{fetchItems(){fetch("https://apiv2.bdolytics.com/en/"+this.region+"/market/central-market-data").then(t=>{t.json().then(n=>{this.centralMarketData=n.data})}),console.log("Starting connection to WebSocket Server"),this.connection=new WebSocket("wss://ws.bdolytics.com/websocket/registration-queue"),this.connection.onmessage=t=>{const n=JSON.parse(t.data);this.registrationQueue=n,this.updateCountdown()},this.connection.onopen=t=>{console.log("Successfully connected to the WebSocket server...");const n=JSON.stringify({region:this.region});this.connection.send(n)},this.connection.onclose=t=>{console.log("Connection to the WebSocket server was closed.")},this.connection.onerror=t=>{console.log("An error occurred while connecting to the WebSocket server.")}},getItemDataById(t){if(!Array.isArray(this.centralMarketData)||this.centralMarketData.length===0)return console.error("Central Market data is not available or empty."),"";const n=this.centralMarketData.find(l=>l.id==t);return n||(console.error("Item with id "+t+" was not found in the Central Market data."),"")},getIcon(t){return("https://cdn.bdolytics.com/img/"+this.getItemDataById(t).icon_image+".webp").toLowerCase()},getName(t){return this.getItemDataById(t).name},getSecondsFromNow(t){const a=new Date(parseInt(t*1e3))-new Date;return Math.floor(a/1e3)},updateCountdown(){this.registrationQueue.forEach(t=>{t.remainingSeconds=this.getSecondsFromNow(t.timestamp)})},getGrade(t){return parseInt(this.getItemDataById(t).grade_type)},getBorderForItem(t){switch(this.getGrade(t)){case 0:return"border-white";case 1:return"border-green-500";case 2:return"border-blue-500";case 3:return"border-yellow-500";case 4:return"border-orange-500";default:return"border-white"}},getEnhancementLevelString(t){switch(parseInt(t)){case 1:return"PRI: ";case 2:return"DUO: ";case 3:return"TRI: ";case 4:return"TET: ";case 5:return"PEN: ";case 16:return"PRI: ";case 17:return"DUO: ";case 18:return"TRI: ";case 19:return"TET: ";case 20:return"PEN: ";default:return""}},handleRegionChange(){this.region=this.region,h.set("region",this.region),this.fetchItems()},isNotificationItem(t){for(const n of this.notificationItemFilters)if(this.getItemFullName(t).toLowerCase().includes(n.name.toLowerCase())||t.item_id===n.id)return!0;return!1},getItemFullName(t){return this.getEnhancementLevelString(t.enhancement_level)+this.getName(t.item_id)},addNotificationItemFilter(t){this.notificationItemFilters.push({name:document.getElementById("enhancement-level").value+t}),h.set("notificationItemFilters",JSON.stringify(this.notificationItemFilters)),this.selectedNotificationItemIndex=null},removeSelectedItemFilter(){this.notificationItemFilters.splice(this.selectedNotificationItemIndex,1),h.set("notificationItemFilters",JSON.stringify(this.notificationItemFilters)),this.selectedNotificationItemIndex=null}}},M={class:"container mx-auto m-1 rounded-xl w-full h-full"},O=e("p",{class:"text-center surface rounded-2xl p-8"}," Check out the Registration Queue for the Central Market! ",-1),P={class:"surface mt-8 rounded-2xl flex flex-col p-4 py-8 items-center"},j={class:"flex flex-wrap items-center self-start"},J=e("p",{class:""},"Region:",-1),L=e("option",{value:"NA"},"NA",-1),W=e("option",{value:"EU"},"EU",-1),z=e("option",{value:"MENA"},"MENA",-1),Q=e("option",{value:"RU"},"RU",-1),V=e("option",{value:"SEA"},"SEA",-1),G=e("option",{value:"TH"},"TH",-1),q=e("option",{value:"JP"},"JP",-1),H=e("option",{value:"SA"},"SA",-1),K=e("option",{value:"KR"},"KR",-1),X=e("option",{value:"TW"},"TW",-1),Y=e("option",{value:"GT"},"GT",-1),Z=e("option",{value:"CEU"},"CEU",-1),$=e("option",{value:"CNA"},"CNA",-1),ee=e("option",{value:"CAS"},"CAS",-1),te=[L,W,z,Q,V,G,q,H,K,X,Y,Z,$,ee],ne=e("p",{class:"mx-2"},"Notification Items:",-1),oe={class:"flex flex-wrap gap-2"},ie=["onClick"],re={class:"m-2 text-center w-full"},se={class:"flex flex-row self-start mt-8 gap-4"},le=e("div",null,[e("label",{for:"countries",class:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"},"Enhancement level"),e("select",{id:"enhancement-level",name:"enhancement-level",class:"surface-light rounded-2xl p-2 w-full"},[e("option",{selected:"",value:""},"Any"),e("option",{value:"PRI: "},"PRI"),e("option",{value:"DUO: "},"DUO"),e("option",{value:"TRI: "},"TRI"),e("option",{value:"TET: "},"TET"),e("option",{value:"PEN: "},"PEN")])],-1),ce=e("label",{for:"name",class:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"},"Item name",-1),ae=e("p",{class:"mx-4 text-center w-full"},"Add Filter",-1),de=e("p",{class:"mx-4 text-center w-full"},"Remove Selected",-1),ue={class:"surface py-2 mt-8 rounded-2xl flex flex-row"},fe={class:"flex-1 mx-2"},he={class:"flex flex-col mt-4"},me=["src"],ge={class:"flex flex-row flex-grow"},pe={class:"flex flex-col mx-4 self-center"},_e={class:"font-bold"},ve={class:"text-gray-300"},xe={key:0,class:"flex flex-row flex-grow flex-1 justify-end self-center"},Ie={class:"w-24 text-center"},we={key:1,class:"flex flex-row flex-grow flex-1 justify-end self-center"},ke=e("p",{class:"w-8"},"-",-1),Ce=[ke];function ye(t,n,l,a,o,s){const r=F("font-awesome-icon"),c=D;return d(),T(c,null,{default:E(()=>[e("div",M,[O,e("div",P,[e("div",j,[J,I(e("select",{"onUpdate:modelValue":n[0]||(n[0]=i=>o.region=i),onChange:n[1]||(n[1]=(...i)=>s.handleRegionChange&&s.handleRegionChange(...i)),class:"mx-2 surface-light rounded-2xl p-2"},te,544),[[R,o.region]]),ne,e("div",oe,[o.selectedNotificationItemIndex>=0?(d(!0),u(k,{key:0},w(o.notificationItemFilters,(i,f)=>(d(),u("button",{key:f,onClick:m=>o.selectedNotificationItemIndex===f?o.selectedNotificationItemIndex=null:o.selectedNotificationItemIndex=f,class:v(`surface-light p-2 rounded-2xl flex flex-row hover:ring-1 ring-white items-center' ${o.selectedNotificationItemIndex===f?"ring-2":""}`)},[e("p",re,g(i.name),1)],10,ie))),128)):C("",!0)])]),e("div",se,[le,e("div",null,[ce,I(e("input",{"onUpdate:modelValue":n[2]||(n[2]=i=>o.filterItem=i),class:"surface-light rounded-2xl p-2",id:"name",placeholder:"Item name"},null,512),[[A,o.filterItem]])]),e("button",{class:"bg-green-500 p-4 rounded-2xl flex flex-row hover:ring-1 ring-white items-center",onClick:n[3]||(n[3]=i=>s.addNotificationItemFilter(o.filterItem))},[_(r,{icon:"fa-solid fa-add",size:"lg"}),ae]),o.selectedNotificationItemIndex!=null?(d(),u("button",{key:0,class:"bg-red-500 p-4 rounded-2xl flex flex-row hover:ring-1 ring-white items-center",onClick:n[4]||(n[4]=i=>s.removeSelectedItemFilter())},[_(r,{icon:"fa-solid fa-trash",size:"lg"}),de])):C("",!0)])]),e("div",ue,[e("div",fe,[e("div",he,[(d(!0),u(k,null,w(o.registrationQueue,i=>(d(),u("div",null,[e("div",{class:v(`px-4 py-2 surface-light rounded-2xl mx-2 flex flex-row items-center mb-4 ${s.isNotificationItem(i)?"border-2 border-yellow-500":""}`)},[e("img",{src:s.getIcon(i.item_id),class:v("w-12 h-12 rounded-xl "+s.getBorderForItem(i.item_id)+" border-2")},null,10,me),e("div",ge,[e("div",pe,[e("p",_e,g(s.getItemFullName(i)),1),e("p",ve,g(parseInt(i.price).toLocaleString()),1)]),i.remainingSeconds!==void 0?(d(),u("div",xe,[e("p",Ie,g(i.remainingSeconds),1),_(r,{icon:"fa-solid fa-clock",size:"lg"})])):(d(),u("div",we,Ce))])],2)]))),256))])])])])]),_:1})}const Se=S(B,[["render",ye]]);export{Se as default};
