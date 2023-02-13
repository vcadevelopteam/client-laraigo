(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[74],{1265:function(e,n,t){"use strict";e.exports=t(1266)},1266:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a,r=t(0),c=(a=r)&&"object"==typeof a&&"default"in a?a.default:a,i=null,o=null,u=function(e,n){e.origin==n&&(window.location.search=""+e.data)},l=["className","partnerId","callback","requestedNumber","label","env","queryParameters"];n.ConnectButton=function(e){var n=e.className,t=e.partnerId,a=e.callback,s=e.requestedNumber,d=e.label,f=void 0===d?"Connect 360dialog":d,p=e.env,b=void 0===p?"prod":p,E=e.queryParameters,h=function(e,n){if(null==e)return{};var t,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n.indexOf(t=c[a])>=0||(r[t]=e[t]);return r}(e,l),A=("local"===b?"http://0.0.0.0:8082":"staging"===b&&"https://staging-admin.360dialog.io")||"rc"===b&&"https://rc-admin.360dialog.io"||"https://hub.360dialog.com",S=s?A+"/dashboard/app/"+t+"/permissions?number="+s:A+"/dashboard/app/"+t+"/permissions";if(E){var m=Object.values(E);Object.keys(E).forEach((function(e,n){S=0!==n||s?S+"&"+e+"="+m[n]:S+"?"+e+"="+m[n]}))}var j=function(e,n){n=n.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+n+"=([^&#]*)").exec(e);return null===t?"":decodeURIComponent(t[1].replace(/\+/g," "))};return r.useEffect((function(){var e=window.location.search,n=j(e,"client"),t=j(e,"channels"),r=j(e,"revoked");if(n&&t){var c={client:n,channels:t.substring(1,t.length-1).split(",")};if(r){var i=r.substring(1,r.length-1).split(",");c.revokedChannels=i}a(c)}window.opener&&(window.opener.postMessage(e),window.close())}),[]),c.createElement("button",Object.assign({className:n||"360dialog-connect-button",onClick:function(){return function(e,n,t){window.removeEventListener("message",u);var a="toolbar=no, menubar=no, width=600, height=900, top=100, left=100";null===i||i.closed?i=window.open(e,n,a):o!==e?(i=window.open(e,n,a)).focus():i.focus(),window.addEventListener("message",(function(e){return u(e,t)}),!1),o=e}(S,"connect-360dialog",window.location.origin)}},h),f)}},1442:function(e,n,t){"use strict";t.r(n),t.d(n,"ChannelAddWhatsAppOnboarding",(function(){return y}));var a=t(24),r=t.n(a),c=t(1),i=t(39),o=t(20),u=t(14),l=t(48),s=t(1265),d=t(0),f=t(781),p=t(8),b=t(169),E=t(717),h=t(51),A=t(94),S=t(44),m=t(40),j=t(46),O=t(25),g=t(122),N=t(16),C=t(706),_=t(10),v=t(2),x=Object(b.a)((function(e){return{button:{fontSize:"14px",fontWeight:500,padding:12,textTransform:"initial",width:"180px"}}})),y=function(){var e=Object(m.c)(),n=Object(g.a)().t,t=x(),a=Object(O.b)((function(e){return e.channel.successinsert})),b=Object(j.g)(),y=Object(j.h)(),I=Object(O.b)((function(e){return e.channel.channelList})),L=Object(O.b)((function(e){return e.channel.requestGetNumberList})),P=y.state,T=Object(d.useState)(!0),w=Object(o.a)(T,2),R=w[0],D=w[1],F=Object(d.useState)("#4AC959"),H=Object(o.a)(F,2),U=H[0],M=H[1],G=Object(d.useState)(null),k=Object(o.a)(G,2),z=k[0],W=k[1],q=Object(d.useState)(null),B=Object(o.a)(q,2),K=B[0],Y=B[1],V=Object(d.useState)({method:"UFN_COMMUNICATIONCHANNEL_INS",parameters:{apikey:"",chatflowenabled:!0,color:"",coloricon:"#4AC959",communicationchannelowner:"",communicationchannelsite:"",description:"",form:"",icons:"",id:0,integrationid:"",other:"",type:"",voximplantcallsupervision:!1},service:{channelid:"",partnerid:u.a.DIALOG360PARTNERID},type:"WHATSAPP"}),Z=Object(o.a)(V,2),J=Z[0],Q=Z[1],X=Object(d.useState)(!1),$=Object(o.a)(X,2),ee=$[0],ne=$[1],te=Object(d.useState)(!1),ae=Object(o.a)(te,2),re=ae[0],ce=ae[1],ie=Object(d.useState)([]),oe=Object(o.a)(ie,2),ue=oe[0],le=oe[1],se=Object(d.useState)(!1),de=Object(o.a)(se,2),fe=de[0],pe=de[1],be=Object(d.useState)(!1),Ee=Object(o.a)(be,2),he=Ee[0],Ae=Ee[1];function Se(){return(Se=Object(i.a)(r.a.mark((function n(){return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:ne(!0),pe(!0),e(Object(f.m)(J));case 3:case"end":return n.stop()}}),n)})))).apply(this,arguments)}function me(){return(me=Object(i.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:b.push(_.a.CHANNELS);case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}Object(d.useEffect)((function(){var e=new URLSearchParams(y.search);e.get("client")?W(e.get("client")||null):W(null),e.get("channels")?Y(e.get("channels")||null):Y(null)}),[]),Object(d.useEffect)((function(){if(!I.loading&&ee)if(a)e(Object(S.e)({show:!0,severity:"success",message:n(p.a.successful_register)})),e(Object(S.d)(!1)),ne(!1),pe(!1),function(){me.apply(this,arguments)}();else if(!a){var t=n(I.code||"error_unexpected_error",{module:n(p.a.property).toLocaleLowerCase()});e(Object(S.e)({show:!0,severity:"error",message:t})),e(Object(S.d)(!1)),ne(!1),pe(!1)}}),[I]),Object(d.useEffect)((function(){fe&&(e(Object(S.d)(!1)),pe(!1))}),[I]),Object(d.useEffect)((function(){he&&(L.loading||(L.data?(e(Object(S.e)({show:!0,severity:"success",message:n(p.a.success)})),e(Object(S.d)(!1)),Ae(!1),L.data?le(L.data||[]):le([])):(e(Object(S.e)({show:!0,severity:"error",message:n(L.code||"error_unexpected_error",{module:n(p.a.property).toLocaleLowerCase()})})),e(Object(S.d)(!1)),Ae(!1))))}),[L,he]),Object(d.useEffect)((function(){z&&K&&(e(Object(f.l)({partnerId:u.a.DIALOG360PARTNERID,channelList:(K||"").split("[").join("").split("]").join("").split(",")})),e(Object(S.d)(!0)),Ae(!0),le([]))}),[z,K]);return Object(v.jsxs)("div",{style:{width:"100%"},children:[Object(v.jsx)(E.a,{"aria-label":"breadcrumb",children:Object(v.jsx)(C.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),b.push(_.a.CHANNELS_ADD,P)},children:n(p.a.previoustext)},"mainview")}),Object(v.jsxs)("div",{children:[Object(v.jsxs)("div",{children:[Object(v.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"16px"},children:n(p.a.connect_yourwhatsappnumber)}),Object(v.jsx)("div",{style:{textAlign:"center",fontSize:"1.1em",color:"#969ea5",padding:"16px",marginLeft:"auto",marginRight:"auto",maxWidth:"1200px",marginBottom:"10px"},children:n(p.a.connect_yourwhatsappnumberdetail)}),Object(v.jsx)(s.ConnectButton,{callback:function(e){W(null),Y(null),e&&(e.client&&W(e.client||null),e.channels&&Y(e.channels||null))},partnerId:u.a.DIALOG360PARTNERID,style:{margin:"auto",backgroundColor:"#7721ad",color:"#fff",border:"1px solid #7721ad",borderRadius:"4px",padding:"10px",textTransform:"none",display:"flex",textAlign:"center",justifyItems:"center",alignItems:"center",justifyContent:"center",cursor:"pointer"},label:n(p.a.connect_whatsappnumber),queryParameters:{redirect_url:"".concat(window.location.origin,"/channels/:id/add/ChannelAddWhatsAppOnboarding")}})]}),Object(v.jsxs)("div",{children:[Object(v.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px"},children:n(p.a.select_whatsappnumber)}),Object(v.jsxs)("div",{className:"row-zyx",children:[Object(v.jsx)("div",{className:"col-3"}),Object(v.jsx)(l.u,{onChange:function(e){return function(e){if(e){var n=J;n.parameters.communicationchannelsite=(null===e||void 0===e?void 0:e.phone)||"",n.parameters.communicationchannelowner=(null===e||void 0===e?void 0:e.channelId)||"",n.service.channelid=(null===e||void 0===e?void 0:e.channelId)||"",Q(n),ce(!0)}else{var t=J;t.parameters.communicationchannelsite="",t.parameters.communicationchannelowner="",t.service.channelid="",Q(t),ce(!1)}}(e)},label:n(p.a.linked_whatsappnumber),className:"col-6",valueDefault:J.parameters.communicationchannelowner,data:ue,optionDesc:"phone",optionValue:"channelId"})]})]}),re&&Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"16px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:n(p.a.commchannelfinishreg)}),Object(v.jsxs)("div",{className:"row-zyx",children:[Object(v.jsx)("div",{className:"col-3"}),Object(v.jsx)(l.l,{onChange:function(e){return function(e){D(""===e);var n=J;n.parameters.description=e,Q(n)}(e)},label:n(p.a.givechannelname),className:"col-6"})]}),Object(v.jsxs)("div",{className:"row-zyx",children:[Object(v.jsx)("div",{className:"col-3"}),Object(v.jsxs)("div",{className:"col-6",children:[Object(v.jsx)(h.a,{fontWeight:500,lineHeight:"18px",fontSize:14,mb:1,color:"textPrimary",children:n(p.a.givechannelcolor)}),Object(v.jsxs)("div",{style:{display:"flex",justifyContent:"space-around",alignItems:"center"},children:[Object(v.jsx)(N.rc,{style:{fill:"".concat(U),width:"100px"}}),Object(v.jsx)(l.e,{hex:J.parameters.coloricon,onChange:function(e){Q((function(n){return Object(c.a)(Object(c.a)({},n),{},{parameters:Object(c.a)(Object(c.a)({},n.parameters),{},{coloricon:e.hex,color:e.hex})})})),M(e.hex)}})]})]})]}),Object(v.jsx)("div",{style:{paddingLeft:"80%"},children:Object(v.jsx)(A.a,{onClick:function(){!function(){Se.apply(this,arguments)}()},className:t.button,disabled:R||I.loading,variant:"contained",color:"primary",children:n(p.a.finishreg)})})]})]})]})};n.default=y},781:function(e,n,t){"use strict";t.d(n,"g",(function(){return u})),t.d(n,"m",(function(){return l})),t.d(n,"a",(function(){return s})),t.d(n,"d",(function(){return d})),t.d(n,"c",(function(){return f})),t.d(n,"n",(function(){return p})),t.d(n,"t",(function(){return b})),t.d(n,"f",(function(){return E})),t.d(n,"o",(function(){return h})),t.d(n,"h",(function(){return A})),t.d(n,"p",(function(){return S})),t.d(n,"k",(function(){return m})),t.d(n,"s",(function(){return j})),t.d(n,"j",(function(){return O})),t.d(n,"r",(function(){return g})),t.d(n,"i",(function(){return N})),t.d(n,"q",(function(){return C})),t.d(n,"u",(function(){return _})),t.d(n,"b",(function(){return v})),t.d(n,"e",(function(){return x})),t.d(n,"l",(function(){return y}));var a=t(24),r=t.n(a),c=t(39),i=t(28),o=t(30),u=function(e,n){return{callAPI:function(){return i.d.getPagelist(e,n)},types:{loading:o.a.CHANNELS,success:o.a.CHANNELS_SUCCESS,failure:o.a.CHANNELS_FAILURE},type:null}},l=function(e){return{callAPI:function(){return i.d.insertchnl(e)},types:{loading:o.a.CHANNELS,success:o.a.CHANNELS_INSERTSUCCESS,failure:o.a.CHANNELS_FAILURE},type:null}},s=function(e){return{callAPI:function(){return i.d.activateChannel(e)},types:{loading:o.a.ACTIVATECHANNEL,success:o.a.ACTIVATECHANNEL_SUCCESS,failure:o.a.ACTIVATECHANNEL_FAILURE},type:null}},d=function(e){return{callAPI:function(){return i.d.deletechnl(e)},types:{loading:o.a.CHANNELS,success:o.a.CHANNELS_INSERTSUCCESS,failure:o.a.CHANNELS_FAILURE},type:null}},f=function(e){return{callAPI:function(){return i.d.checkPaymentPlan(e)},types:{loading:o.a.CHECK_PAYMENTPLAN,success:o.a.CHECK_PAYMENTPLAN_SUCCESS,failure:o.a.CHECK_PAYMENTPLAN_FAILURE},type:null}},p=function(e){return{callAPI:function(){var n=Object(c.a)(r.a.mark((function n(){var t,a,c,o,u,l,s,d,f,p,b,E;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(t=e.service.interface.iconbutton,a=e.service.interface.iconheader,c=e.service.interface.iconbot,o=e.service.bubble.iconbubble,u="",l="",s="",d="",!t){n.next=14;break}return(f=new FormData).append("file",t,t.name),n.next=13,i.e.uploadFile(f);case 13:u=n.sent.data.url;case 14:if(!a){n.next=20;break}return(p=new FormData).append("file",a,a.name),n.next=19,i.e.uploadFile(p);case 19:l=n.sent.data.url;case 20:if(!c){n.next=26;break}return(b=new FormData).append("file",c,c.name),n.next=25,i.e.uploadFile(b);case 25:s=n.sent.data.url;case 26:if(!o){n.next=32;break}return(E=new FormData).append("file",o,o.name),n.next=31,i.e.uploadFile(E);case 31:d=n.sent.data.url;case 32:return e.service.interface.iconbutton=u,e.service.interface.iconheader=l,e.service.interface.iconbot=s,e.service.bubble.iconbubble=d,n.abrupt("return",i.d.insertchnl(e));case 37:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),types:{loading:o.a.INSERT_CHANNEL,failure:o.a.INSERT_CHANNEL_FAILURE,success:o.a.INSERT_CHANNEL_SUCCESS},type:null}},b=function(){return{type:o.a.INSERT_CHANNEL_RESET}},E=function(e,n){return{callAPI:function(){var t=Object(c.a)(r.a.mark((function t(){var a,c,o,u,l,s,d,f,p;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if("CHAZ"!==n&&"SMOOCHANDROID"!==n){t.next=35;break}if(a=e.service,c=a.interface.iconbutton,o=a.interface.iconheader,u=a.interface.iconbot,l=a.bubble.iconbubble,!c||"object"!==typeof c){t.next=12;break}return(s=new FormData).append("file",c,c.name),t.next=11,i.e.uploadFile(s);case 11:c=t.sent.data.url;case 12:if(!o||"object"!==typeof o){t.next=18;break}return(d=new FormData).append("file",o,o.name),t.next=17,i.e.uploadFile(d);case 17:o=t.sent.data.url;case 18:if(!u||"object"!==typeof u){t.next=24;break}return(f=new FormData).append("file",u,u.name),t.next=23,i.e.uploadFile(f);case 23:u=t.sent.data.url;case 24:if(!l||"object"!==typeof l){t.next=30;break}return(p=new FormData).append("file",l,l.name),t.next=29,i.e.uploadFile(p);case 29:l=t.sent.data.url;case 30:return e.service.interface.iconbutton=c,e.service.interface.iconheader=o,e.service.interface.iconbot=u,e.service.bubble.iconbubble=l,t.abrupt("return",i.d.editchnl(e));case 35:return t.abrupt("return",i.e.main(e));case 36:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),types:{loading:o.a.EDIT_CHANNEL,failure:o.a.EDIT_CHANNEL_FAILURE,success:o.a.EDIT_CHANNEL_SUCCESS},type:null}},h=function(){return{type:o.a.EDIT_CHANNEL_RESET}},A=function(e,n){return{callAPI:function(){return i.d.getPagelistSub(e,n)},types:{loading:o.a.FACEBOOK_PAGES,success:o.a.FACEBOOK_PAGES_SUCCESS,failure:o.a.FACEBOOK_PAGES_FAILURE},type:null}},S=function(){return{type:o.a.FACEBOOK_PAGES_RESET}},m=function(e,n){return{callAPI:function(){return i.d.getPagelistSub(e,n)},types:{loading:o.a.MESSENGER_PAGES,success:o.a.MESSENGER_PAGES_SUCCESS,failure:o.a.MESSENGER_PAGES_FAILURE},type:null}},j=function(){return{type:o.a.MESSENGER_PAGES_RESET}},O=function(e,n){return{callAPI:function(){return i.d.getPagelistSub(e,n)},types:{loading:o.a.INSTAGRAM_PAGES,success:o.a.INSTAGRAM_PAGES_SUCCESS,failure:o.a.INSTAGRAM_PAGES_FAILURE},type:null}},g=function(){return{type:o.a.INSTAGRAM_PAGES_RESET}},N=function(e,n){return{callAPI:function(){return i.d.getPagelistSub(e,n)},types:{loading:o.a.INSTAGRAMDM_PAGES,success:o.a.INSTAGRAMDM_PAGES_SUCCESS,failure:o.a.INSTAGRAMDM_PAGES_FAILURE},type:null}},C=function(){return{type:o.a.INSTAGRAMDM_PAGES_RESET}},_=function(e){return{callAPI:function(){return i.d.synchronizeTemplate(e)},types:{failure:o.a.SYNCHRONIZE_TEMPLATE_FAILURE,loading:o.a.SYNCHRONIZE_TEMPLATE,success:o.a.SYNCHRONIZE_TEMPLATE_SUCCESS},type:null}},v=function(e){return{callAPI:function(){return i.d.addTemplate(e)},types:{failure:o.a.ADD_TEMPLATE_FAILURE,loading:o.a.ADD_TEMPLATE,success:o.a.ADD_TEMPLATE_SUCCESS},type:null}},x=function(e){return{callAPI:function(){return i.d.deleteTemplate(e)},types:{failure:o.a.DELETE_TEMPLATE_FAILURE,loading:o.a.DELETE_TEMPLATE,success:o.a.DELETE_TEMPLATE_SUCCESS},type:null}},y=function(e){return{callAPI:function(){return i.d.getPhoneList(e)},types:{loading:o.a.PHONE_LIST,success:o.a.PHONE_LIST_SUCCESS,failure:o.a.PHONE_LIST_FAILURE},type:null}}}}]);
//# sourceMappingURL=74.e9759b84.chunk.js.map