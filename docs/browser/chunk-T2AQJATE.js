import{c as x}from"./chunk-XYF5LEXT.js";import{a as L}from"./chunk-MM5QLNJM.js";import{b as S,f as D,g as I,h as R,k as O}from"./chunk-H3GX5QFY.js";import{a as b}from"./chunk-OBXDPQ3V.js";import{a as T,d as k}from"./chunk-F5OLUSX4.js";import{b as u}from"./chunk-MCRJI3T3.js";import{a as f,c as w}from"./chunk-2SLIWY4J.js";import{j as c}from"./chunk-YIRVVMYZ.js";var v='[tabindex]:not([tabindex^="-"]):not([hidden]):not([disabled]), input:not([type=hidden]):not([tabindex^="-"]):not([hidden]):not([disabled]), textarea:not([tabindex^="-"]):not([hidden]):not([disabled]), button:not([tabindex^="-"]):not([hidden]):not([disabled]), select:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable[disabled="false"]:not([tabindex^="-"]):not([hidden])',F=(e,n)=>{let t=e.querySelector(v);B(t,n??e)},P=(e,n)=>{let t=Array.from(e.querySelectorAll(v)),o=t.length>0?t[t.length-1]:null;B(o,n??e)},B=(e,n)=>{let t=e,o=e?.shadowRoot;o&&(t=o.querySelector(v)||e),t?O(t):n.focus()},E=0,G=0,g=new WeakMap,h=e=>({create(t){return M(e,t)},dismiss(t,o,i){return Y(document,t,o,e,i)},getTop(){return c(this,null,function*(){return p(document,e)})}}),le=h("ion-alert"),ce=h("ion-action-sheet");var ue=h("ion-modal");var me=h("ion-popover");var fe=e=>{typeof document<"u"&&K(document);let n=E++;e.overlayIndex=n},pe=e=>(e.hasAttribute("id")||(e.id=`ion-overlay-${++G}`),e.id),M=(e,n)=>typeof window<"u"&&typeof window.customElements<"u"?window.customElements.whenDefined(e).then(()=>{let t=document.createElement(e);return t.classList.add("overlay-hidden"),Object.assign(t,Object.assign(Object.assign({},n),{hasController:!0})),N(document).appendChild(t),new Promise(o=>S(t,o))}):Promise.resolve(),U=e=>e.classList.contains("overlay-hidden"),_=(e,n)=>{let t=e,o=e?.shadowRoot;o&&(t=o.querySelector(v)||e),t?O(t):n.focus()},W=(e,n)=>{let t=p(n,"ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover"),o=e.target;if(!t||!o||t.classList.contains(ee))return;let i=()=>{if(t===o)t.lastFocus=void 0;else if(o.tagName==="ION-TOAST")_(t.lastFocus,t);else{let a=R(t);if(!a.contains(o))return;let s=a.querySelector(".ion-overlay-wrapper");if(!s)return;if(s.contains(o)||o===a.querySelector("ion-backdrop"))t.lastFocus=o;else{let d=t.lastFocus;F(s,t),d===n.activeElement&&P(s,t),t.lastFocus=n.activeElement}}},r=()=>{if(t.contains(o))t.lastFocus=o;else if(o.tagName==="ION-TOAST")_(t.lastFocus,t);else{let a=t.lastFocus;F(t),a===n.activeElement&&P(t),t.lastFocus=n.activeElement}};t.shadowRoot?r():i()},K=e=>{E===0&&(E=1,e.addEventListener("focus",n=>{W(n,e)},!0),e.addEventListener("ionBackButton",n=>{let t=p(e);t?.backdropDismiss&&n.detail.register(k,()=>{t.dismiss(void 0,A)})}),T()||e.addEventListener("keydown",n=>{if(n.key==="Escape"){let t=p(e);t?.backdropDismiss&&t.dismiss(void 0,A)}}))},Y=(e,n,t,o,i)=>{let r=p(e,o,i);return r?r.dismiss(n,t):Promise.reject("overlay does not exist")},H=(e,n)=>(n===void 0&&(n="ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover,ion-toast"),Array.from(e.querySelectorAll(n)).filter(t=>t.overlayIndex>0)),y=(e,n)=>H(e,n).filter(t=>!U(t)),p=(e,n,t)=>{let o=y(e,n);return t===void 0?o[o.length-1]:o.find(i=>i.id===t)},q=(e=!1)=>{let t=N(document).querySelector("ion-router-outlet, ion-nav, #ion-view-container-root");t&&(e?t.setAttribute("aria-hidden","true"):t.removeAttribute("aria-hidden"))},ve=(e,n,t,o,i)=>c(void 0,null,function*(){var r,a;if(e.presented)return;q(!0),document.body.classList.add(b),X(e.el),e.presented=!0,e.willPresent.emit(),(r=e.willPresentShorthand)===null||r===void 0||r.emit();let s=w(e),d=e.enterAnimation?e.enterAnimation:f.get(n,s==="ios"?t:o);(yield V(e,d,e.el,i))&&(e.didPresent.emit(),(a=e.didPresentShorthand)===null||a===void 0||a.emit()),e.el.tagName!=="ION-TOAST"&&$(e.el),e.keyboardClose&&(document.activeElement===null||!e.el.contains(document.activeElement))&&e.el.focus(),e.el.removeAttribute("aria-hidden")}),$=e=>c(void 0,null,function*(){let n=document.activeElement;if(!n)return;let t=n?.shadowRoot;t&&(n=t.querySelector(v)||n),yield e.onDidDismiss(),(document.activeElement===null||document.activeElement===document.body)&&n.focus()}),ge=(e,n,t,o,i,r,a)=>c(void 0,null,function*(){var s,d;if(!e.presented)return!1;u!==void 0&&y(u).length===1&&(q(!1),document.body.classList.remove(b)),e.presented=!1;try{e.el.style.setProperty("pointer-events","none"),e.willDismiss.emit({data:n,role:t}),(s=e.willDismissShorthand)===null||s===void 0||s.emit({data:n,role:t});let m=w(e),C=e.leaveAnimation?e.leaveAnimation:f.get(o,m==="ios"?i:r);t!==J&&(yield V(e,C,e.el,a)),e.didDismiss.emit({data:n,role:t}),(d=e.didDismissShorthand)===null||d===void 0||d.emit({data:n,role:t}),(g.get(e)||[]).forEach(j=>j.destroy()),g.delete(e),e.el.classList.add("overlay-hidden"),e.el.style.removeProperty("pointer-events"),e.el.lastFocus!==void 0&&(e.el.lastFocus=void 0)}catch(m){console.error(m)}return e.el.remove(),Z(),!0}),N=e=>e.querySelector("ion-app")||e.body,V=(e,n,t,o)=>c(void 0,null,function*(){t.classList.remove("overlay-hidden");let i=e.el,r=n(i,o);(!e.animated||!f.getBoolean("animated",!0))&&r.duration(0),e.keyboardClose&&r.beforeAddWrite(()=>{let s=t.ownerDocument.activeElement;s?.matches("input,ion-input, ion-textarea")&&s.blur()});let a=g.get(e)||[];return g.set(e,[...a,r]),yield r.play(),!0}),he=(e,n)=>{let t,o=new Promise(i=>t=i);return z(e,n,i=>{t(i.detail)}),o},z=(e,n,t)=>{let o=i=>{I(e,n,o),t(i)};D(e,n,o)},ye=e=>e==="cancel"||e===A,Q=e=>e(),Oe=(e,n)=>{if(typeof e=="function")return f.get("_zoneGate",Q)(()=>{try{return e(n)}catch(o){throw o}})},A="backdrop",J="gesture",be=39,we=e=>{let n=!1,t,o=x(),i=(s=!1)=>{if(t&&!s)return{delegate:t,inline:n};let{el:d,hasController:l,delegate:m}=e;return n=d.parentNode!==null&&!l,t=n?m||o:m,{inline:n,delegate:t}};return{attachViewToDom:s=>c(void 0,null,function*(){let{delegate:d}=i(!0);if(d)return yield d.attachViewToDom(e.el,s);let{hasController:l}=e;if(l&&s!==void 0)throw new Error("framework delegate is missing");return null}),removeViewFromDom:()=>{let{delegate:s}=i();s&&e.el!==void 0&&s.removeViewFromDom(e.el.parentElement,e.el)}}},Ee=()=>{let e,n=()=>{e&&(e(),e=void 0)};return{addClickListener:(o,i)=>{n();let r=i!==void 0?document.getElementById(i):null;if(!r){L(`A trigger element with the ID "${i}" was not found in the DOM. The trigger element must be in the DOM when the "trigger" property is set on an overlay component.`,o);return}e=((s,d)=>{let l=()=>{d.present()};return s.addEventListener("click",l),()=>{s.removeEventListener("click",l)}})(r,o)},removeClickListener:n}},X=e=>{var n;if(u===void 0)return;let t=y(u);for(let o=t.length-1;o>=0;o--){let i=t[o],r=(n=t[o+1])!==null&&n!==void 0?n:e;(r.hasAttribute("aria-hidden")||r.tagName!=="ION-TOAST")&&i.setAttribute("aria-hidden","true")}},Z=()=>{if(u===void 0)return;let e=y(u);for(let n=e.length-1;n>=0;n--){let t=e[n];if(t.removeAttribute("aria-hidden"),t.tagName!=="ION-TOAST")break}},ee="ion-disable-focus-trap";export{F as a,P as b,le as c,ce as d,ue as e,me as f,fe as g,pe as h,p as i,ve as j,ge as k,he as l,ye as m,Oe as n,A as o,J as p,be as q,we as r,Ee as s,ee as t};
