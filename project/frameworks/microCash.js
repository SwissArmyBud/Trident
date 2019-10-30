/* MIT https://github.com/kenwheeler/cash */
(function(){
'use strict';var e=document,h=window,k=e.createElement("div"),l=Array.prototype,m=l.filter,p=l.indexOf,r=l.push,t=l.reverse,u=l.slice,w=l.some,aa=l.splice,ba=/^#[\w-]*$/,ca=/^\.[\w-]*$/,da=/<.+>/,ea=/^\w+$/;function x(a,b){void 0===b&&(b=e);return b&&9===b.nodeType||b&&1===b.nodeType?ca.test(a)?b.getElementsByClassName(a.slice(1)):ea.test(a)?b.getElementsByTagName(a):b.querySelectorAll(a):[]}
var y=function(){function a(a,c){void 0===c&&(c=e);if(a){if(a instanceof y)return a;var b=a;if(z(a)){if(b=c instanceof y?c[0]:c,b=ba.test(a)?b.getElementById(a.slice(1)):da.test(a)?A(a):x(a,b),!b)return}else if(B(a))return this.ready(a);if(b.nodeType||b===h)b=[b];this.length=b.length;a=0;for(c=this.length;a<c;a++)this[a]=b[a]}}a.prototype.init=function(b,c){return new a(b,c)};return a}(),C=y.prototype.init;C.fn=C.prototype=y.prototype;y.prototype.length=0;y.prototype.splice=aa;
"function"===typeof Symbol&&(y.prototype[Symbol.iterator]=Array.prototype[Symbol.iterator]);y.prototype.get=function(a){return void 0===a?u.call(this):this[0>a?a+this.length:a]};y.prototype.slice=function(){return C(u.apply(this,arguments))};var fa=/-([a-z])/g;function ha(a,b){return b.toUpperCase()}function D(a){return a.replace(fa,ha)}C.camelCase=D;function E(a,b){for(var c=0,d=a.length;c<d&&!1!==b.call(a[c],c,a[c]);c++);}C.each=E;y.prototype.each=function(a){E(this,a);return this};C.guid=1;
function F(a,b){var c=a&&(a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector);return!!c&&c.call(a,b)}C.matches=F;function G(a,b,c){for(var d=[],f=0,g=a.length;f<g;f++)for(var n=a[f][b];null!=n;){d.push(n);if(!c)break;n=n[b]}return d}function B(a){return"function"===typeof a}function z(a){return"string"===typeof a}function H(a){return!isNaN(parseFloat(a))&&isFinite(a)}var I=Array.isArray;C.isWindow=function(a){return!!a&&a===a.window};C.isFunction=B;
C.isString=z;C.isNumeric=H;C.isArray=I;function J(a){return z(a)?function(b,c){return F(c,a)}:B(a)?a:a instanceof y?function(b,c){return a.is(c)}:function(b,c){return c===a}}y.prototype.filter=function(a){if(!a)return C();var b=J(a);return C(m.call(this,function(a,d){return b.call(a,d,a)}))};function K(a,b){return b&&a.length?a.filter(b):a}var ia=/\S+/g;function L(a){return z(a)?a.match(ia)||[]:[]}y.prototype.hasClass=function(a){return a&&w.call(this,function(b){return b.classList.contains(a)})};
y.prototype.toggleClass=function(a,b){var c=L(a),d=void 0!==b;return c.length?this.each(function(a,g){E(c,function(a,c){d?b?g.classList.add(c):g.classList.remove(c):g.classList.toggle(c)})}):this};y.prototype.addClass=function(a){return this.toggleClass(a,!0)};y.prototype.removeClass=function(a){return arguments.length?this.toggleClass(a,!1):this};function M(a){return 1<a.length?m.call(a,function(a,c,d){return p.call(d,a)===c}):a}C.unique=M;
y.prototype.add=function(a,b){return C(M(this.get().concat(C(a,b).get())))};function N(a,b,c){if(a&&1===a.nodeType&&b)return a=h.getComputedStyle(a,null),b?c?a.getPropertyValue(b)||void 0:a[b]:a}var O=/^--/,P={},ja=k.style,ka=["webkit","moz","ms","o"];function Q(a,b){void 0===b&&(b=O.test(a));if(b)return a;if(!P[a]){b=D(a);var c=""+b.charAt(0).toUpperCase()+b.slice(1);b=(b+" "+ka.join(c+" ")+c).split(" ");E(b,function(b,c){if(c in ja)return P[a]=c,!1})}return P[a]}C.prefixedProp=Q;
var la={animationIterationCount:!0,columnCount:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0};function ma(a,b,c){void 0===c&&(c=O.test(a));return c||la[a]||!H(b)?b:b+"px"}
y.prototype.css=function(a,b){if(z(a)){var c=O.test(a);a=Q(a,c);if(2>arguments.length)return this[0]&&N(this[0],a,c);if(!a)return this;b=ma(a,b,c);return this.each(function(d,g){g&&1===g.nodeType&&(c?g.style.setProperty(a,b):g.style[a]=b)})}for(var d in a)this.css(d,a[d]);return this};var R={};
y.prototype.toggle=function(a){return this.each(function(b,c){if(void 0!==a?a:"none"===N(c,"display")){if(c.style.display="","none"===N(c,"display")){b=c.style;c=c.tagName;if(R[c])c=R[c];else{var d=e.createElement(c);e.body.appendChild(d);var f=N(d,"display");e.body.removeChild(d);c=R[c]="none"!==f?f:"block"}b.display=c}}else c.style.display="none"})};y.prototype.hide=function(){return this.toggle(!1)};y.prototype.show=function(){return this.toggle(!0)};
function S(a,b){return!b||!w.call(b,function(b){return 0>a.indexOf(b)})}var T={focus:"focusin",blur:"focusout"},U={mouseenter:"mouseover",mouseleave:"mouseout"},na=/^(?:mouse|pointer|contextmenu|drag|drop|click|dblclick)/i;function oa(a,b,c,d,f){f.guid=f.guid||C.guid++;var g=a.__cashEvents=a.__cashEvents||{};g[b]=g[b]||[];g[b].push([c,d,f]);a.addEventListener(b,f)}function V(a){a=a.split(".");return[a[0],a.slice(1).sort()]}
function W(a,b,c,d,f){var g=a.__cashEvents=a.__cashEvents||{};if(b)g[b]&&(g[b]=g[b].filter(function(g){var n=g[0],pa=g[1];g=g[2];if(f&&g.guid!==f.guid||!S(n,c)||d&&d!==pa)return!0;a.removeEventListener(b,g)}));else{for(b in g)W(a,b,c,d,f);delete a.__cashEvents}}y.prototype.off=function(a,b,c){var d=this;void 0===a?this.each(function(a,b){return W(b)}):(B(b)&&(c=b,b=""),E(L(a),function(a,g){a=V(U[g]||T[g]||g);var f=a[0],v=a[1];d.each(function(a,d){return W(d,f,v,b,c)})}));return this};
y.prototype.on=function(a,b,c,d){var f=this;if(!z(a)){for(var g in a)this.on(g,b,a[g]);return this}B(b)&&(c=b,b="");E(L(a),function(a,g){a=V(U[g]||T[g]||g);var n=a[0],v=a[1];f.each(function(a,g){a=function qa(a){if(!a.namespace||S(v,a.namespace.split("."))){var f=g;if(b){for(var q=a.target;!F(q,b);){if(q===g)return;q=q.parentNode;if(!q)return}f=q;a.__delegate=!0}a.__delegate&&Object.defineProperty(a,"currentTarget",{configurable:!0,get:function(){return f}});q=c.call(f,a,a.data);d&&W(g,n,v,b,qa);
!1===q&&(a.preventDefault(),a.stopPropagation())}};a.guid=c.guid=c.guid||C.guid++;oa(g,n,v,b,a)})});return this};y.prototype.ready=function(a){function b(){return a(C)}"loading"!==e.readyState?setTimeout(b):e.addEventListener("DOMContentLoaded",b);return this};
y.prototype.trigger=function(a,b){if(z(a)){var c=V(a);a=c[0];c=c[1];var d=na.test(a)?"MouseEvents":"HTMLEvents";var f=e.createEvent(d);f.initEvent(a,!0,!0);f.namespace=c.join(".")}else f=a;f.data=b;var g=f.type in T;return this.each(function(a,b){if(g&&B(b[f.type]))b[f.type]();else b.dispatchEvent(f)})};function X(a){return a.multiple&&a.options?G(m.call(a.options,function(a){return a.selected&&!a.disabled&&!a.parentNode.disabled}),"value"):a.value||""}
var ra=/%20/g,sa=/file|reset|submit|button|image/i,ta=/radio|checkbox/i;y.prototype.serialize=function(){var a="";this.each(function(b,c){E(c.elements||[c],function(b,c){c.disabled||!c.name||"FIELDSET"===c.tagName||sa.test(c.type)||ta.test(c.type)&&!c.checked||(b=X(c),void 0!==b&&(b=I(b)?b:[b],E(b,function(b,d){b=a;d="&"+encodeURIComponent(c.name)+"="+encodeURIComponent(d).replace(ra,"+");a=b+d})))})});return a.substr(1)};
y.prototype.val=function(a){return void 0===a?this[0]&&X(this[0]):this.each(function(b,c){if("SELECT"===c.tagName){var d=I(a)?a:null===a?[]:[a];E(c.options,function(a,b){b.selected=0<=d.indexOf(b.value)})}else c.value=null===a?"":a})};y.prototype.detach=function(){return this.each(function(a,b){b.parentNode&&b.parentNode.removeChild(b)})};var ua=/^\s*<(\w+)[^>]*>/,va=/^\s*<(\w+)\s*\/?>(?:<\/\1>)?\s*$/,Y;
function A(a){if(!Y){var b=e.createElement("table"),c=e.createElement("tr");Y={"*":k,tr:e.createElement("tbody"),td:c,th:c,thead:b,tbody:b,tfoot:b}}if(!z(a))return[];if(va.test(a))return[e.createElement(RegExp.$1)];b=ua.test(a)&&RegExp.$1;b=Y[b]||Y["*"];b.innerHTML=a;return C(b.childNodes).detach().get()}C.parseHTML=A;y.prototype.empty=function(){return this.each(function(a,b){for(;b.firstChild;)b.removeChild(b.firstChild)})};
function Z(a,b,c){E(a,function(a,f){E(b,function(b,d){b=a?d.cloneNode(!0):d;c?f.insertBefore(b,c&&f.firstChild):f.appendChild(b)})})}y.prototype.appendTo=function(a){Z(C(a),this);return this};y.prototype.html=function(a){return void 0===a?this[0]&&this[0].innerHTML:this.each(function(b,c){c.innerHTML=a})};y.prototype.insertAfter=function(a){var b=this;C(a).each(function(a,d){var c=d.parentNode;c&&b.each(function(b,f){b=a?f.cloneNode(!0):f;c.insertBefore(b,d.nextSibling)})});return this};
y.prototype.after=function(){var a=this;E(t.apply(arguments),function(b,c){t.apply(C(c).slice()).insertAfter(a)});return this};y.prototype.insertBefore=function(a){var b=this;C(a).each(function(a,d){var c=d.parentNode;c&&b.each(function(b,f){b=a?f.cloneNode(!0):f;c.insertBefore(b,d)})});return this};y.prototype.before=function(){var a=this;E(arguments,function(b,c){C(c).insertBefore(a)});return this};y.prototype.prependTo=function(a){Z(C(a),t.apply(this.slice()),!0);return this};
y.prototype.remove=function(){return this.detach().off()};y.prototype.replaceWith=function(a){return this.before(a).remove()};y.prototype.text=function(a){return void 0===a?this[0]?this[0].textContent:"":this.each(function(b,c){c.textContent=a})};y.prototype.children=function(a){var b=[];this.each(function(a,d){r.apply(b,d.children)});return K(C(M(b)),a)};y.prototype.find=function(a){for(var b=[],c=0,d=this.length;c<d;c++){var f=x(a,this[c]);f.length&&r.apply(b,f)}return C(M(b))};
y.prototype.has=function(a){var b=z(a)?function(b,d){return!!x(a,d).length}:function(b,d){return d.contains(a)};return this.filter(b)};y.prototype.is=function(a){if(!a||!this[0])return!1;var b=J(a),c=!1;this.each(function(a,f){c=b.call(f,a,f);return!c});return c};y.prototype.next=function(a,b){return K(C(M(G(this,"nextElementSibling",b))),a)};y.prototype.not=function(a){if(!a||!this[0])return this;var b=J(a);return this.filter(function(a,d){return!b.call(d,a,d)})};
y.prototype.parent=function(a,b){void 0===b&&(b=!1);return K(C(M(G(this,"parentNode",b))),a)};y.prototype.prev=function(a,b){return K(C(M(G(this,"previousElementSibling",b))),a)};y.prototype.siblings=function(a){var b=[];this.each(function(a,d){r.apply(b,C(d).parent().children(function(a,b){return b!==d}))});return K(C(M(b)),a)};"undefined"!==typeof exports?module.exports=C:h.cash=h.$=C;
})();

// ATTRIBUTES
// @optional ./add_class.ts
// @optional ./has_class.ts
// @optional ./remove_class.ts
// @optional ./toggle_class.ts
// COLLECTION
// @optional ./add.ts
// @optional ./each.ts
// @optional ./filter.ts
// @optional ./get.ts
// @optional ./slice.ts
// CORE
// @optional ./camel_case.ts
// @optional ./each.ts
// @optional ./find.ts
// @optional ./get_compare_function.ts
// @optional ./get_split_values.ts
// @optional ./guid.ts
// @optional ./matches.ts
// @optional ./parse_html.ts
// @optional ./unique.ts
// @optional ./variables.ts
// CSS
// @optional ./css.ts
// EFFECTS
// @optional ./hide.ts
// @optional ./show.ts
// @optional ./toggle.ts
// EVENTS
// @optional ./off.ts
// @optional ./on.ts
// @optional ./ready.ts
// @optional ./trigger.ts
// FORMS
// @optional ./serialize.ts
// @optional ./val.ts
// MANIPULATION
// @optional ./after.ts
// @optional ./append_to.ts
// @optional ./before.ts
// @optional ./detach.ts
// @optional ./empty.ts
// @optional ./html.ts
// @optional ./insert_after.ts
// @optional ./insert_before.ts
// @optional ./prepend_to.ts
// @optional ./remove.ts
// @optional ./replace_with.ts
// @optional ./text.ts
// TRAVERSAL
// @optional ./children.ts
// @optional ./find.ts
// @optional ./has.ts
// @optional ./is.ts
// @optional ./next.ts
// @optional ./not.ts
// @optional ./parent.ts
// @optional ./prev.ts
// @optional ./siblings.ts
