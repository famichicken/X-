(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,33525,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},83086,e=>{"use strict";let t=(0,e.i(75254).default)("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);e.s(["Sparkles",()=>t],83086)},5766,e=>{"use strict";let t,r;var n,a=e.i(71645);let o={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,i=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,u=(e,t)=>{let r="",n="",a="";for(let o in e){let s=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+s+";":n+="f"==o[1]?u(s,o):o+"{"+u(s,"k"==o[1]?"":t)+"}":"object"==typeof s?n+=u(s,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=s&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=u.p?u.p(o,s):o+":"+s+";")}return r+(t&&a?t+"{"+a+"}":a)+n},c={},d=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+d(e[r]);return t}return e};function f(e){let t,r,n=this||{},a=e.call?e(n.p):e;return((e,t,r,n,a)=>{var o;let f=d(e),p=c[f]||(c[f]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(f));if(!c[p]){let t=f!==e?e:(e=>{let t,r,n=[{}];for(;t=s.exec(e.replace(i,""));)t[4]?n.shift():t[3]?(r=t[3].replace(l," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(l," ").trim();return n[0]})(e);c[p]=u(a?{["@keyframes "+p]:t}:t,r?"":"."+p)}let h=r&&c.g?c.g:null;return r&&(c.g=c[p]),o=c[p],h?t.data=t.data.replace(h,o):-1===t.data.indexOf(o)&&(t.data=n?o+t.data:t.data+o),p})(a.unshift?a.raw?(t=[].slice.call(arguments,1),r=n.p,a.reduce((e,n,a)=>{let o=t[a];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+n+(null==o?"":o)},"")):a.reduce((e,t)=>Object.assign(e,t&&t.call?t(n.p):t),{}):a,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o})(n.target),n.g,n.o,n.k)}f.bind({g:1});let p,h,m,g=f.bind({k:1});function y(e,t){let r=this||{};return function(){let n=arguments;function a(o,s){let i=Object.assign({},o),l=i.className||a.className;r.p=Object.assign({theme:h&&h()},i),r.o=/ *go\d+/.test(l),i.className=f.apply(r,n)+(l?" "+l:""),t&&(i.ref=s);let u=e;return e[0]&&(u=i.as||e,delete i.as),m&&u[0]&&m(i),p(u,i)}return t?t(a):a}}var v=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),w=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},x="default",E=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:n}=t;return E(e,{type:+!!e.toasts.find(e=>e.id===n.id),toast:n});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},k=[],_={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},S={},P=(e,t=x)=>{S[t]=E(S[t]||_,e),k.forEach(([e,r])=>{e===t&&r(S[t])})},j=e=>Object.keys(S).forEach(t=>P(e,t)),L=(e=x)=>t=>{P(t,e)},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,r)=>{let n,a=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||b()}))(t,e,r);return L(a.toasterId||(n=a.id,Object.keys(S).find(e=>S[e].toasts.some(e=>e.id===n))))({type:2,toast:a}),a.id},C=(e,t)=>O("blank")(e,t);C.error=O("error"),C.success=O("success"),C.loading=O("loading"),C.custom=O("custom"),C.dismiss=(e,t)=>{let r={type:3,toastId:e};t?L(t)(r):j(r)},C.dismissAll=e=>C.dismiss(void 0,e),C.remove=(e,t)=>{let r={type:4,toastId:e};t?L(t)(r):j(r)},C.removeAll=e=>C.remove(void 0,e),C.promise=(e,t,r)=>{let n=C.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?v(t.success,e):void 0;return a?C.success(a,{id:n,...r,...null==r?void 0:r.success}):C.dismiss(n),e}).catch(e=>{let a=t.error?v(t.error,e):void 0;a?C.error(a,{id:n,...r,...null==r?void 0:r.error}):C.dismiss(n)}),e};var $=1e3,R=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,N=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,U=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,A=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${N} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${U} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,M=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,I=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${M} 1s linear infinite;
`,z=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,D=g`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,F=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${D} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,H=y("div")`
  position: absolute;
`,B=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,X=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${X} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,W=({toast:e})=>{let{icon:t,type:r,iconTheme:n}=e;return void 0!==t?"string"==typeof t?a.createElement(K,null,t):t:"blank"===r?null:a.createElement(B,null,a.createElement(I,{...n}),"loading"!==r&&a.createElement(H,null,"error"===r?a.createElement(A,{...n}):a.createElement(F,{...n})))},q=y("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,V=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Z=a.memo(({toast:e,position:t,style:r,children:n})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[n,a]=w()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=a.createElement(W,{toast:e}),i=a.createElement(V,{...e.ariaProps},v(e.message,e));return a.createElement(q,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof n?n({icon:s,message:i}):a.createElement(a.Fragment,null,s,i))});n=a.createElement,u.p=void 0,p=n,h=void 0,m=void 0;var J=({id:e,className:t,style:r,onHeightUpdate:n,children:o})=>{let s=a.useCallback(t=>{if(t){let r=()=>{n(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,n]);return a.createElement("div",{ref:s,className:t,style:r},o)},Q=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,G=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:n,children:o,toasterId:s,containerStyle:i,containerClassName:l})=>{let{toasts:u,handlers:c}=((e,t="default")=>{let{toasts:r,pausedAt:n}=((e={},t=x)=>{let[r,n]=(0,a.useState)(S[t]||_),o=(0,a.useRef)(S[t]);(0,a.useEffect)(()=>(o.current!==S[t]&&n(S[t]),k.push([t,n]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let s=r.toasts.map(t=>{var r,n,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(n=e[t.type])?void 0:n.duration)||(null==e?void 0:e.duration)||T[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...r,toasts:s}})(e,t),o=(0,a.useRef)(new Map).current,s=(0,a.useCallback)((e,t=$)=>{if(o.has(e))return;let r=setTimeout(()=>{o.delete(e),i({type:4,toastId:e})},t);o.set(e,r)},[]);(0,a.useEffect)(()=>{if(n)return;let e=Date.now(),a=r.map(r=>{if(r.duration===1/0)return;let n=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(n<0){r.visible&&C.dismiss(r.id);return}return setTimeout(()=>C.dismiss(r.id,t),n)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[r,n,t]);let i=(0,a.useCallback)(L(t),[t]),l=(0,a.useCallback)(()=>{i({type:5,time:Date.now()})},[i]),u=(0,a.useCallback)((e,t)=>{i({type:1,toast:{id:e,height:t}})},[i]),c=(0,a.useCallback)(()=>{n&&i({type:6,time:Date.now()})},[n,i]),d=(0,a.useCallback)((e,t)=>{let{reverseOrder:n=!1,gutter:a=8,defaultPosition:o}=t||{},s=r.filter(t=>(t.position||o)===(e.position||o)&&t.height),i=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<i&&e.visible).length;return s.filter(e=>e.visible).slice(...n?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[r]);return(0,a.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=o.get(e.id);t&&(clearTimeout(t),o.delete(e.id))}})},[r,s]),{toasts:r,handlers:{updateHeight:u,startPause:l,endPause:c,calculateOffset:d}}})(r,s);return a.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},u.map(r=>{let s,i,l=r.position||t,u=c.calculateOffset(r,{reverseOrder:e,gutter:n,defaultPosition:t}),d=(s=l.includes("top"),i=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:w()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${u*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...i});return a.createElement(J,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?Q:"",style:d},"custom"===r.type?v(r.message,r):o?o(r):a.createElement(Z,{toast:r,position:l}))}))};e.s(["Toaster",()=>G,"default",()=>C],5766)},26732,e=>{"use strict";var t=e.i(47167),r=e.i(43476),n=e.i(71645);class a extends Error{constructor(e,t){e instanceof Error?super(void 0,{cause:{err:e,...e.cause,...t}}):"string"==typeof e?(t instanceof Error&&(t={err:t,...t.cause}),super(e,t)):super(void 0,e),this.name=this.constructor.name,this.type=this.constructor.type??"AuthError",this.kind=this.constructor.kind??"error",Error.captureStackTrace?.(this,this.constructor);const r=`https://errors.authjs.dev#${this.type.toLowerCase()}`;this.message+=`${this.message?". ":""}Read more at ${r}`}}class o extends a{}class s extends a{}async function i(e,t,r,n={}){let a=`${l(t)}/${e}`;try{let e={headers:{"Content-Type":"application/json",...n?.headers?.cookie?{cookie:n.headers.cookie}:{}}};n?.body&&(e.body=JSON.stringify(n.body),e.method="POST");let t=await fetch(a,e),r=await t.json();if(!t.ok)throw r;return r}catch(e){return r.error(new o(e.message,e)),null}}function l(e){return"u"<typeof window?`${e.baseUrlServer}${e.basePathServer}`:e.basePath}function u(){return Math.floor(Date.now()/1e3)}function c(e){let t=new URL("http://localhost:3000/api/auth");e&&!e.startsWith("http")&&(e=`https://${e}`);let r=new URL(e||t),n=("/"===r.pathname?t.pathname:r.pathname).replace(/\/$/,""),a=`${r.origin}${n}`;return{origin:r.origin,host:r.host,path:n,base:a,toString:()=>a}}let d={baseUrl:c(t.default.env.NEXTAUTH_URL??t.default.env.VERCEL_URL).origin,basePath:c(t.default.env.NEXTAUTH_URL).path,baseUrlServer:c(t.default.env.NEXTAUTH_URL_INTERNAL??t.default.env.NEXTAUTH_URL??t.default.env.VERCEL_URL).origin,basePathServer:c(t.default.env.NEXTAUTH_URL_INTERNAL??t.default.env.NEXTAUTH_URL).path,_lastSync:0,_session:void 0,_getSession:()=>{}},f=null;function p(){return"u"<typeof BroadcastChannel?{postMessage:()=>{},addEventListener:()=>{},removeEventListener:()=>{},name:"next-auth",onmessage:null,onmessageerror:null,close:()=>{},dispatchEvent:()=>!1}:new BroadcastChannel("next-auth")}function h(){return null===f&&(f=p()),f}let m={debug:console.debug,error:console.error,warn:console.warn},g=n.createContext?.(void 0);function y(e){if(!g)throw Error("React Context is unavailable in Server Components");let t=n.useContext(g),{required:r,onUnauthenticated:a}=e??{},o=r&&"unauthenticated"===t.status;return(n.useEffect(()=>{if(o){let e=`${d.basePath}/signin?${new URLSearchParams({error:"SessionRequired",callbackUrl:window.location.href})}`;a?a():window.location.href=e}},[o,a]),o)?{data:t.data,update:t.update,status:"loading"}:t}async function v(e){let t=await i("session",d,m,e);return(e?.broadcast??!0)&&p().postMessage({event:"session",data:{trigger:"getSession"}}),t}async function b(){let e=await i("csrf",d,m);return e?.csrfToken??""}async function w(){return i("providers",d,m)}async function x(e,t,r){let{callbackUrl:n,...a}=t??{},{redirect:o=!0,redirectTo:s=n??window.location.href,...i}=a,u=l(d),c=await w();if(!c){let e=`${u}/error`;window.location.href=e;return}if(!e||!c[e]){let e=`${u}/signin?${new URLSearchParams({callbackUrl:s})}`;window.location.href=e;return}let f=c[e].type;if("webauthn"===f)throw TypeError(`Provider id "${e}" refers to a WebAuthn provider.
Please use \`import { signIn } from "next-auth/webauthn"\` instead.`);let p=`${u}/${"credentials"===f?"callback":"signin"}/${e}`,h=await b(),m=await fetch(`${p}?${new URLSearchParams(r)}`,{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Auth-Return-Redirect":"1"},body:new URLSearchParams({...i,csrfToken:h,callbackUrl:s})}),g=await m.json();if(o){let e=g.url??s;window.location.href=e,e.includes("#")&&window.location.reload();return}let y=new URL(g.url).searchParams.get("error")??void 0,v=new URL(g.url).searchParams.get("code")??void 0;return m.ok&&await d._getSession({event:"storage"}),{error:y,code:v,status:m.status,ok:m.ok,url:y?null:g.url}}async function E(e){let{redirect:t=!0,redirectTo:r=e?.callbackUrl??window.location.href}=e??{},n=l(d),a=await b(),o=await fetch(`${n}/signout`,{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Auth-Return-Redirect":"1"},body:new URLSearchParams({csrfToken:a,callbackUrl:r})}),s=await o.json();if(h().postMessage({event:"session",data:{trigger:"signout"}}),t){let e=s.url??r;window.location.href=e,e.includes("#")&&window.location.reload();return}return await d._getSession({event:"storage"}),s}function k(e){if(!g)throw Error("React Context is unavailable in Server Components");let{children:t,basePath:a,refetchInterval:o,refetchWhenOffline:l}=e;a&&(d.basePath=a);let c=void 0!==e.session;d._lastSync=c?u():0;let[f,p]=n.useState(()=>(c&&(d._session=e.session),e.session)),[y,w]=n.useState(!c);n.useEffect(()=>(d._getSession=async({event:e}={})=>{try{let t="storage"===e;if(t||void 0===d._session){d._lastSync=u(),d._session=await v({broadcast:!t}),p(d._session);return}if(!e||null===d._session||u()<d._lastSync)return;d._lastSync=u(),d._session=await v(),p(d._session)}catch(e){m.error(new s(e.message,e))}finally{w(!1)}},d._getSession(),()=>{d._lastSync=0,d._session=void 0,d._getSession=()=>{}}),[]),n.useEffect(()=>{let e=()=>d._getSession({event:"storage"});return h().addEventListener("message",e),()=>h().removeEventListener("message",e)},[]),n.useEffect(()=>{let{refetchOnWindowFocus:t=!0}=e,r=()=>{t&&"visible"===document.visibilityState&&d._getSession({event:"visibilitychange"})};return document.addEventListener("visibilitychange",r,!1),()=>document.removeEventListener("visibilitychange",r,!1)},[e.refetchOnWindowFocus]);let x=function(){let[e,t]=n.useState("u">typeof navigator&&navigator.onLine),r=()=>t(!0),a=()=>t(!1);return n.useEffect(()=>(window.addEventListener("online",r),window.addEventListener("offline",a),()=>{window.removeEventListener("online",r),window.removeEventListener("offline",a)}),[]),e}(),E=!1!==l||x;n.useEffect(()=>{if(o&&E){let e=setInterval(()=>{d._session&&d._getSession({event:"poll"})},1e3*o);return()=>clearInterval(e)}},[o,E]);let k=n.useMemo(()=>({data:f,status:y?"loading":f?"authenticated":"unauthenticated",async update(e){if(y)return;w(!0);let t=await i("session",d,m,void 0===e?void 0:{body:{csrfToken:await b(),data:e}});return w(!1),t&&(p(t),h().postMessage({event:"session",data:{trigger:"getSession"}})),t}}),[f,y]);return(0,r.jsx)(g.Provider,{value:k,children:t})}e.s(["SessionProvider",()=>k,"signIn",()=>x,"signOut",()=>E,"useSession",()=>y],26732)},18566,(e,t,r)=>{t.exports=e.r(76562)},41240,e=>{"use strict";let t=(0,e.i(75254).default)("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);e.s(["Lightbulb",()=>t],41240)},90597,e=>{"use strict";let t=(0,e.i(75254).default)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);e.s(["Heart",()=>t],90597)},1661,e=>{"use strict";var t=e.i(43476),r=e.i(71645),n=e.i(26732),a=e.i(5766);function o({children:e}){return(0,r.useEffect)(()=>{"serviceWorker"in navigator&&navigator.serviceWorker.register("/X-/sw.js").catch(()=>{})},[]),(0,t.jsxs)(n.SessionProvider,{children:[e,(0,t.jsx)(a.Toaster,{position:"bottom-right",toastOptions:{duration:4e3,style:{background:"#18181b",color:"#fafafa",borderRadius:"8px",fontSize:"14px"},success:{iconTheme:{primary:"#22c55e",secondary:"#fafafa"}},error:{iconTheme:{primary:"#ef4444",secondary:"#fafafa"}}}})]})}e.s(["Providers",()=>o])},98183,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return l},searchParamsToUrlQuery:function(){return o},urlQueryToSearchParams:function(){return i}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});function o(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function s(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function i(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,s(e));else t.set(r,s(n));return t}function l(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return i},formatWithValidation:function(){return u},urlObjectKeys:function(){return l}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=e.r(90809)._(e.r(98183)),s=/https?|ftp|gopher|file/;function i(e){let{auth:t,hostname:r}=e,n=e.protocol||"",a=e.pathname||"",i=e.hash||"",l=e.query||"",u=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?u=t+e.host:r&&(u=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(u+=":"+e.port)),l&&"object"==typeof l&&(l=String(o.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||s.test(n))&&!1!==u?(u="//"+(u||""),a&&"/"!==a[0]&&(a="/"+a)):u||(u=""),i&&"#"!==i[0]&&(i="#"+i),c&&"?"!==c[0]&&(c="?"+c),a=a.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${n}${u}${a}${c}${i}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function u(e){return i(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return a}});let n=e.r(71645);function a(e,t){let r=(0,n.useRef)(null),a=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=a.current;t&&(a.current=null,t())}else e&&(r.current=o(e,n)),t&&(a.current=o(t,n))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},18967,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return y},MiddlewareNotFoundError:function(){return x},MissingStaticPage:function(){return w},NormalizeError:function(){return v},PageNotFoundError:function(){return b},SP:function(){return m},ST:function(){return g},WEB_VITALS:function(){return o},execOnce:function(){return s},getDisplayName:function(){return d},getLocationOrigin:function(){return u},getURL:function(){return c},isAbsoluteUrl:function(){return l},isResSent:function(){return f},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return p},stringifyError:function(){return E}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=["CLS","FCP","FID","INP","LCP","TTFB"];function s(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let i=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>i.test(e);function u(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function c(){let{href:e}=window.location,t=u();return e.substring(t.length)}function d(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function f(e){return e.finished||e.headersSent}function p(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&f(r))return n;if(!n)throw Object.defineProperty(Error(`"${d(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return n}let m="u">typeof performance,g=m&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class y extends Error{}class v extends Error{}class b extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class w extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class x extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function E(e){return JSON.stringify({message:e.message,stack:e.stack})}},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return o}});let n=e.r(18967),a=e.r(52817);function o(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,a.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return y},useLinkStatus:function(){return b}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=e.r(90809),s=e.r(43476),i=o._(e.r(71645)),l=e.r(95057),u=e.r(8372),c=e.r(18581),d=e.r(18967),f=e.r(5550);e.r(33525);let p=e.r(91949),h=e.r(73668),m=e.r(9396);function g(e){return"string"==typeof e?e:(0,l.formatUrl)(e)}function y(t){var r;let n,a,o,[l,y]=(0,i.useOptimistic)(p.IDLE_LINK_STATUS),b=(0,i.useRef)(null),{href:w,as:x,children:E,prefetch:k=null,passHref:_,replace:S,shallow:P,scroll:j,onClick:L,onMouseEnter:T,onTouchStart:O,legacyBehavior:C=!1,onNavigate:$,ref:R,unstable_dynamicOnHover:N,...U}=t;n=E,C&&("string"==typeof n||"number"==typeof n)&&(n=(0,s.jsx)("a",{children:n}));let A=i.default.useContext(u.AppRouterContext),M=!1!==k,I=!1!==k?null===(r=k)||"auto"===r?m.FetchStrategy.PPR:m.FetchStrategy.Full:m.FetchStrategy.PPR,{href:z,as:D}=i.default.useMemo(()=>{let e=g(w);return{href:e,as:x?g(x):e}},[w,x]);if(C){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});a=i.default.Children.only(n)}let F=C?a&&"object"==typeof a&&a.ref:R,H=i.default.useCallback(e=>(null!==A&&(b.current=(0,p.mountLinkInstance)(e,z,A,I,M,y)),()=>{b.current&&((0,p.unmountLinkForCurrentNavigation)(b.current),b.current=null),(0,p.unmountPrefetchableInstance)(e)}),[M,z,A,I,y]),B={ref:(0,c.useMergedRef)(H,F),onClick(t){C||"function"!=typeof L||L(t),C&&a.props&&"function"==typeof a.props.onClick&&a.props.onClick(t),!A||t.defaultPrevented||function(t,r,n,a,o,s,l){if("u">typeof window){let u,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((u=t.currentTarget.getAttribute("target"))&&"_self"!==u||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){o&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),l){let e=!1;if(l({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);i.default.startTransition(()=>{d(n||r,o?"replace":"push",s??!0,a.current)})}}(t,z,D,b,S,j,$)},onMouseEnter(e){C||"function"!=typeof T||T(e),C&&a.props&&"function"==typeof a.props.onMouseEnter&&a.props.onMouseEnter(e),A&&M&&(0,p.onNavigationIntent)(e.currentTarget,!0===N)},onTouchStart:function(e){C||"function"!=typeof O||O(e),C&&a.props&&"function"==typeof a.props.onTouchStart&&a.props.onTouchStart(e),A&&M&&(0,p.onNavigationIntent)(e.currentTarget,!0===N)}};return(0,d.isAbsoluteUrl)(D)?B.href=D:C&&!_&&("a"!==a.type||"href"in a.props)||(B.href=(0,f.addBasePath)(D)),o=C?i.default.cloneElement(a,B):(0,s.jsx)("a",{...U,...B,children:n}),(0,s.jsx)(v.Provider,{value:l,children:o})}e.r(84508);let v=(0,i.createContext)(p.IDLE_LINK_STATUS),b=()=>(0,i.useContext)(v);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},56850,e=>{"use strict";var t=e.i(43476),r=e.i(22016),n=e.i(18566),a=e.i(26732),o=e.i(19455),s=e.i(75157),i=e.i(75254);let l=(0,i.default)("Twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]);var u=e.i(41240),c=e.i(83086);let d=(0,i.default)("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]),f=(0,i.default)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),p=(0,i.default)("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]),h=(0,i.default)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);var m=e.i(90597);let g=[{href:"/ideas",icon:u.Lightbulb,label:"ネタ帳"},{href:"/generate",icon:c.Sparkles,label:"AI生成"},{href:"/engage",icon:m.Heart,label:"エンゲージ"},{href:"/history",icon:d,label:"履歴"},{href:"/settings",icon:f,label:"設定"}];function y(){let e=(0,n.usePathname)(),{data:i}=(0,a.useSession)();return(0,t.jsxs)("nav",{className:"flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950",children:[(0,t.jsxs)(r.default,{href:"/",className:"flex items-center gap-2",children:[(0,t.jsx)(l,{className:"h-6 w-6 text-neutral-900 dark:text-neutral-100"}),(0,t.jsx)("span",{className:"text-lg font-bold text-neutral-900 dark:text-neutral-100",children:"X Post Generator"})]}),(0,t.jsx)("div",{className:"flex items-center gap-1",children:g.map(n=>{let a=e===n.href;return(0,t.jsx)(r.default,{href:n.href,children:(0,t.jsxs)(o.Button,{variant:a?"secondary":"ghost",size:"sm",className:(0,s.cn)("gap-2",a&&"bg-neutral-100 dark:bg-neutral-800"),children:[(0,t.jsx)(n.icon,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:n.label})]})},n.href)})}),(0,t.jsx)("div",{children:i?(0,t.jsxs)(o.Button,{variant:"ghost",size:"sm",onClick:()=>(0,a.signOut)(),children:[(0,t.jsx)(h,{className:"mr-2 h-4 w-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"ログアウト"})]}):(0,t.jsxs)(o.Button,{variant:"ghost",size:"sm",onClick:()=>(0,a.signIn)("twitter"),children:[(0,t.jsx)(p,{className:"mr-2 h-4 w-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"ログイン"})]})})]})}e.s(["Nav",()=>y],56850)}]);