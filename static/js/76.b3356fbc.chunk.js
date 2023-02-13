(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[76],{1392:function(e,t,a){"use strict";a.r(t);var i=a(1),n=a(20),c=a(0),o=a.n(c),r=a(25),s=a(40),l=a(94),u=a(48),d=a(7),b=a(779),j=a(169),f=a(780),v=a.n(f),O=a(122),m=a(8),p=a(205),g=a(83),x=a(44),y=a(778),h=a.n(y),w=a(2),N=[{id:"view-1",name:"Group Configuration"},{id:"view-2",name:"Group Configuration Detail"}],D=Object(j.a)((function(e){return{containerDetail:{marginTop:e.spacing(2),padding:e.spacing(2),background:"#fff"},button:{padding:12,fontWeight:500,fontSize:"14px",textTransform:"initial"}}})),C=function(e){var t,a,i,b,j,f=e.data,y=f.row,C=f.edit,_=e.setViewSelected,q=e.multiData,S=e.fetchData,E=D(),F=Object(c.useState)(!1),I=Object(n.a)(F,2),k=I[0],V=I[1],T=Object(r.b)((function(e){return e.main.execute})),z=Object(s.c)(),L=Object(O.a)().t,H=q[1]&&q[1].success?q[1].data:[],M=q[0]&&q[0].success?q[0].data:[],G=Object(p.d)({defaultValues:{type:"NINGUNO",id:y?y.groupconfigurationid:0,description:y&&y.description||"",status:(null===y||void 0===y?void 0:y.status)||"ACTIVO",quantity:y?y.quantity:0,domainid:y?y.domainid:0,validationtext:y?y.validationtext:"",operation:y?"EDIT":"INSERT"}}),R=G.register,A=G.handleSubmit,P=G.setValue,B=G.formState.errors;o.a.useEffect((function(){R("type"),R("id"),R("description",{validate:function(e){return e&&e.length||L(m.a.field_required)}}),R("status",{validate:function(e){return e&&e.length||L(m.a.field_required)}}),R("quantity",{validate:function(e){return e&&e>0||L(m.a.field_required)}}),R("domainid",{validate:function(e){return e&&e>0||L(m.a.field_required)}}),R("validationtext",{validate:function(e){return e&&e.length||L(m.a.field_required)}})}),[C,R]),Object(c.useEffect)((function(){if(k)if(T.loading||T.error){if(T.error){var e=L(T.code||"error_unexpected_error",{module:L(m.a.groupconfig).toLocaleLowerCase()});z(Object(x.e)({show:!0,severity:"error",message:e})),V(!1),z(Object(x.d)(!1))}}else z(Object(x.e)({show:!0,severity:"success",message:L(y?m.a.successful_edit:m.a.successful_register)})),S&&S(),z(Object(x.d)(!1)),_("view-1")}),[T,k]);var J=A((function(e){z(Object(x.a)({visible:!0,question:L(m.a.confirmation_save),callback:function(){z(Object(g.c)(Object(d.Sf)(e))),z(Object(x.d)(!0)),V(!0)}}))}));return Object(w.jsx)("div",{style:{width:"100%"},children:Object(w.jsxs)("form",{onSubmit:J,children:[Object(w.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(w.jsxs)("div",{children:[Object(w.jsx)(u.L,{breadcrumbs:N,handleClick:_}),Object(w.jsx)(u.R,{title:y?"".concat(y.description):L(m.a.newgroupconfig)})]}),Object(w.jsxs)("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[Object(w.jsx)(l.a,{variant:"contained",type:"button",color:"primary",startIcon:Object(w.jsx)(h.a,{color:"secondary"}),style:{backgroundColor:"#FB5F5F"},onClick:function(){return _("view-1")},children:L(m.a.back)}),C&&Object(w.jsx)(l.a,{className:E.button,variant:"contained",color:"primary",type:"submit",startIcon:Object(w.jsx)(v.a,{color:"secondary"}),style:{backgroundColor:"#55BD84"},children:L(m.a.save)})]})]}),Object(w.jsxs)("div",{className:E.containerDetail,children:[Object(w.jsxs)("div",{className:"row-zyx",children:[C?Object(w.jsx)(u.u,{label:L(m.a.domain),className:"col-6",valueDefault:y&&y.domainid||"",onChange:function(e){return P("domainid",e?e.domainid:0)},error:null===B||void 0===B||null===(t=B.domainid)||void 0===t?void 0:t.message,data:M,optionDesc:"domaindesc",optionValue:"domainid"}):Object(w.jsx)(u.v,{label:L(m.a.domain),value:y&&y.domaindesc||"",className:"col-6"}),C?Object(w.jsx)(u.l,{label:L(m.a.description),className:"col-6",onChange:function(e){return P("description",e)},valueDefault:y&&y.description||"",error:null===B||void 0===B||null===(a=B.description)||void 0===a?void 0:a.message}):Object(w.jsx)(u.v,{label:L(m.a.description),value:y&&y.description||"",className:"col-6"})]}),Object(w.jsxs)("div",{className:"row-zyx",children:[C?Object(w.jsx)(u.u,{label:L(m.a.status),className:"col-6",valueDefault:(null===y||void 0===y?void 0:y.status)||"ACTIVO",onChange:function(e){return P("status",e?e.domainvalue:"")},error:null===B||void 0===B||null===(i=B.status)||void 0===i?void 0:i.message,data:H,uset:!0,prefixTranslation:"status_",optionDesc:"domaindesc",optionValue:"domainvalue"}):Object(w.jsx)(u.v,{label:L(m.a.status),value:y&&y.status||"",className:"col-6"}),C?Object(w.jsx)(u.l,{label:L(m.a.quantity),error:null===B||void 0===B||null===(b=B.quantity)||void 0===b?void 0:b.message,onChange:function(e){return P("quantity",e?parseInt(e):0)},type:"number",className:"col-6",valueDefault:y&&y.quantity||""}):Object(w.jsx)(u.v,{label:L(m.a.quantity),value:y&&y.quantity||"",className:"col-6"})]}),Object(w.jsx)("div",{className:"row-zyx",children:C?Object(w.jsx)(u.l,{label:L(m.a.validationtext),className:"col-6",valueDefault:y&&y.validationtext||"",onChange:function(e){return P("validationtext",e)},error:null===B||void 0===B||null===(j=B.validationtext)||void 0===j?void 0:j.message}):Object(w.jsx)(u.v,{label:L(m.a.validationtext),value:y&&y.validationtext||"",className:"col-6"})})]})]})})};t.default=function(){var e=Object(s.c)(),t=Object(O.a)().t,a=Object(r.b)((function(e){return e.main})),l=Object(r.b)((function(e){return e.main.execute})),j=Object(c.useState)("view-1"),f=Object(n.a)(j,2),v=f[0],p=f[1],y=Object(c.useState)({row:null,edit:!1}),h=Object(n.a)(y,2),N=h[0],D=h[1],_=Object(c.useState)(!1),q=Object(n.a)(_,2),S=q[0],E=q[1],F=o.a.useMemo((function(){return[{accessor:"userid",NoFilter:!0,isComponent:!0,Cell:function(e){var t=e.cell.row.original;return Object(w.jsx)(u.M,{viewFunction:function(){return k(t)},deleteFunction:function(){return T(t)},editFunction:function(){return V(t)}})}},{Header:t(m.a.domain),accessor:"domaindesc",NoFilter:!0},{Header:t(m.a.description),accessor:"description",NoFilter:!0},{Header:t(m.a.status),accessor:"status",NoFilter:!0},{Header:t(m.a.quantity),accessor:"quantity",NoFilter:!0},{Header:t(m.a.validationtext),accessor:"validationtext",NoFilter:!0}]}),[]),I=function(){return e(Object(g.g)(Object(d.Qc)(0)))};Object(c.useEffect)((function(){return I(),e(Object(g.p)([Object(d.Ke)("GRUPOS"),Object(d.Ke)("ESTADOGENERICO")])),function(){e(Object(g.y)())}}),[]),Object(c.useEffect)((function(){if(S)if(l.loading||l.error){if(l.error){var a=t(l.code||"error_unexpected_error",{module:t(m.a.groupconfig).toLocaleLowerCase()});e(Object(x.e)({show:!0,severity:"error",message:a})),e(Object(x.d)(!1)),E(!1)}}else e(Object(x.e)({show:!0,severity:"success",message:t(m.a.successful_delete)})),I(),e(Object(x.d)(!1)),E(!1)}),[l,S]);var k=function(e){p("view-2"),D({row:e,edit:!1})},V=function(e){p("view-2"),D({row:e,edit:!0})},T=function(a){e(Object(x.a)({visible:!0,question:t(m.a.confirmation_delete),callback:function(){e(Object(g.c)(Object(d.Sf)(Object(i.a)(Object(i.a)({},a),{},{operation:"DELETE",status:"ELIMINADO",id:a.groupconfigurationid})))),e(Object(x.d)(!0)),E(!0)}}))};return"view-1"===v?Object(w.jsx)(b.f,{columns:F,titlemodule:t(m.a.groupconfig,{count:2}),data:a.mainData.data,download:!0,loading:a.mainData.loading,register:!0,handleRegister:function(){p("view-2"),D({row:null,edit:!0})}}):"view-2"===v?Object(w.jsx)(C,{data:N,setViewSelected:p,multiData:a.multiData.data,fetchData:I}):null}},778:function(e,t,a){"use strict";var i=a(45),n=a(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=n(a(0)),o=(0,i(a(62)).default)(c.createElement("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");t.default=o},780:function(e,t,a){"use strict";var i=a(45),n=a(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=n(a(0)),o=(0,i(a(62)).default)(c.createElement("path",{d:"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"}),"Save");t.default=o}}]);
//# sourceMappingURL=76.b3356fbc.chunk.js.map