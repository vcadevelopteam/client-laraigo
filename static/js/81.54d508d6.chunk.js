(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[81],{1482:function(e,a,t){"use strict";t.r(a);var l=t(20),c=t(0),r=t.n(c),n=t(25),i=t(40),s=t(94),o=t(48),d=t(7),u=t(169),p=t(780),v=t.n(p),m=t(122),b=t(8),f=t(205),w=t(83),j=t(44),h=t(778),O=t.n(h),x=t(46),g=t(10),y=t(2),N=Object(u.a)((function(e){return{containerDetail:{marginTop:e.spacing(2),padding:e.spacing(2),background:"#fff"},button:{padding:12,fontWeight:500,fontSize:"14px",textTransform:"initial"}}}));a.default=function(){var e,a,t,u,p,h,C,I,D,k=N(),_=Object(c.useState)(!1),q=Object(l.a)(_,2),z=q[0],P=q[1],S=Object(c.useState)(!1),V=Object(l.a)(S,2),E=V[0],L=V[1],F=Object(c.useState)(!1),M=Object(l.a)(F,2),T=M[0],R=M[1],A=Object(c.useState)(0),B=Object(l.a)(A,2),G=B[0],H=B[1],J=Object(n.b)((function(e){return e.main.execute})),U=Object(i.c)(),W=Object(m.a)().t,K=Object(x.g)(),Q=Object(n.b)((function(e){return e.main.mainData})),X=[{name:"Empieza",value:"01"},{name:"Incluye",value:"02"},{name:"M\xe1s de 1",value:"03"},{name:"No Considera",value:"04"},{name:"Termina",value:"05"}];Object(c.useEffect)((function(){return L(!0),U(Object(w.g)(Object(d.oe)())),U(Object(j.d)(!0)),function(){U(Object(w.t)())}}),[]);var Y=[{id:"view-0",name:W(b.a.configuration_plural)},{id:"view-1",name:W(b.a.securityrules)}],Z=Object(f.d)({defaultValues:{id:0,mincharacterspwd:8,maxcharacterspwd:100,specialcharacterspwd:"04",numericalcharacterspwd:"04",uppercaseletterspwd:"04",lowercaseletterspwd:"04",allowsconsecutivenumbers:!1,numequalconsecutivecharacterspwd:0,periodvaliditypwd:0,maxattemptsbeforeblocked:0,pwddifferentchangelogin:!1}}),$=Z.register,ee=Z.handleSubmit,ae=Z.setValue,te=Z.getValues,le=Z.formState.errors;r.a.useEffect((function(){$("mincharacterspwd",{validate:function(e){return!!(e&&e>0)||W(b.a.field_required)+""}}),$("maxcharacterspwd",{validate:function(e){return!!(e&&e>0)||W(b.a.field_required)+""}}),$("numequalconsecutivecharacterspwd",{validate:function(e){return!isNaN(e)&&e>=0||W(b.a.field_required)+""}}),$("specialcharacterspwd"),$("numericalcharacterspwd"),$("uppercaseletterspwd"),$("lowercaseletterspwd"),$("allowsconsecutivenumbers"),$("id"),$("periodvaliditypwd",{validate:function(e){return!isNaN(e)&&e>=0||W(b.a.field_required)+""}}),$("maxattemptsbeforeblocked",{validate:function(e){return!isNaN(e)&&e>=0||W(b.a.field_required)+""}}),$("pwddifferentchangelogin")}),[$]),Object(c.useEffect)((function(){if(z)if(J.loading||J.error){if(J.error){var e=W(J.code||"error_unexpected_error",{module:W(b.a.whitelist).toLocaleLowerCase()});U(Object(j.e)({show:!0,severity:"error",message:e})),P(!1),U(Object(j.d)(!1))}}else U(Object(j.e)({show:!0,severity:"success",message:W(b.a.successful_edit)})),U(Object(j.d)(!1))}),[J,z]),Object(c.useEffect)((function(){var e,a,t,l,c,r,n,i,s,o,d,u,p,v,m,b,f,w,h,O,x,g,y,N,C,I,D,k;E&&(Q.loading||Q.error||(ae("id",null===Q||void 0===Q||null===(e=Q.data)||void 0===e||null===(a=e[0])||void 0===a?void 0:a.securityrulesid),ae("mincharacterspwd",null===Q||void 0===Q||null===(t=Q.data)||void 0===t||null===(l=t[0])||void 0===l?void 0:l.mincharacterspwd),ae("maxcharacterspwd",null===Q||void 0===Q||null===(c=Q.data)||void 0===c||null===(r=c[0])||void 0===r?void 0:r.maxcharacterspwd),ae("specialcharacterspwd",null===Q||void 0===Q||null===(n=Q.data)||void 0===n||null===(i=n[0])||void 0===i?void 0:i.specialcharacterspwd),ae("numericalcharacterspwd",null===Q||void 0===Q||null===(s=Q.data)||void 0===s||null===(o=s[0])||void 0===o?void 0:o.numericalcharacterspwd),ae("uppercaseletterspwd",null===Q||void 0===Q||null===(d=Q.data)||void 0===d||null===(u=d[0])||void 0===u?void 0:u.uppercaseletterspwd),ae("lowercaseletterspwd",null===Q||void 0===Q||null===(p=Q.data)||void 0===p||null===(v=p[0])||void 0===v?void 0:v.lowercaseletterspwd),ae("allowsconsecutivenumbers",null===Q||void 0===Q||null===(m=Q.data)||void 0===m||null===(b=m[0])||void 0===b?void 0:b.allowsconsecutivenumbers),ae("numequalconsecutivecharacterspwd",null===Q||void 0===Q||null===(f=Q.data)||void 0===f||null===(w=f[0])||void 0===w?void 0:w.numequalconsecutivecharacterspwd),ae("periodvaliditypwd",null===Q||void 0===Q||null===(h=Q.data)||void 0===h||null===(O=h[0])||void 0===O?void 0:O.periodvaliditypwd),ae("maxattemptsbeforeblocked",null===Q||void 0===Q||null===(x=Q.data)||void 0===x||null===(g=x[0])||void 0===g?void 0:g.maxattemptsbeforeblocked),ae("pwddifferentchangelogin",null===Q||void 0===Q||null===(y=Q.data)||void 0===y||null===(N=y[0])||void 0===N?void 0:N.pwddifferentchangelogin),R(!!(null===Q||void 0===Q||null===(C=Q.data)||void 0===C||null===(I=C[0])||void 0===I?void 0:I.allowsconsecutivenumbers)),H(null===Q||void 0===Q||null===(D=Q.data)||void 0===D||null===(k=D[0])||void 0===k?void 0:k.numequalconsecutivecharacterspwd),U(Object(j.d)(!1)),L(!1)))}),[Q,E]),Object(c.useEffect)((function(){if(z)if(J.loading||J.error){if(J.error){var e=W(J.code||"error_unexpected_error",{module:W(b.a.whitelist).toLocaleLowerCase()});U(Object(j.e)({show:!0,severity:"error",message:e})),P(!1),U(Object(j.d)(!1))}}else U(Object(j.e)({show:!0,severity:"success",message:W(b.a.successful_edit)})),U(Object(j.d)(!1))}),[J,z]);var ce=ee((function(e){U(Object(j.a)({visible:!0,question:W(b.a.confirmation_save),callback:function(){U(Object(w.c)(Object(d.mh)(e))),U(Object(j.d)(!0)),P(!0)}}))}));return Object(y.jsx)("div",{style:{width:"100%"},children:Object(y.jsxs)("form",{onSubmit:ce,children:[Object(y.jsx)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:Object(y.jsx)(o.L,{breadcrumbs:Y,handleClick:function(e){"view-0"!==e||K.push(g.a.CONFIGURATION)}})}),Object(y.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(y.jsx)("div",{children:Object(y.jsx)(o.R,{title:W(b.a.securityrules)})}),Object(y.jsxs)("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[Object(y.jsx)(s.a,{variant:"contained",type:"button",color:"primary",startIcon:Object(y.jsx)(O.a,{color:"secondary"}),style:{backgroundColor:"#FB5F5F"},onClick:function(){return K.push(g.a.CONFIGURATION)},children:W(b.a.back)}),Object(y.jsx)(s.a,{className:k.button,variant:"contained",color:"primary",type:"submit",startIcon:Object(y.jsx)(v.a,{color:"secondary"}),style:{backgroundColor:"#55BD84"},children:W(b.a.save)})]})]}),Object(y.jsxs)("div",{className:k.containerDetail,children:[Object(y.jsxs)("div",{className:"row-zyx",children:[Object(y.jsx)(o.l,{label:W(b.a.mincharacterspwd),error:null===le||void 0===le||null===(e=le.mincharacterspwd)||void 0===e?void 0:e.message,onChange:function(e){return ae("mincharacterspwd",e?parseInt(e):0)},type:"number",InputProps:{inputProps:{min:0}},className:"col-6",valueDefault:te("mincharacterspwd")}),Object(y.jsx)(o.l,{label:W(b.a.maxcharacterspwd),error:null===le||void 0===le||null===(a=le.maxcharacterspwd)||void 0===a?void 0:a.message,onChange:function(e){return ae("maxcharacterspwd",e?parseInt(e):0)},type:"number",InputProps:{inputProps:{min:0}},className:"col-6",valueDefault:te("maxcharacterspwd")})]}),Object(y.jsxs)("div",{className:"row-zyx",children:[Object(y.jsx)(o.u,{label:W(b.a.specialcharacterspwd),className:"col-6",valueDefault:te("specialcharacterspwd"),onChange:function(e){return ae("specialcharacterspwd",e?e.value:"")},error:null===le||void 0===le||null===(t=le.specialcharacterspwd)||void 0===t?void 0:t.message,data:X,optionDesc:"name",optionValue:"value"}),Object(y.jsx)(o.u,{label:W(b.a.numericalcharacterspwd),className:"col-6",valueDefault:te("numericalcharacterspwd"),onChange:function(e){return ae("numericalcharacterspwd",e?e.value:"")},error:null===le||void 0===le||null===(u=le.numericalcharacterspwd)||void 0===u?void 0:u.message,data:X,optionDesc:"name",optionValue:"value"})]}),Object(y.jsxs)("div",{className:"row-zyx",children:[Object(y.jsx)(o.u,{label:W(b.a.uppercaseletterspwd),className:"col-6",valueDefault:te("uppercaseletterspwd"),onChange:function(e){return ae("uppercaseletterspwd",e?e.value:"")},error:null===le||void 0===le||null===(p=le.uppercaseletterspwd)||void 0===p?void 0:p.message,data:X,optionDesc:"name",optionValue:"value"}),Object(y.jsx)(o.u,{label:W(b.a.lowercaseletterspwd),className:"col-6",valueDefault:te("lowercaseletterspwd"),onChange:function(e){return ae("lowercaseletterspwd",e?e.value:"")},error:null===le||void 0===le||null===(h=le.lowercaseletterspwd)||void 0===h?void 0:h.message,data:X,optionDesc:"name",optionValue:"value"})]}),Object(y.jsxs)("div",{className:"row-zyx",children:[Object(y.jsx)(o.N,{label:W(b.a.allowconsecutivenumbers),className:"col-6",valueDefault:te("allowsconsecutivenumbers"),onChange:function(e){ae("allowsconsecutivenumbers",e),R(e),e||(ae("numequalconsecutivecharacterspwd",0),H(0))}}),Object(y.jsx)(o.l,{label:W(b.a.numequalconsecutivecharacterspwd),error:null===le||void 0===le||null===(C=le.numequalconsecutivecharacterspwd)||void 0===C?void 0:C.message,onChange:function(e){ae("numequalconsecutivecharacterspwd",e?parseInt(e):0),H(e?parseInt(e):0)},type:"number",InputProps:{inputProps:{min:0}},className:"col-6",disabled:!T,valueDefault:G})]}),Object(y.jsxs)("div",{className:"row-zyx",children:[Object(y.jsx)(o.l,{label:W(b.a.periodvaliditypwd),error:null===le||void 0===le||null===(I=le.periodvaliditypwd)||void 0===I?void 0:I.message,onChange:function(e){return ae("periodvaliditypwd",e?parseInt(e):0)},type:"number",InputProps:{inputProps:{min:0}},className:"col-6",valueDefault:te("periodvaliditypwd")}),Object(y.jsx)(o.l,{label:W(b.a.maxattemptsbeforeblocked),error:null===le||void 0===le||null===(D=le.maxattemptsbeforeblocked)||void 0===D?void 0:D.message,onChange:function(e){return ae("maxattemptsbeforeblocked",e?parseInt(e):0)},type:"number",InputProps:{inputProps:{min:0}},className:"col-6",valueDefault:te("maxattemptsbeforeblocked")})]}),Object(y.jsx)("div",{className:"row-zyx",children:Object(y.jsx)(o.N,{label:W(b.a.pwddifferentchangelogin),className:"col-6",valueDefault:te("pwddifferentchangelogin"),onChange:function(e){return ae("pwddifferentchangelogin",e)}})})]})]})})}},778:function(e,a,t){"use strict";var l=t(45),c=t(61);Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var r=c(t(0)),n=(0,l(t(62)).default)(r.createElement("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");a.default=n},780:function(e,a,t){"use strict";var l=t(45),c=t(61);Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var r=c(t(0)),n=(0,l(t(62)).default)(r.createElement("path",{d:"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"}),"Save");a.default=n}}]);
//# sourceMappingURL=81.54d508d6.chunk.js.map