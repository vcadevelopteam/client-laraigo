(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[48,93],{1087:function(e,t,n){"use strict";n.r(t);var a=n(20),i=n(0),c=n(40),o=n(909),s=n(46),r=n(10),l=n(14),d=n(449),u=n(171),j=n(2),b=new URL(l.a.CHATFLOW).origin,f=new URL(l.a.CHATFLOW).pathname,O="".concat(b).concat(f);t.default=function(){var e=Object(c.c)(),t=Object(s.g)();Object(i.useEffect)((function(){window.addEventListener("message",(function(n){return function(n){var a;(null===n||void 0===n?void 0:n.origin)===b&&(null===n||void 0===n||null===(a=n.data)||void 0===a?void 0:a.chatblock)&&(e(Object(o.b)(n.data.chatblock)),t.push(r.a.VARIABLECONFIGURATION))}(n)}))}),[]);var n=Object(i.useState)(!1),l=Object(a.a)(n,2),f=l[0],v=l[1];return Object(i.useEffect)((function(){f&&function(e){var t,n=null===(t=document)||void 0===t?void 0:t.getElementById("ifr");null===n||void 0===n||n.contentWindow.postMessage({jwt:e},b)}(localStorage.getItem("accessToken"))}),[f]),Object(j.jsxs)("div",{style:{width:"100%",height:"100%",position:"relative"},children:[Object(j.jsx)(d.a,{style:{zIndex:999999999,color:"#fff",position:"absolute"},open:!f,children:Object(j.jsx)(u.a,{color:"inherit"})}),Object(j.jsx)("iframe",{id:"ifr",title:"botdesigner",src:O,style:{height:"100%",width:"100%",border:"none"},onLoad:function(){v(!0)}})]})}},1493:function(e,t,n){"use strict";n.r(t),n.d(t,"Assistant",(function(){return Z}));var a=n(20),i=n(0),c=n.n(i),o=n(25),s=n(48),r=n(122),l=n(8),d=n(776),u=n(3),j=n(1),b=n(26),f=n(783),O=n(169),v=n(94),h=n(779),m=n(778),p=n.n(m),y=n(40),x=n(205),g=n(780),w=n.n(g),k=n(44),S=n(83),C=n(328),N=n(7),D=n(2),E=Object(O.a)((function(e){return{labellink:{color:"#7721ad",textDecoration:"underline",cursor:"pointer"},button:{padding:12,fontWeight:500,fontSize:"14px",textTransform:"initial"},containerDetail:{marginTop:e.spacing(2),padding:e.spacing(2),background:"#fff"}}})),F=function e(){Object(f.a)(this,e),this.show=void 0,this.item=void 0,this.inputkey=void 0,this.inputvalue=void 0,this.range=void 0,this.top=void 0,this.left=void 0,this.changer=void 0,this.show=!1,this.item=null,this.inputkey="",this.inputvalue="",this.range=[-1,-1],this.changer=function(e){Object.assign({},e);return null},this.top=0,this.left=0},I=function(e){var t,n,d=e.data,f=d.row,O=d.edit,m=e.fetchData,g=e.setViewSelected,I=E(),_=Object(i.useState)(!1),T=Object(a.a)(_,2),A=T[0],H=T[1],L=Object(i.useState)(!f),z=Object(a.a)(L,2),B=z[0],R=z[1],V=Object(i.useState)(!0),M=Object(a.a)(V,2),P=M[0],U=M[1],q=Object(i.useState)({}),J=Object(a.a)(q,2),W=J[0],G=J[1],K=Object(i.useState)([]),Q=Object(a.a)(K,2),X=Q[0],Y=Q[1],Z=Object(i.useState)(new F),$=Object(a.a)(Z,2),ee=$[0],te=$[1],ne=Object(i.useState)({name:"",datajson:{text:"",traits:[],entities:[],intent:{name:(null===f||void 0===f?void 0:f.name)||""}}}),ae=Object(a.a)(ne,2),ie=ae[0],ce=ae[1],oe=Object(i.useState)([]),se=Object(a.a)(oe,2),re=se[0],le=se[1],de=Object(o.b)((function(e){return e.main.mainAux})),ue=Object(o.b)((function(e){return e.main.mainAux2})),je=Object(o.b)((function(e){return e.main.execute})),be=Object(y.c)(),fe=Object(r.a)().t,Oe=Object(x.d)({defaultValues:{type:"NINGUNO",id:f?f.id:0,name:(null===f||void 0===f?void 0:f.name)||"",description:(null===f||void 0===f?void 0:f.description)||"",operation:f?"EDIT":"INSERT",status:"ACTIVO"}}),ve=Oe.register,he=Oe.handleSubmit,me=Oe.setValue,pe=Oe.getValues,ye=Oe.formState.errors;Object(i.useEffect)((function(){f&&be(Object(S.h)(Object(C.sg)((null===f||void 0===f?void 0:f.name)||"")))}),[]),Object(i.useEffect)((function(){ue.loading||ue.error||Y(ue.data.map((function(e){return e.datajson.keywords.map((function(t){return{name:e.name+"."+t.keyword,entity:e}}))})).reduce((function(e,t){return[].concat(Object(b.a)(e),Object(b.a)(t))}),[]))}),[ue]),Object(i.useEffect)((function(){de.loading||de.error||le(de.data)}),[de]),c.a.useEffect((function(){ve("type"),ve("id"),ve("status"),ve("operation"),ve("name",{validate:function(e){return e&&e.length||fe(l.a.field_required)}}),ve("description")}),[O,ve]),Object(i.useEffect)((function(){if(A)if(je.loading||je.error){if(je.error){var e=fe(je.code||"error_unexpected_error",{module:fe(l.a.whitelist).toLocaleLowerCase()});be(Object(k.e)({show:!0,severity:"error",message:e})),H(!1),be(Object(k.d)(!1))}}else be(Object(k.e)({show:!0,severity:"success",message:fe(f?l.a.successful_edit:l.a.successful_register)})),m&&m(),be(Object(k.d)(!1)),g("view-1")}),[je,A]);var xe=he((function(e){be(Object(k.a)({visible:!0,question:fe(l.a.confirmation_save),callback:function(){var t=re;t.forEach((function(e){return delete e.updatedate})),be(Object(S.c)(Object(C.Kf)(Object(j.a)(Object(j.a)({},e),{},{datajson:JSON.stringify({name:e.name}),utterance_datajson:JSON.stringify(t)})))),be(Object(k.d)(!0)),H(!0)}}))})),ge=c.a.useMemo((function(){return[{Header:fe(l.a.userexample),accessor:"name",NoFilter:!0,width:"auto"},{Header:fe(l.a.added),accessor:"updatedate",NoFilter:!0,width:"auto"}]}),[]),we=function(e,t,n,a){var i=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],c=e.target;if(c){var o,s=c.selectionStart||0,r=(c.value||"").substr(0,s).split("\n"),l=r.length-1,d=3*r[l].length,u=null===(o=(c.value||"").slice(0,s||0))||void 0===o?void 0:o.lastIndexOf("{{"),f="";if(-1!==u)if(-1===c.value.slice(u,s).indexOf(" ")&&-1===c.value.slice(u,s).indexOf("}}")&&"}"!==c.value[s-1]){f=c.value.slice(u+2,s);var O=(c.value||"").slice(s,c.value.length),v=-1!==O.indexOf("}}")?O.indexOf("}}"):0,h=u+f.length+v+4;te({show:!0,item:t,inputkey:n,inputvalue:c.value,range:[u,h],changer:function(e){var t=Object.assign({},e);return a(Object(j.a)({},t))},top:24+21*l,left:d}),Y(i?Object(N.fb)(ue.data.map((function(e){return e.datajson.keywords.map((function(t){return{name:e.name+"."+t.keyword,entity:e}}))})).reduce((function(e,t){return[].concat(Object(b.a)(e),Object(b.a)(t))}),[]),"name",f,"%"):X)}else te(new F);else te(new F)}};return Object(D.jsx)("div",{style:{width:"100%"},children:Object(D.jsxs)("form",{onSubmit:xe,children:[Object(D.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(D.jsx)("div",{children:Object(D.jsx)(s.R,{title:f?"".concat(f.name):fe(l.a.newintention)})}),Object(D.jsxs)("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[Object(D.jsx)(v.a,{variant:"contained",type:"button",color:"primary",startIcon:Object(D.jsx)(p.a,{color:"secondary"}),style:{backgroundColor:"#FB5F5F"},onClick:function(){return g("view-1")},children:fe(l.a.back)}),Object(D.jsx)(v.a,{className:I.button,variant:"contained",disabled:B,color:"primary",type:"submit",startIcon:Object(D.jsx)(w.a,{color:"secondary"}),style:{backgroundColor:B?"#dbdbdc":"#55BD84"},children:fe(l.a.save)})]})]}),Object(D.jsxs)("div",{className:I.containerDetail,children:[Object(D.jsxs)("div",{className:"row-zyx",children:[Object(D.jsx)(s.l,{label:fe(l.a.name),disabled:!B,className:"col-12",onChange:function(e){me("name",e),U(""===pe("description")||""===e)},valueDefault:(null===f||void 0===f?void 0:f.name)||"",error:null===ye||void 0===ye||null===(t=ye.name)||void 0===t?void 0:t.message}),Object(D.jsx)(s.l,{label:fe(l.a.description),disabled:!B,className:"col-12",onChange:function(e){me("description",e),U(""===pe("name")||""===e)},valueDefault:(null===f||void 0===f?void 0:f.description)||"",error:null===ye||void 0===ye||null===(n=ye.description)||void 0===n?void 0:n.message})]}),!f&&Object(D.jsx)("div",{className:"row-zyx",children:Object(D.jsx)(v.a,{variant:"contained",type:"button",className:"col-3",disabled:P,color:"primary",style:{backgroundColor:P?"#dbdbdc":"#0078f6"},onClick:function(){var e=ie;e.datajson.intent.name=pe("name"),ce(e),U(!0),R(!1)},children:fe(l.a.create)})})]}),!B&&Object(D.jsxs)("div",{className:I.containerDetail,children:[Object(D.jsx)(s.p,{label:fe(l.a.adduserexample),className:"col-12",rows:1,valueDefault:ie.name,onChange:function(e){return ce(Object(j.a)(Object(j.a)({},ie),{},{name:e}))},inputProps:{onClick:function(e){return we(e,ie,"name",ce)},onInput:function(e){return we(e,ie,"name",ce)}},show:ee.show,data:X,datakey:"name",top:ee.top,left:ee.left,onClickSelection:function(e,t){return function(e,t){var n=ee.item,a=ee.inputkey,i=ee.inputvalue,c=ee.range,o=ee.changer;-1!==c[1]&&(c[1]>c[0]||-1!==c[0])&&(o(Object(j.a)(Object(j.a)({},n),{},Object(u.a)({},a,i.substring(0,c[0]+2)+t+("}"!==i[c[1]-2]?"}}":"")+i.substring(c[1]-2)))),te(new F))}(0,t)},onClickAway:function(e){return te(Object(j.a)(Object(j.a)({},e),{},{show:!1}))}}),Object(D.jsx)("div",{style:{paddingTop:"8px",paddingBottom:"8px"},children:fe(l.a.uniqueexamplesuser)}),Object(D.jsx)(v.a,{variant:"contained",type:"button",className:"col-3",disabled:""===ie.name,color:"primary",style:{backgroundColor:""===ie.name?"#dbdbdc":"#0078f6"},onClick:function(){var e=0,t="",n=ie;ie.name.split("{{").forEach((function(a){if(a.includes("}}")){var i=X.filter((function(e){return e.name===a.split("}}")[0]}))[0];n.datajson.entities=[].concat(Object(b.a)(n.datajson.entities),[{name:i.entity.name,role:i.entity.name,body:a.split("}}")[0].split(".")[1],start:e,end:e+a.split("}}")[0].split(".")[1].length,entities:[]}]),e+=a.split("}}")[0].split(".")[1].length,t+=a.split("}}")[0].split(".")[1]}else e+=a.length,t+=a})),n.name=t,n.datajson.text=t,le([].concat(Object(b.a)(re),[n])),ce({name:"",datajson:{text:"",traits:[],entities:[],intent:pe("name")}})},children:fe(l.a.add)}),Object(D.jsx)("div",{style:{width:"100%"},children:Object(D.jsx)(h.f,{columns:ge,data:re,filterGeneral:!1,useSelection:!0,selectionKey:"name",setSelectedRows:G,ButtonsElement:function(){return Object(D.jsx)("div",{style:{display:"flex",justifyContent:"end",width:"100%"},children:Object(D.jsx)(v.a,{disabled:0===Object.keys(W).length,variant:"contained",type:"button",color:"primary",startIcon:Object(D.jsx)(p.a,{color:"secondary"}),style:{backgroundColor:0===Object.keys(W).length?"#dbdbdc":"#FB5F5F"},onClick:function(){le(re.filter((function(e){return!Object.keys(W).includes(e.name)})))},children:fe(l.a.delete)})})},loading:de.loading,register:!1,download:!1,pageSizeDefault:20,initialPageIndex:0})})]})]})})},_=function(){var e=Object(y.c)(),t=Object(r.a)().t,n=E(),s=Object(o.b)((function(e){return e.main})),d=Object(i.useState)({}),u=Object(a.a)(d,2),j=u[0],b=u[1],f=Object(i.useState)(!1),O=Object(a.a)(f,2),m=O[0],x=O[1],g=Object(o.b)((function(e){return e.main.execute})),w=Object(i.useState)({row:null,edit:!1}),N=Object(a.a)(w,2),F=N[0],_=N[1],T=Object(i.useState)("view-1"),A=Object(a.a)(T,2),H=A[0],L=A[1],z=function(){e(Object(S.g)(Object(C.jg)()))};Object(i.useEffect)((function(){return z(),e(Object(S.i)(Object(C.ig)())),function(){e(Object(S.t)())}}),[]),Object(i.useEffect)((function(){if(m)if(g.loading||g.error){if(g.error){var n=t(g.code||"error_unexpected_error",{module:t(l.a.messagingcost).toLocaleLowerCase()});e(Object(k.e)({show:!0,severity:"error",message:n})),x(!1),e(Object(k.d)(!1))}}else e(Object(k.e)({show:!0,severity:"success",message:t(l.a.successful_delete)})),z(),e(Object(k.d)(!1)),L("view-1")}),[g,m]);var B=c.a.useMemo((function(){return[{Header:t(l.a.intentions),accessor:"name",width:"auto",NoFilter:!0,Cell:function(t){var a=t.cell.row.original;return Object(D.jsx)("label",{className:n.labellink,onClick:function(){e(Object(S.h)(Object(C.sg)((null===a||void 0===a?void 0:a.name)||""))),L("view-2"),_({row:a,edit:!0})},children:a.name})}},{Header:t(l.a.description),accessor:"description",width:"auto",NoFilter:!0},{Header:"ID",accessor:"id",width:"auto",NoFilter:!0},{Header:t(l.a.examples),accessor:"utteranceqty",width:"auto",NoFilter:!0},{Header:t(l.a.lastUpdate),accessor:"updatedate",width:"auto",NoFilter:!0}]}),[]),R=function(){e(Object(k.a)({visible:!0,question:t(l.a.confirmation_delete),callback:function(){e(Object(S.c)(Object(C.Ag)({table:JSON.stringify(Object.keys(j).map((function(e){return{name:e}})))}))),e(Object(k.d)(!0)),x(!0)}}))};return"view-1"===H?Object(D.jsxs)(c.a.Fragment,{children:[Object(D.jsx)("div",{style:{height:10}}),Object(D.jsx)("div",{style:{width:"100%"},children:Object(D.jsx)(h.f,{columns:B,data:s.mainData.data,filterGeneral:!1,useSelection:!0,selectionKey:"name",setSelectedRows:b,ButtonsElement:function(){return Object(D.jsx)("div",{style:{display:"flex",justifyContent:"end",width:"100%"},children:Object(D.jsx)(v.a,{disabled:0===Object.keys(j).length,variant:"contained",type:"button",color:"primary",startIcon:Object(D.jsx)(p.a,{color:"secondary"}),style:{backgroundColor:0===Object.keys(j).length?"#dbdbdc":"#FB5F5F"},onClick:R,children:t(l.a.delete)})})},loading:s.mainData.loading,register:!0,download:!1,handleRegister:function(){e(Object(S.h)(Object(C.sg)(""))),L("view-2"),_({row:null,edit:!0})},pageSizeDefault:20,initialPageIndex:0})})]}):"view-2"===H?Object(D.jsx)("div",{style:{width:"100%"},children:Object(D.jsx)(I,{data:F,fetchData:z,setViewSelected:L})}):null},T=n(24),A=n.n(T),H=n(39),L=n(1047),z=n(1048),B=n(1146),R=n(1044),V=n(1045),M=n(257),P=n(1049),U=n(786),q=n.n(U),J=n(265),W=n.n(J),G=Object(O.a)((function(e){return{labellink:{color:"#7721ad",textDecoration:"underline",cursor:"pointer"},button:{padding:12,fontWeight:500,fontSize:"14px",textTransform:"initial"},containerDetail:{marginTop:e.spacing(2),padding:e.spacing(2),background:"#fff"},field:{minHeight:38},title:{fontSize:"22px",fontWeight:"bold",color:e.palette.text.primary}}})),K=function(e){var t,n,d=e.data,u=d.row,f=d.edit,O=e.fetchData,h=e.setViewSelected,m=G(),g=Object(i.useState)(!1),N=Object(a.a)(g,2),E=N[0],F=N[1],I=Object(i.useState)((null===u||void 0===u||null===(t=u.datajson)||void 0===t?void 0:t.keywords)||[]),_=Object(a.a)(I,2),T=_[0],U=_[1],J=Object(o.b)((function(e){return e.main.execute})),K=Object(y.c)(),Q=Object(r.a)().t,X=Object(x.d)({defaultValues:{type:"NINGUNO",id:u?u.id:0,name:(null===u||void 0===u?void 0:u.name)||"",operation:u?"EDIT":"INSERT",status:"ACTIVO"}}),Y=X.register,Z=X.handleSubmit,$=X.setValue,ee=X.formState.errors;c.a.useEffect((function(){Y("type"),Y("id"),Y("status"),Y("operation"),Y("name",{validate:function(e){return e&&e.length||Q(l.a.field_required)}})}),[f,Y]),Object(i.useEffect)((function(){if(E)if(J.loading||J.error){if(J.error){var e=Q(J.code||"error_unexpected_error",{module:Q(l.a.whitelist).toLocaleLowerCase()});K(Object(k.e)({show:!0,severity:"error",message:e})),F(!1),K(Object(k.d)(!1))}}else K(Object(k.e)({show:!0,severity:"success",message:Q(u?l.a.successful_edit:l.a.successful_register)})),O&&O(),K(Object(k.d)(!1)),h("view-1")}),[J,E]);var te=Z((function(e){K(Object(k.a)({visible:!0,question:Q(l.a.confirmation_save),callback:function(){var t,n;K(Object(S.c)(Object(C.Jf)(Object(j.a)(Object(j.a)({},e),{},{datajson:JSON.stringify(Object(j.a)(Object(j.a)({},null===u||void 0===u?void 0:u.datajson),{},{keywords:T,lookups:["keywords"],name:e.name,roles:[(null===u||void 0===u||null===(t=u.datajson)||void 0===t?void 0:t.roles)?null===u||void 0===u||null===(n=u.datajson)||void 0===n?void 0:n.roles[0]:e.name]}))})))),K(Object(k.d)(!0)),F(!0)}}))}));return Object(D.jsx)("div",{style:{width:"100%"},children:Object(D.jsxs)("form",{onSubmit:te,children:[Object(D.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(D.jsx)("div",{}),Object(D.jsxs)("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[Object(D.jsx)(v.a,{variant:"contained",type:"button",color:"primary",startIcon:Object(D.jsx)(p.a,{color:"secondary"}),style:{backgroundColor:"#FB5F5F"},onClick:function(){return h("view-1")},children:Q(l.a.back)}),Object(D.jsx)(v.a,{className:m.button,variant:"contained",color:"primary",type:"submit",startIcon:Object(D.jsx)(w.a,{color:"secondary"}),style:{backgroundColor:"#55BD84"},children:Q(l.a.save)})]})]}),Object(D.jsx)("div",{className:m.containerDetail,children:Object(D.jsx)("div",{className:"row-zyx",children:Object(D.jsx)(s.l,{label:Q(l.a.newentity),className:"col-12",onChange:function(e){$("name",e)},valueDefault:(null===u||void 0===u?void 0:u.name)||"",error:null===ee||void 0===ee||null===(n=ee.name)||void 0===n?void 0:n.message})})}),Object(D.jsx)("div",{className:m.containerDetail,children:Object(D.jsxs)("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[Object(D.jsxs)("div",{style:{flex:.55},className:m.containerDetail,children:[Object(D.jsx)("div",{style:{display:"flex",justifyContent:"space-between"},children:Object(D.jsx)("div",{className:m.title,children:Q(l.a.keywords)})}),Object(D.jsx)("div",{children:Object(D.jsx)(L.a,{children:Object(D.jsxs)(z.a,{size:"small",children:[Object(D.jsx)(B.a,{children:Object(D.jsxs)(R.a,{children:[Object(D.jsx)(V.a,{children:Object(D.jsx)(M.a,{size:"small",onClick:Object(H.a)(A.a.mark((function e(){return A.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:U([].concat(Object(b.a)(T),[{keyword:"",synonyms:[]}]));case 1:case"end":return e.stop()}}),e)}))),children:Object(D.jsx)(q.a,{})})}),Object(D.jsx)(V.a,{children:Q(l.a.keywords)})]})}),Object(D.jsx)(P.a,{style:{marginTop:5},children:T.map((function(e,t){return Object(D.jsxs)(R.a,{children:[Object(D.jsx)(V.a,{width:30,children:Object(D.jsx)("div",{style:{display:"flex"},children:Object(D.jsx)(M.a,{size:"small",onClick:function(){U(T.splice(t,1))},children:Object(D.jsx)(W.a,{style:{color:"#777777"}})})})}),Object(D.jsx)(V.a,{style:{width:200},children:Object(D.jsx)(s.n,{valueDefault:T[t].keyword,onChange:function(e){var n=T;n[t].keyword=e,U(n)}})})]},t)}))})]})})})]}),Object(D.jsxs)("div",{style:{flex:.45},className:m.containerDetail,children:[Object(D.jsx)("div",{style:{display:"flex",justifyContent:"space-between",paddingBottom:"45px"},children:Object(D.jsx)("div",{className:m.title,children:Q(l.a.sinonims)})}),Object(D.jsx)("div",{children:T.map((function(e,t){return Object(D.jsx)(s.s,{valueDefault:T[t].synonyms.join()||"",className:m.field,onChange:function(e){var n=T;n[t].synonyms=e,U(n)},loading:!1,data:T[t].synonyms.map((function(e){return{value:e}})),optionDesc:"value",optionValue:"value"},t)}))})]})]})})]})})},Q=function(){var e=Object(y.c)(),t=Object(r.a)().t,n=G(),s=Object(o.b)((function(e){return e.main})),d=Object(i.useState)(!1),u=Object(a.a)(d,2),j=u[0],b=u[1],f=Object(i.useState)({}),O=Object(a.a)(f,2),m=O[0],x=O[1],g=Object(i.useState)({row:null,edit:!1}),w=Object(a.a)(g,2),N=w[0],E=w[1],F=Object(i.useState)("view-1"),I=Object(a.a)(F,2),_=I[0],T=I[1],A=Object(o.b)((function(e){return e.main.execute})),H=function(){e(Object(S.g)(Object(C.ig)()))};Object(i.useEffect)((function(){return H(),function(){e(Object(S.t)())}}),[]),Object(i.useEffect)((function(){if(j)if(A.loading||A.error){if(A.error){var n=t(A.code||"error_unexpected_error",{module:t(l.a.messagingcost).toLocaleLowerCase()});e(Object(k.e)({show:!0,severity:"error",message:n})),b(!1),e(Object(k.d)(!1))}}else e(Object(k.e)({show:!0,severity:"success",message:t(l.a.successful_delete)})),H(),e(Object(k.d)(!1)),T("view-1")}),[A,j]);var L=c.a.useMemo((function(){return[{Header:t(l.a.entities),accessor:"name",NoFilter:!0,width:"auto",Cell:function(e){var t=e.cell.row.original;return Object(D.jsx)("label",{className:n.labellink,onClick:function(){T("view-2"),E({row:t,edit:!0})},children:t.name})}},{Header:t(l.a.value_plural),accessor:"description",NoFilter:!0,width:"auto",Cell:function(e){var t,n,a=e.cell.row.original;return Object(D.jsx)("label",{children:null===a||void 0===a||null===(t=a.datajson)||void 0===t||null===(n=t.keywords)||void 0===n?void 0:n.reduce((function(e,t){return e+t.keyword+", "}),"").slice(0,-2)})}},{Header:"ID",accessor:"id",width:"auto",NoFilter:!0},{Header:t(l.a.lastUpdate),accessor:"updatedate",width:"auto",NoFilter:!0}]}),[]),z=function(){e(Object(k.a)({visible:!0,question:t(l.a.confirmation_delete),callback:function(){e(Object(S.c)(Object(C.L)({table:JSON.stringify(Object.keys(m).map((function(e){return{name:e}})))}))),e(Object(k.d)(!0)),b(!0)}}))};return"view-1"===_?Object(D.jsxs)(c.a.Fragment,{children:[Object(D.jsx)("div",{style:{height:10}}),Object(D.jsx)(h.f,{columns:L,data:s.mainData.data,filterGeneral:!1,useSelection:!0,selectionKey:"name",setSelectedRows:x,ButtonsElement:function(){return Object(D.jsx)("div",{style:{display:"flex",justifyContent:"end",width:"100%"},children:Object(D.jsx)(v.a,{disabled:0===Object.keys(m).length,variant:"contained",type:"button",color:"primary",startIcon:Object(D.jsx)(p.a,{color:"secondary"}),style:{backgroundColor:0===Object.keys(m).length?"#dbdbdc":"#FB5F5F"},onClick:z,children:t(l.a.delete)})})},loading:s.mainData.loading,register:!0,download:!1,handleRegister:function(){T("view-2"),E({row:null,edit:!0})},pageSizeDefault:20,initialPageIndex:0})]}):"view-2"===_?Object(D.jsx)("div",{style:{width:"100%"},children:Object(D.jsx)(K,{data:N,fetchData:H,setViewSelected:T})}):null},X=n(1087),Y=function(){return Object(D.jsx)("div",{style:{width:"100%",height:"100%"},children:Object(D.jsx)(X.default,{})})},Z=function(){var e=Object(r.a)().t,t=Object(o.b)((function(e){return e.login.validateToken.user})),n=Object(i.useState)("SUPERADMIN"===(null===t||void 0===t?void 0:t.roledesc)?0:6),c=Object(a.a)(n,2),u=c[0],j=c[1];return Object(D.jsxs)("div",{style:{width:"100%"},children:[Object(D.jsxs)(d.a,{value:u,indicatorColor:"primary",variant:"fullWidth",style:{borderBottom:"1px solid #EBEAED",backgroundColor:"#FFF",marginTop:8},textColor:"primary",onChange:function(e,t){return j(t)},children:["SUPERADMIN"===(null===t||void 0===t?void 0:t.roledesc)&&Object(D.jsx)(s.b,{label:e(l.a.intentions)}),"SUPERADMIN"===(null===t||void 0===t?void 0:t.roledesc)&&Object(D.jsx)(s.b,{label:e(l.a.entities)}),"SUPERADMIN"===(null===t||void 0===t?void 0:t.roledesc)&&Object(D.jsx)(s.b,{label:e(l.a.dialog)})]}),0===u&&Object(D.jsx)("div",{style:{marginTop:16},children:Object(D.jsx)(_,{})}),1===u&&Object(D.jsx)("div",{style:{marginTop:16},children:Object(D.jsx)(Q,{})}),2===u&&Object(D.jsx)("div",{style:{marginTop:16,height:"100%"},children:Object(D.jsx)(Y,{})})]})};t.default=Z},778:function(e,t,n){"use strict";var a=n(45),i=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=i(n(0)),o=(0,a(n(62)).default)(c.createElement("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");t.default=o},780:function(e,t,n){"use strict";var a=n(45),i=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=i(n(0)),o=(0,a(n(62)).default)(c.createElement("path",{d:"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"}),"Save");t.default=o},783:function(e,t,n){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}n.d(t,"a",(function(){return a}))},786:function(e,t,n){"use strict";var a=n(45),i=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var c=i(n(0)),o=(0,a(n(62)).default)(c.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),"Add");t.default=o},909:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return c}));var a=n(282),i=function(e){return{payload:e,type:a.a.CHATBLOCK_SET}},c=function(){return{type:a.a.CHATBLOCK_RESET}}}}]);
//# sourceMappingURL=48.e03a973f.chunk.js.map