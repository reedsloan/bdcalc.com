import{g as b,r as y,h as N,c as u,_ as S,i as F,j as T,w as E,o as d,a as e,k as I,v as D,l as w,F as k,m as C,b as p,n as R,q as v,t as g}from"./entry.d7073b00.js";const A=b({name:"ClientOnly",inheritAttrs:!1,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(t,{slots:n,attrs:l}){const a=y(!1);return N(()=>{a.value=!0}),o=>{var i;if(a.value)return(i=n.default)==null?void 0:i.call(n);const r=n.fallback||n.placeholder;if(r)return r();const s=o.fallback||o.placeholder||"",c=o.fallbackTag||o.placeholderTag||"span";return u(c,l,s)}}});/*! js-cookie v3.0.5 | MIT */function _(t){for(var n=1;n<arguments.length;n++){var l=arguments[n];for(var a in l)t[a]=l[a]}return t}var U={read:function(t){return t[0]==='"'&&(t=t.slice(1,-1)),t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(t){return encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};function x(t,n){function l(o,r,s){if(!(typeof document>"u")){s=_({},n,s),typeof s.expires=="number"&&(s.expires=new Date(Date.now()+s.expires*864e5)),s.expires&&(s.expires=s.expires.toUTCString()),o=encodeURIComponent(o).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var i in s)s[i]&&(c+="; "+i,s[i]!==!0&&(c+="="+s[i].split(";")[0]));return document.cookie=o+"="+t.write(r,o)+c}}function a(o){if(!(typeof document>"u"||arguments.length&&!o)){for(var r=document.cookie?document.cookie.split("; "):[],s={},c=0;c<r.length;c++){var i=r[c].split("="),f=i.slice(1).join("=");try{var m=decodeURIComponent(i[0]);if(s[m]=t.read(f,m),o===m)break}catch{}}return o?s[o]:s}}return Object.create({set:l,get:a,remove:function(o,r){l(o,"",_({},r,{expires:-1}))},withAttributes:function(o){return x(this.converter,_({},this.attributes,o))},withConverter:function(o){return x(_({},this.converter,o),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(t)}})}var h=x(U,{path:"/"});const B={data(){return{connection:null,registrationQueue:[],centralMarketData:[],region:h.get("region")||"NA",notificationItemFilters:JSON.parse(h.get("notificationItemFilters")||"[]"),selectedNotificationItemIndex:null,filterItem:""}},mounted(){this.countdownInterval=setInterval(this.updateCountdown,1e3)},created(){this.fetchItems()},beforeDestroy(){clearInterval(this.countdownInterval)},methods:{fetchItems(){fetch("https://apiv2.bdolytics.com/en/"+this.region+"/market/central-market-data").then(t=>{t.json().then(n=>{this.centralMarketData=n.data})}),console.log("Starting connection to WebSocket Server"),this.connection=new WebSocket("wss://ws.bdolytics.com/websocket/registration-queue"),this.connection.onmessage=t=>{const n=JSON.parse(t.data);this.registrationQueue=n,this.updateCountdown()},this.connection.onopen=t=>{console.log("Successfully connected to the WebSocket server...");const n=JSON.stringify({region:this.region});this.connection.send(n)},this.connection.onclose=t=>{console.log("Connection to the WebSocket server was closed.")},this.connection.onerror=t=>{console.log("An error occurred while connecting to the WebSocket server.")}},getItemDataById(t){if(!Array.isArray(this.centralMarketData)||this.centralMarketData.length===0)return console.error("Central Market data is not available or empty."),"";const n=this.centralMarketData.find(l=>l.id==t);return n||(console.error("Item with id "+t+" was not found in the Central Market data."),"")},getIcon(t){return("https://cdn.bdolytics.com/img/"+this.getItemDataById(t).icon_image+".webp").toLowerCase()},getName(t){return this.getItemDataById(t).name},getSecondsFromNow(t){const a=new Date(parseInt(t*1e3))-new Date;return Math.floor(a/1e3)},updateCountdown(){this.registrationQueue.forEach(t=>{t.remainingSeconds=this.getSecondsFromNow(t.timestamp)})},getGrade(t){return parseInt(this.getItemDataById(t).grade_type)},getBorderForItem(t){switch(this.getGrade(t)){case 0:return"border-white";case 1:return"border-green-500";case 2:return"border-blue-500";case 3:return"border-yellow-500";case 4:return"border-orange-500";default:return"border-white"}},getEnhancementLevelString(t){switch(parseInt(t)){case 1:return"PRI: ";case 2:return"DUO: ";case 3:return"TRI: ";case 4:return"TET: ";case 5:return"PEN: ";case 16:return"PRI: ";case 17:return"DUO: ";case 18:return"TRI: ";case 19:return"TET: ";case 20:return"PEN: ";default:return""}},handleRegionChange(){this.region=this.region,h.set("region",this.region),this.fetchItems()},isNotificationItem(t){for(const n of this.notificationItemFilters)if(this.getItemFullName(t).toLowerCase().includes(n.name.toLowerCase())||t.item_id===n.id)return!0;return!1},getItemFullName(t){return this.getEnhancementLevelString(t.enhancement_level)+this.getName(t.item_id)},addNotificationItemFilter(t){this.notificationItemFilters.push({name:document.getElementById("enhancement-level").value+t}),h.set("notificationItemFilters",JSON.stringify(this.notificationItemFilters)),this.selectedNotificationItemIndex=null},removeSelectedItemFilter(){this.notificationItemFilters.splice(this.selectedNotificationItemIndex,1),h.set("notificationItemFilters",JSON.stringify(this.notificationItemFilters)),this.selectedNotificationItemIndex=null}}},M={class:"container mx-auto m-1 rounded-xl w-full h-full"},O={class:"surface rounded-2xl p-8 flex flex-row items-center"},P=e("label",{for:"region",class:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"},"Region",-1),j=e("option",{value:"NA"},"NA",-1),J=e("option",{value:"EU"},"EU",-1),L=e("option",{value:"MENA"},"MENA",-1),W=e("option",{value:"RU"},"RU",-1),z=e("option",{value:"SEA"},"SEA",-1),Q=e("option",{value:"TH"},"TH",-1),V=e("option",{value:"JP"},"JP",-1),G=e("option",{value:"SA"},"SA",-1),q=e("option",{value:"KR"},"KR",-1),H=e("option",{value:"TW"},"TW",-1),K=e("option",{value:"GT"},"GT",-1),X=e("option",{value:"CEU"},"CEU",-1),Y=e("option",{value:"CNA"},"CNA",-1),Z=e("option",{value:"CAS"},"CAS",-1),$=[j,J,L,W,z,Q,V,G,q,H,K,X,Y,Z],ee=e("p",{class:"text-center w-full"}," Check out the Registration Queue for the Central Market! ",-1),te={class:"surface mt-8 rounded-2xl grid grid-cols-12 p-8 py-8 items-center"},ne={class:"col-span-6 flex flex-col gap-4"},oe={class:""},ie=e("p",{class:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"}," Notification Items: ",-1),se={class:"flex flex-wrap gap-2"},re=["onClick"],le={class:"text-center w-full"},ce=e("p",{class:"mx-4 text-center w-full"},"Delete Filter",-1),ae={class:"col-span-6 flex flex-row items-end gap-4"},de=e("div",null,[e("label",{for:"countries",class:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"},"Enhancement level"),e("select",{id:"enhancement-level",name:"enhancement-level",class:"surface-light rounded-2xl p-3 w-full"},[e("option",{selected:"",value:""},"Any"),e("option",{value:"PRI: "},"PRI"),e("option",{value:"DUO: "},"DUO"),e("option",{value:"TRI: "},"TRI"),e("option",{value:"TET: "},"TET"),e("option",{value:"PEN: "},"PEN")])],-1),ue=e("label",{for:"name",class:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"},"Item name",-1),fe={class:"flex flex-col gap-2"},he=e("p",{class:"mx-4 text-center w-full"},"Add Filter",-1),me={class:"surface py-2 mt-8 rounded-2xl flex flex-row"},ge={class:"flex-1 mx-2"},_e={class:"flex flex-col mt-4"},pe=["src"],ve={class:"flex flex-row flex-grow"},xe={class:"flex flex-col mx-4 self-center"},Ie={class:"font-bold"},we={class:"text-gray-300"},ke={key:0,class:"flex flex-row flex-grow flex-1 justify-end self-center"},Ce={class:"w-24 text-center"},be={key:1,class:"flex flex-row flex-grow flex-1 justify-end self-center"},ye=e("p",{class:"w-8"},"-",-1),Ne=[ye];function Se(t,n,l,a,o,r){const s=F("font-awesome-icon"),c=A;return d(),T(c,null,{default:E(()=>[e("div",M,[e("div",O,[e("div",null,[P,I(e("select",{"onUpdate:modelValue":n[0]||(n[0]=i=>o.region=i),onChange:n[1]||(n[1]=(...i)=>r.handleRegionChange&&r.handleRegionChange(...i)),id:"region",class:"surface-light rounded-2xl p-2"},$,544),[[D,o.region]])]),ee]),e("div",te,[e("div",ne,[e("div",oe,[ie,e("div",se,[o.selectedNotificationItemIndex>=0?(d(!0),u(k,{key:0},w(o.notificationItemFilters,(i,f)=>(d(),u("button",{key:f,onClick:m=>o.selectedNotificationItemIndex===f?o.selectedNotificationItemIndex=null:o.selectedNotificationItemIndex=f,class:v(`surface-light p-3 rounded-2xl flex flex-row hover:ring-1 ring-white items-center' ${o.selectedNotificationItemIndex===f?"ring-2":""}`)},[e("p",le,g(i.name),1)],10,re))),128)):C("",!0)])]),e("div",null,[o.selectedNotificationItemIndex!=null?(d(),u("button",{key:0,class:"bg-red-500 p-3 rounded-2xl flex flex-row hover:ring-1 ring-white items-center",onClick:n[2]||(n[2]=i=>r.removeSelectedItemFilter())},[p(s,{icon:"fa-solid fa-trash",size:"lg"}),ce])):C("",!0)])]),e("div",ae,[de,e("div",null,[ue,I(e("input",{"onUpdate:modelValue":n[3]||(n[3]=i=>o.filterItem=i),class:"surface-light rounded-2xl p-3",id:"name",placeholder:"Item name"},null,512),[[R,o.filterItem]])]),e("div",fe,[e("button",{class:"bg-green-500 p-3 rounded-2xl flex flex-row hover:ring-1 ring-white items-center h-full",onClick:n[4]||(n[4]=i=>r.addNotificationItemFilter(o.filterItem))},[p(s,{icon:"fa-solid fa-add",size:"lg"}),he])])])]),e("div",me,[e("div",ge,[e("div",_e,[(d(!0),u(k,null,w(o.registrationQueue,i=>(d(),u("div",null,[e("div",{class:v(`px-4 py-2 surface-light rounded-2xl mx-2 flex flex-row items-center mb-4 ${r.isNotificationItem(i)?"border-2 border-yellow-500":""}`)},[e("img",{src:r.getIcon(i.item_id),class:v("w-12 h-12 rounded-xl "+r.getBorderForItem(i.item_id)+" border-2")},null,10,pe),e("div",ve,[e("div",xe,[e("p",Ie,g(r.getItemFullName(i)),1),e("p",we,g(parseInt(i.price).toLocaleString()),1)]),i.remainingSeconds!==void 0?(d(),u("div",ke,[e("p",Ce,g(i.remainingSeconds),1),p(s,{icon:"fa-solid fa-clock",size:"lg"})])):(d(),u("div",be,Ne))])],2)]))),256))])])])])]),_:1})}const Ee=S(B,[["render",Se]]);export{Ee as default};