(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[78],{1410:function(e,t,n){"use strict";n.r(t);var i=n(1),a=n(26),c=n(20),r=n(0),o=n.n(r),l=n(25),s=n(40),u=n(94),d=n(48),b=n(7),j=n(779),v=n(169),f=n(780),O=n.n(f),p=n(122),m=n(8),h=n(205),g=n(83),w=n(44),x=n(778),y=n.n(x),C=n(16),N=n(46),I=n(10),k=n(2),D=Object(v.a)((function(e){return{containerDetail:{marginTop:e.spacing(2),padding:e.spacing(2),background:"#fff"},button:{padding:12,fontWeight:500,fontSize:"14px",textTransform:"initial"}}})),E=function(e){var t,n,i=e.data,j=i.row,v=i.edit,f=e.setViewSelected,x=e.fetchData,C=e.arrayBread,N=D(),I=Object(r.useState)(!1),E=Object(c.a)(I,2),F=E[0],S=E[1],_=Object(l.b)((function(e){return e.main.execute})),T=Object(s.c)(),M=Object(p.a)().t,V=Object(h.d)({defaultValues:{type:"NINGUNO",id:v&&(null===j||void 0===j?void 0:j.inputvalidationid)||0,description:v&&(null===j||void 0===j?void 0:j.description)||"",inputvalue:(null===j||void 0===j?void 0:j.inputvalue)||"",operation:v&&j?"EDIT":"INSERT",status:"ACTIVO"}}),z=V.register,B=V.handleSubmit,R=V.setValue,A=V.formState.errors;o.a.useEffect((function(){z("type"),z("id"),z("description",{validate:function(e){return e&&e.length||M(m.a.field_required)}}),z("inputvalue",{validate:function(e){return e&&e.length||M(m.a.field_required)}})}),[v,z]),Object(r.useEffect)((function(){F&&(_.loading||_.error?_.error&&(T(Object(w.e)({show:!0,severity:"error",message:"23505: ".concat(M(m.a.inputvalidationerror))})),S(!1),T(Object(w.d)(!1))):(T(Object(w.e)({show:!0,severity:"success",message:M(j?m.a.successful_edit:m.a.successful_register)})),x&&x(),T(Object(w.d)(!1)),f("view-1")))}),[_,F]);var L=B((function(e){T(Object(w.a)({visible:!0,question:M(m.a.confirmation_save),callback:function(){T(Object(g.c)(Object(b.Cf)(e))),T(Object(w.d)(!0)),S(!0)}}))}));return Object(k.jsx)("div",{style:{width:"100%"},children:Object(k.jsxs)("form",{onSubmit:L,children:[Object(k.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(k.jsxs)("div",{children:[Object(k.jsx)(d.L,{breadcrumbs:[].concat(Object(a.a)(C),[{id:"view-2",name:"".concat(M(m.a.inputvalidation)," ").concat(M(m.a.detail))}]),handleClick:f}),Object(k.jsx)(d.R,{title:v&&j?"".concat(j.description):M(m.a.newinputvalidation)})]}),Object(k.jsxs)("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[Object(k.jsx)(u.a,{variant:"contained",type:"button",color:"primary",startIcon:Object(k.jsx)(y.a,{color:"secondary"}),style:{backgroundColor:"#FB5F5F"},onClick:function(){return f("view-1")},children:M(m.a.back)}),Object(k.jsx)(u.a,{className:N.button,variant:"contained",color:"primary",type:"submit",startIcon:Object(k.jsx)(O.a,{color:"secondary"}),style:{backgroundColor:"#55BD84"},children:M(m.a.save)})]})]}),Object(k.jsx)("div",{className:N.containerDetail,children:Object(k.jsxs)("div",{className:"row-zyx",children:[Object(k.jsx)(d.l,{label:M(m.a.description),className:"col-6",onChange:function(e){return R("description",e)},valueDefault:v&&(null===j||void 0===j?void 0:j.description)||"",error:null===A||void 0===A||null===(t=A.description)||void 0===t?void 0:t.message}),Object(k.jsx)(d.l,{label:M(m.a.value),className:"col-6",onChange:function(e){return R("inputvalue",e)},valueDefault:(null===j||void 0===j?void 0:j.inputvalue)||"",error:null===A||void 0===A||null===(n=A.inputvalue)||void 0===n?void 0:n.message})]})})]})})};t.default=function(){var e=Object(N.g)(),t=Object(s.c)(),n=Object(p.a)().t,a=Object(l.b)((function(e){return e.main})),v=Object(l.b)((function(e){return e.main.execute})),f=Object(r.useState)("view-1"),O=Object(c.a)(f,2),h=O[0],x=O[1],D=Object(r.useState)({row:null,edit:!1}),F=Object(c.a)(D,2),S=F[0],_=F[1],T=Object(r.useState)(!1),M=Object(c.a)(T,2),V=M[0],z=M[1],B=[{id:"view-0",name:n(m.a.configuration_plural)},{id:"view-1",name:n(m.a.inputvalidation)}];function R(t){"view-0"!==t?x(t):e.push(I.a.CONFIGURATION)}var A=o.a.useMemo((function(){return[{accessor:"inputvalidationid",NoFilter:!0,isComponent:!0,minWidth:60,width:"1%",Cell:function(e){var t=e.cell.row.original;return Object(k.jsx)(d.M,{extraOption:n(m.a.duplicate),deleteFunction:function(){return H(t)},editFunction:function(){return G(t)},extraFunction:function(){return q(t)},ExtraICon:function(){return Object(k.jsx)(C.G,{width:28,style:{fill:"#7721AD"}})}})}},{Header:n(m.a.description),accessor:"description",NoFilter:!0,width:"25%"},{Header:n(m.a.value),accessor:"inputvalue",NoFilter:!0}]}),[n]),L=function(){return t(Object(g.g)(Object(b.Yc)(0)))};Object(r.useEffect)((function(){return L(),function(){t(Object(g.t)())}}),[]),Object(r.useEffect)((function(){V&&(v.loading||v.error?v.error&&(t(Object(w.e)({show:!0,severity:"error",message:"23505: ".concat(n(m.a.inputvalidationerror))})),t(Object(w.d)(!1)),z(!1)):(t(Object(w.e)({show:!0,severity:"success",message:n(m.a.successful_delete)})),L(),t(Object(w.d)(!1)),z(!1)))}),[v,V]);var q=function(e){x("view-2"),_({row:e,edit:!1})},G=function(e){x("view-2"),_({row:e,edit:!0})},H=function(e){t(Object(w.a)({visible:!0,question:n(m.a.confirmation_delete),callback:function(){t(Object(g.c)(Object(b.Cf)(Object(i.a)(Object(i.a)({},e),{},{operation:"DELETE",status:"ELIMINADO",id:e.inputvalidationid})))),t(Object(w.d)(!0)),z(!0)}}))};return"view-1"===h?Object(k.jsxs)("div",{style:{width:"100%"},children:[Object(k.jsx)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:Object(k.jsx)(d.L,{breadcrumbs:B,handleClick:R})}),Object(k.jsx)(j.f,{columns:A,titlemodule:n(m.a.inputvalidation,{count:2}),data:a.mainData.data,download:!0,ButtonsElement:function(){return Object(k.jsx)(u.a,{disabled:a.mainData.loading,variant:"contained",type:"button",color:"primary",startIcon:Object(k.jsx)(y.a,{color:"secondary"}),style:{backgroundColor:"#FB5F5F"},onClick:function(){return e.push(I.a.CONFIGURATION)},children:n(m.a.back)})},onClickRow:G,loading:a.mainData.loading,register:!0,handleRegister:function(){x("view-2"),_({row:null,edit:!0})}})]}):"view-2"===h?Object(k.jsx)(E,{data:S,setViewSelected:R,fetchData:L,arrayBread:B}):null}},778:function(e,t,n){"use strict";var i=n(45),a=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=a(n(0)),r=(0,i(n(62)).default)(c.createElement("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");t.default=r},780:function(e,t,n){"use strict";var i=n(45),a=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=a(n(0)),r=(0,i(n(62)).default)(c.createElement("path",{d:"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"}),"Save");t.default=r}}]);
//# sourceMappingURL=78.fb960b95.chunk.js.map