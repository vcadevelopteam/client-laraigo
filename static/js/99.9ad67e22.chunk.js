(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[99],{1428:function(e,t,a){"use strict";a.r(t),a.d(t,"ChannelAddWhatsapp",(function(){return L}));var n=a(24),i=a.n(n),r=a(1),c=a(39),s=a(20),l=a(0),o=a(169),d=a(717),u=a(94),p=a(101),b=a(51),m=a(706),h=a(44),f=a(8),v=a(122),j=a(48),x=a(254),g=a(332),O=a.n(g),y=a(46),S=a(10),A=a(25),E=a(40),N=a(781),C=a(16),w=a(2),_=Object(o.a)((function(e){return{centerbutton:{marginLeft:"calc(50% - 96px)",marginTop:"30px",marginBottom:"20px"},button:{padding:12,fontWeight:500,fontSize:"14px",textTransform:"initial",width:"180px"},button2:{padding:12,fontWeight:500,fontSize:"14px",textTransform:"initial",width:"100%"},fields1:{flex:1,margin:"15px"},fields2:{flex:1},fields3:{flex:1,marginLeft:"15px"}}})),k=Object(x.a)(O.a)({"& label.Mui-focused":{color:"#7721ad"},"& .MuiInput-underline:after":{borderBottomColor:"#7721ad"},"& .MuiOutlinedInput-root":{"&.Mui-focused fieldset":{borderColor:"#7721ad"}}}),L=function(e){var t=e.edit,a=Object(l.useState)(!0),n=Object(s.a)(a,2),o=n[0],x=n[1],g=Object(l.useState)("#4AC959"),O=Object(s.a)(g,2),L=O[0],P=O[1],T=Object(l.useState)("view1"),I=Object(s.a)(T,2),H=I[0],D=I[1],R=Object(l.useState)(!0),W=Object(s.a)(R,2),M=W[0],U=W[1],F=Object(l.useState)(!0),z=Object(s.a)(F,2),G=z[0],B=z[1],V=Object(l.useState)(!0),K=Object(s.a)(V,2),Y=K[0],Z=K[1],J=Object(l.useState)(!0),q=Object(s.a)(J,2),Q=q[0],X=q[1],$=Object(l.useState)(!1),ee=Object(s.a)($,2),te=ee[0],ae=ee[1],ne=Object(l.useState)(!1),ie=Object(s.a)(ne,2),re=ie[0],ce=ie[1],se=Object(l.useState)(!1),le=Object(s.a)(se,2),oe=le[0],de=le[1],ue=Object(l.useState)(!1),pe=Object(s.a)(ue,2),be=pe[0],me=pe[1],he=Object(l.useState)(!1),fe=Object(s.a)(he,2),ve=fe[0],je=fe[1],xe=Object(l.useState)(!1),ge=Object(s.a)(xe,2),Oe=ge[0],ye=ge[1],Se=Object(l.useState)(!1),Ae=Object(s.a)(Se,2),Ee=Ae[0],Ne=Ae[1],Ce=Object(l.useState)(!0),we=Object(s.a)(Ce,2),_e=we[0],ke=we[1],Le=Object(A.b)((function(e){return e.login.validateToken.user})),Pe=(null===Le||void 0===Le?void 0:Le.roledesc)||"",Te=Object(A.b)((function(e){return e.channel.successinsert})),Ie=Object(A.b)((function(e){return e.channel.activateChannel})),He=Object(A.b)((function(e){return e.channel.channelList})),De=_(),Re=Object(y.g)(),We=Object(y.h)(),Me=We.state,Ue=Object(E.c)(),Fe=Object(v.a)().t;Object(l.useEffect)((function(){(t&&!(null===Me||void 0===Me?void 0:Me.row)||t&&(null===Me||void 0===Me?void 0:Me.row)&&0===(null===Me||void 0===Me?void 0:Me.row.servicecredentials.length))&&Re.push(S.a.CHANNELS)}),[Re]);var ze=Object(l.useState)({accesstoken:"",brandName:"",brandAddress:"",firstName:"",lastName:"",email:"",phone:"",customerfacebookid:"",phonenumberwhatsappbusiness:"",nameassociatednumber:""}),Ge=Object(s.a)(ze,1)[0],Be=Object(l.useState)({method:"UFN_COMMUNICATIONCHANNEL_INS",parameters:{id:0,description:"",type:"",communicationchannelsite:"",communicationchannelowner:"",chatflowenabled:!0,integrationid:"",color:"",icons:"",other:"",form:"",apikey:"",coloricon:"#4AC959",voximplantcallsupervision:!1},type:"DIALOG"===(null===Me||void 0===Me?void 0:Me.typeWhatsApp)?"WHATSAPP":"WHATSAPPSMOOCH",service:{accesstoken:"",brandname:"",brandaddress:"",firstname:"",lastname:"",email:"",phone:"",customerfacebookid:"",phonenumberwhatsappbusiness:"",nameassociatednumber:"",apikeyid:"",apikeysecret:"",appid:"",appname:"",apikey:"",appnumber:""}}),Ve=Object(s.a)(Be,2),Ke=Ve[0],Ye=Ve[1];function Ze(){return(Ze=Object(c.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ae(!0),Ue(Object(N.m)(Ke)),Ne(!0),D("main");case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Je(e,t){U(""===e);var a=Ke;a.service.accesstoken=e,a.parameters.communicationchannelowner="",Ye(a)}function qe(e,t){U(""===e);var a=Ke;a.service.apikeyid=e,a.parameters.communicationchannelowner="",Ye(a)}function Qe(e,t){U(""===e);var a=Ke;a.service.apikeysecret=e,a.parameters.communicationchannelowner="",Ye(a)}function Xe(e,t){U(""===e);var a=Ke;a.service.appid=e,a.parameters.communicationchannelowner="",Ye(a)}function $e(){return et.apply(this,arguments)}function et(){return(et=Object(c.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Ue(Object(h.d)(!0)),Ue(Object(N.a)(Ke));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return"undefined"!==typeof(null===We||void 0===We?void 0:We.state)&&(null===We||void 0===We?void 0:We.state)||Re.push(S.a.CHANNELS),Object(l.useEffect)((function(){if("SUPERADMIN"!==Pe&&!t&&"DIALOG"===(null===Me||void 0===Me?void 0:Me.typeWhatsApp)){je(!0),me(!1),ye(!1);var e=Ke;e.type="DIALOG",Ye(e)}if("SUPERADMIN"!==Pe&&!t&&"SMOOCH"===(null===Me||void 0===Me?void 0:Me.typeWhatsApp)){je(!1),me(!0),ye(!1);var a=Ke;a.type="WHATSAPPSMOOCHINSERT",Ye(a)}if("SUPERADMIN"!==Pe&&!t&&"GUPSHUP"===(null===Me||void 0===Me?void 0:Me.typeWhatsApp)){je(!1),me(!1),ye(!0);var n=Ke;n.type="WHATSAPPGUPSHUP",Ye(n)}}),[Me]),Object(l.useEffect)((function(){if(t&&_e&&(ke(!1),(null===Me||void 0===Me?void 0:Me.row)&&Me&&(null===Me||void 0===Me?void 0:Me.row.servicecredentials.length)>0)){var e=JSON.parse(Me.row.servicecredentials);Ye({method:"UFN_COMMUNICATIONCHANNEL_INS",parameters:{id:Me.row.communicationchannelid,description:Me.row.communicationchanneldesc,type:Me.row.type,communicationchannelsite:Me.row.communicationchannelsite,communicationchannelowner:Me.row.communicationchannelowner,chatflowenabled:Me.row.chatflowenabled,integrationid:Me.row.integrationid,color:Me.row.color,icons:Me.row.icons,other:Me.row.other,form:Me.row.form,apikey:Me.row.apikey,coloricon:Me.row.coloricon,voximplantcallsupervision:!1},type:"WHATSAPPSMOOCH",service:{accesstoken:e.accesstoken,brandname:e.brandname,brandaddress:e.brandaddress,firstname:e.firstname,lastname:e.lastname,email:e.email,phone:e.phone,customerfacebookid:e.customerfacebookid,phonenumberwhatsappbusiness:e.phonenumberwhatsappbusiness,nameassociatednumber:e.nameassociatednumber,apikeyid:"",apikeysecret:"",appid:"",appname:"",apikey:"",appnumber:""}}),B(!1)}}),[_e]),Object(l.useEffect)((function(){if(!He.loading&&te)if(Te)ae(!1),Ue(Object(h.e)({show:!0,severity:"success",message:Fe(f.a.successful_register)})),Ue(Object(h.d)(!1)),Ne(!1),Re.push(S.a.CHANNELS);else if(!Te){var e=Fe(He.code||"error_unexpected_error",{module:Fe(f.a.property).toLocaleLowerCase()});Ue(Object(h.e)({show:!0,severity:"error",message:e})),Ue(Object(h.d)(!1)),Ne(!1)}}),[He]),Object(l.useEffect)((function(){Ee&&(Ue(Object(h.d)(!1)),Ne(!1))}),[He]),Object(l.useEffect)((function(){Ie.loading||!re&&!oe||(Ue(Object(h.d)(!1)),Ie.error?Ue(Object(h.e)({show:!0,severity:"error",message:String(Ie.message)})):(Ue(Object(h.e)({show:!0,severity:"success",message:"Success"})),Re.push(S.a.CHANNELS)))}),[Ie]),"view1"===H?ve?Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),je(!1),me(!1),ye(!1)},children:Fe(f.a.previoustext)},"mainview")}),Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:Fe(f.a.whatsapptitledialog)}),t?Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:!1,onClick:function(){Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.close)}):Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:M,onClick:function(){D("viewfinishreg")},children:Fe(f.a.registerwhats)}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{className:"col-3"}),Object(w.jsx)(j.l,{onChange:function(e){return Je(e)},label:Fe(f.a.enterapikey),className:"col-6"})]})]})]}):be?Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),je(!1),me(!1),ye(!1)},children:Fe(f.a.previoustext)},"mainview")}),Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:Fe(f.a.whatsapptitlesmooch)}),t?Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:!1,onClick:function(){Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.close)}):Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:Y,onClick:function(){D("viewfinishreg")},children:Fe(f.a.registerwhats)}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){qe(e.target.value),Z(!e.target.value||!Ke.service.apikeysecret||!Ke.service.appid)},variant:"outlined",label:Fe(f.a.smooch_apikeyid)})}),Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){Qe(e.target.value),Z(!e.target.value||!Ke.service.apikeyid||!Ke.service.appid)},variant:"outlined",label:Fe(f.a.smooch_apikeysecret)})}),Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){Xe(e.target.value),Z(!e.target.value||!Ke.service.apikeyid||!Ke.service.apikeysecret)},variant:"outlined",label:Fe(f.a.smooch_appid)})})]})]})]}):Oe?Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),je(!1),me(!1),ye(!1)},children:Fe(f.a.previoustext)},"mainview")}),Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:Fe(f.a.whatsapptitlegupshup)}),t?Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:!1,onClick:function(){Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.close)}):Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:Q,onClick:function(){D("viewfinishreg")},children:Fe(f.a.registerwhats)}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){Xe(e.target.value),X(!e.target.value||!Ke.service.appname||!Ke.service.apikey||!Ke.service.appnumber)},variant:"outlined",label:Fe(f.a.gupshuppappid)})}),Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){!function(e,t){U(""===e);var a=Ke;a.service.appname=e,a.parameters.communicationchannelowner="",Ye(a)}(e.target.value),X(!Ke.service.appid||!e.target.value||!Ke.service.apikey||!Ke.service.appnumber)},variant:"outlined",label:Fe(f.a.gupshuppappname)})}),Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){!function(e,t){U(""===e);var a=Ke;a.service.apikey=e,a.parameters.communicationchannelowner="",Ye(a)}(e.target.value),X(!Ke.service.appid||!Ke.service.appname||!e.target.value||!Ke.service.appnumber)},variant:"outlined",label:Fe(f.a.gupshuppapikey)})}),Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){!function(e,t){U(""===e);var a=Ke;a.service.appnumber=e,a.parameters.communicationchannelowner="",Ye(a)}(e.target.value),X(!Ke.service.appid||!Ke.service.appname||!Ke.service.apikey||!e.target.value)},variant:"outlined",label:Fe(f.a.gupshuppappnumber),type:"number"})})]})]})]}):"SUPERADMIN"!==Pe||t?re?Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.previoustext)},"mainview")}),Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:Fe(f.a.whatsapptitledialog)}),Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:M,onClick:$e,children:Fe(f.a.registerwhats)}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{className:"col-3"}),Object(w.jsx)(j.l,{onChange:function(e){return Je(e)},label:Fe(f.a.enterapikey),className:"col-6"})]})]})]}):oe?Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.previoustext)},"mainview")}),Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:Fe(f.a.whatsapptitlesmooch)}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){qe(e.target.value),Z(!e.target.value||!Ke.service.apikeysecret||!Ke.service.appid)},variant:"outlined",label:"Apikey Id"})}),Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){Qe(e.target.value),Z(!e.target.value||!Ke.service.apikeyid||!Ke.service.appid)},variant:"outlined",label:"Apikey Secret"})}),Object(w.jsx)("div",{style:{width:"100%",padding:"10px 25%"},children:Object(w.jsx)(p.a,{style:{width:"100%"},onChange:function(e){Xe(e.target.value),Z(!e.target.value||!Ke.service.apikeyid||!Ke.service.apikeysecret)},variant:"outlined",label:"App Id"})})]}),Object(w.jsx)("div",{style:{width:"100%",padding:"20px 25%"},children:Object(w.jsx)(u.a,{onClick:function(){$e()},className:De.button2,disabled:Y,variant:"contained",color:"primary",children:Fe(f.a.finishreg)})})]})]}):"DIALOG"===(null===Me||void 0===Me?void 0:Me.typeWhatsApp)?Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.previoustext)},"mainview")}),Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:Fe(f.a.whatsapptitledialog)}),t?Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:!1,onClick:function(){Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.close)}):Object(w.jsx)(u.a,{className:De.centerbutton,variant:"contained",color:"primary",disabled:M,onClick:function(){D("viewfinishreg")},children:Fe(f.a.registerwhats)}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{className:"col-3"}),Object(w.jsx)(j.l,{onChange:function(e){return Je(e)},label:Fe(f.a.enterapikey),className:"col-6"})]})]}),"SUPERADMIN"===Pe&&t?Object(w.jsxs)("div",{style:{width:"100%",alignItems:"center",display:"flex"},children:[Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:Object(w.jsx)(u.a,{onClick:function(){ce(!0);var e=Ke;e.type="WHATSAPP",Ye(e)},className:De.button2,disabled:G,variant:"contained",color:"primary",children:Fe(f.a.activate360dialog)})}),Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:Object(w.jsx)(u.a,{onClick:function(){de(!0)},className:De.button2,disabled:G,variant:"contained",color:"primary",children:Fe(f.a.activatesmooch)})})]}):""]}):Object(w.jsx)("div",{style:{width:"100%"},children:Object(w.jsx)("div",{children:Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:500,fontSize:32,color:"#7721ad",marginBottom:10},children:Fe(f.a.brandpointcontact)}),Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:500,fontSize:16,color:"grey"},children:Fe(f.a.brandpointcontact2)}),Object(w.jsxs)("div",{style:{textAlign:"center",fontWeight:500,fontSize:32,color:"#7721ad",display:"flex"},children:[Object(w.jsx)(p.a,{className:De.fields1,variant:"outlined",margin:"normal",fullWidth:!0,size:"small",defaultValue:Ke.service.firstname,label:Fe(f.a.firstname),name:"firstname",error:!!Ge.firstname,helperText:Ge.firstname,onChange:function(e){var t=Object(r.a)({},Ke);t.service.firstname=e.target.value,Ye(t),B(!e.target.value||!Ke.service.brandname||!Ke.service.brandaddress||!Ke.service.lastname||!Ke.service.email||!Ke.service.phone||!Ke.service.customerfacebookid||!Ke.service.phonenumberwhatsappbusiness||!Ke.service.nameassociatednumber)},value:Ke.service.firstname,disabled:t}),Object(w.jsx)(p.a,{className:De.fields2,variant:"outlined",margin:"normal",fullWidth:!0,size:"small",defaultValue:Ke.service.lastname,label:Fe(f.a.lastname),name:"lastname",error:!!Ge.lastname,helperText:Ge.lastname,onChange:function(e){var t=Object(r.a)({},Ke);t.service.lastname=e.target.value,Ye(t),B(!e.target.value||!Ke.service.brandname||!Ke.service.brandaddress||!Ke.service.firstname||!Ke.service.email||!Ke.service.phone||!Ke.service.customerfacebookid||!Ke.service.phonenumberwhatsappbusiness||!Ke.service.nameassociatednumber)},value:Ke.service.lastname,disabled:t})]}),Object(w.jsxs)("div",{style:{textAlign:"center",fontWeight:500,fontSize:32,color:"#7721ad",display:"flex"},children:[Object(w.jsx)(p.a,{className:De.fields1,style:{marginBottom:0},variant:"outlined",margin:"normal",fullWidth:!0,size:"small",label:Fe(f.a.email),name:"email",defaultValue:Ke.service.email,error:!!Ge.email,helperText:Ge.email,onChange:function(e){var t=Object(r.a)({},Ke);t.service.email=e.target.value,Ye(t),B(!e.target.value||!Ke.service.brandname||!Ke.service.brandaddress||!Ke.service.firstname||!Ke.service.lastname||!Ke.service.phone||!Ke.service.customerfacebookid||!Ke.service.phonenumberwhatsappbusiness||!Ke.service.nameassociatednumber)},value:Ke.service.email,disabled:t}),Object(w.jsx)(k,{className:De.fields2,variant:"outlined",margin:"normal",size:"small",disableAreaCodes:!0,value:Ke.service.phone,error:!!Ge.phone,helperText:Ge.phone,label:Fe(f.a.phone),name:"phone",fullWidth:!0,defaultCountry:"pe",onChange:function(e){var t=Object(r.a)({},Ke);t.service.phone=e,Ye(t),B(!e||!Ke.service.brandname||!Ke.service.brandaddress||!Ke.service.firstname||!Ke.service.lastname||!Ke.service.email||!Ke.service.customerfacebookid||!Ke.service.phonenumberwhatsappbusiness||!Ke.service.nameassociatednumber)},disabled:t})]}),Object(w.jsx)("div",{style:{textAlign:"left",fontWeight:500,fontSize:12,color:"grey",marginLeft:"15px",marginBottom:"15px"},children:Fe(f.a.emailcondition)}),Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:500,fontSize:32,color:"#7721ad",marginBottom:10},children:Fe(f.a.whatsappinformation)}),Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:500,fontSize:32,color:"#7721ad",display:"flex"},children:Object(w.jsx)(p.a,{className:De.fields3,variant:"outlined",margin:"normal",fullWidth:!0,size:"small",defaultValue:Ke.service.phonenumberwhatsappbusiness,label:Fe(f.a.desiredphonenumberwhatsappbusiness),name:"phonenumberwhatsappbusiness",error:!!Ge.phonenumberwhatsappbusiness,helperText:Ge.phonenumberwhatsappbusiness,onChange:function(e){var t=Object(r.a)({},Ke);t.service.phonenumberwhatsappbusiness=e.target.value,Ye(t),B(!e.target.value||!Ke.service.brandname||!Ke.service.brandaddress||!Ke.service.firstname||!Ke.service.lastname||!Ke.service.email||!Ke.service.phone||!Ke.service.customerfacebookid||!Ke.service.nameassociatednumber)},value:Ke.service.phonenumberwhatsappbusiness,disabled:t})}),Object(w.jsxs)("div",{style:{textAlign:"left",fontWeight:500,fontSize:12,color:"grey",marginLeft:"15px",marginBottom:"15px"},children:[Fe(f.a.whatsappinformation3)+" ",Object(w.jsx)(m.a,{href:"http://africau.edu/images/default/sample.pdf",children:Fe(f.a.whatsappguidedownload)})]}),Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:500,fontSize:32,color:"#7721ad",display:"flex"},children:Object(w.jsx)(p.a,{className:De.fields3,variant:"outlined",margin:"normal",fullWidth:!0,size:"small",defaultValue:Ke.service.nameassociatednumber,label:Fe(f.a.nameassociatednumber),name:"nameassociatednumber",error:!!Ge.nameassociatednumber,helperText:Ge.nameassociatednumber,onChange:function(e){var t=Object(r.a)({},Ke);t.service.nameassociatednumber=e.target.value,Ye(t),B(!e.target.value||!Ke.service.brandname||!Ke.service.brandaddress||!Ke.service.firstname||!Ke.service.lastname||!Ke.service.email||!Ke.service.phone||!Ke.service.customerfacebookid||!Ke.service.phonenumberwhatsappbusiness)},value:Ke.service.nameassociatednumber,disabled:t})}),Object(w.jsx)("div",{style:{textAlign:"left",fontWeight:500,fontSize:12,color:"grey",marginLeft:"15px",marginBottom:"15px"},children:Fe(f.a.whatsappinformation4)}),Object(w.jsx)("div",{style:{textAlign:"left",fontWeight:500,fontSize:12,color:"grey",marginLeft:"15px",marginBottom:"15px"},children:Object(w.jsxs)("b",{children:["*",Fe(f.a.whatsappsubtitle1)]})}),Object(w.jsxs)("div",{style:{width:"100%",alignItems:"center",display:"flex"},children:[Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:t?Object(w.jsx)(u.a,{onClick:function(){Re.push(S.a.CHANNELS_ADD,Me)},className:De.button2,disabled:!1,variant:"contained",color:"primary",children:Fe(f.a.close)}):Object(w.jsx)(u.a,{onClick:function(){D("viewfinishreg")},className:De.button2,disabled:G,variant:"contained",color:"primary",children:Fe(f.a.next)})}),"SUPERADMIN"===Pe&&t?Object(w.jsxs)(l.Fragment,{children:[Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:Object(w.jsx)(u.a,{onClick:function(){ce(!0);var e=Ke;e.type="WHATSAPP",Ye(e)},className:De.button2,disabled:G,variant:"contained",color:"primary",children:Fe(f.a.activate360dialog)})}),Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:Object(w.jsx)(u.a,{onClick:function(){de(!0)},className:De.button2,disabled:G,variant:"contained",color:"primary",children:Fe(f.a.activatesmooch)})})]}):""]})]})})}):Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)("div",{style:{width:"100%"},children:Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),Re.push(S.a.CHANNELS_ADD,Me)},children:Fe(f.a.previoustext)},"mainview")})}),Object(w.jsxs)("div",{style:{width:"100%",marginTop:"20px",alignItems:"center",display:"flex"},children:[Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:Object(w.jsx)(u.a,{onClick:function(){je(!0),me(!1),ye(!1);var e=Ke;e.type="WHATSAPP",Ye(e)},className:De.button2,disabled:!1,variant:"contained",color:"primary",children:Fe(f.a.register360dialog)})}),Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:Object(w.jsx)(u.a,{onClick:function(){je(!1),me(!0),ye(!1);var e=Ke;e.type="WHATSAPPSMOOCHINSERT",Ye(e)},className:De.button2,disabled:!1,variant:"contained",color:"primary",children:Fe(f.a.registersmooch)})}),Object(w.jsx)("div",{style:{flex:"1",margin:"0px 15px"},children:Object(w.jsx)(u.a,{onClick:function(){je(!1),me(!1),ye(!0);var e=Ke;e.type="WHATSAPPGUPSHUP",Ye(e)},className:De.button2,disabled:!1,variant:"contained",color:"primary",children:Fe(f.a.registergupshup)})})]})]}):Object(w.jsxs)("div",{style:{width:"100%"},children:[Object(w.jsx)(d.a,{"aria-label":"breadcrumb",children:Object(w.jsx)(m.a,{color:"textSecondary",href:"/",onClick:function(e){e.preventDefault(),D("view1")},children:Fe(f.a.previoustext)},"mainview")}),Object(w.jsxs)("div",{children:[Object(w.jsx)("div",{style:{textAlign:"center",fontWeight:"bold",fontSize:"2em",color:"#7721ad",padding:"20px",marginLeft:"auto",marginRight:"auto",maxWidth:"800px"},children:Fe(f.a.commchannelfinishreg)}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{className:"col-3"}),Object(w.jsx)(j.l,{onChange:function(e){return function(e){x(""===e);var t=Ke;t.parameters.description=e,Ye(t)}(e)},label:Fe(f.a.givechannelname),className:"col-6",valueDefault:Ke.parameters.description})]}),Object(w.jsxs)("div",{className:"row-zyx",children:[Object(w.jsx)("div",{className:"col-3"}),Object(w.jsxs)("div",{className:"col-6",children:[Object(w.jsx)(b.a,{fontWeight:500,lineHeight:"18px",fontSize:14,mb:1,color:"textPrimary",children:Fe(f.a.givechannelcolor)}),Object(w.jsxs)("div",{style:{display:"flex",justifyContent:"space-around",alignItems:"center"},children:[Object(w.jsx)(C.rc,{style:{fill:"".concat(L),width:"100px"}}),Object(w.jsx)(j.e,{hex:Ke.parameters.coloricon,onChange:function(e){Ye((function(t){return Object(r.a)(Object(r.a)({},t),{},{parameters:Object(r.a)(Object(r.a)({},t.parameters),{},{coloricon:e.hex,color:e.hex})})})),P(e.hex)}})]})]})]}),Object(w.jsx)("div",{style:{paddingLeft:"80%"},children:Object(w.jsx)(u.a,{onClick:function(){!function(){Ze.apply(this,arguments)}()},className:De.button,disabled:o||He.loading,variant:"contained",color:"primary",children:Fe(f.a.finishreg)})})]})]})};t.default=L},781:function(e,t,a){"use strict";a.d(t,"g",(function(){return l})),a.d(t,"m",(function(){return o})),a.d(t,"a",(function(){return d})),a.d(t,"d",(function(){return u})),a.d(t,"c",(function(){return p})),a.d(t,"n",(function(){return b})),a.d(t,"t",(function(){return m})),a.d(t,"f",(function(){return h})),a.d(t,"o",(function(){return f})),a.d(t,"h",(function(){return v})),a.d(t,"p",(function(){return j})),a.d(t,"k",(function(){return x})),a.d(t,"s",(function(){return g})),a.d(t,"j",(function(){return O})),a.d(t,"r",(function(){return y})),a.d(t,"i",(function(){return S})),a.d(t,"q",(function(){return A})),a.d(t,"u",(function(){return E})),a.d(t,"b",(function(){return N})),a.d(t,"e",(function(){return C})),a.d(t,"l",(function(){return w}));var n=a(24),i=a.n(n),r=a(39),c=a(28),s=a(30),l=function(e,t){return{callAPI:function(){return c.d.getPagelist(e,t)},types:{loading:s.a.CHANNELS,success:s.a.CHANNELS_SUCCESS,failure:s.a.CHANNELS_FAILURE},type:null}},o=function(e){return{callAPI:function(){return c.d.insertchnl(e)},types:{loading:s.a.CHANNELS,success:s.a.CHANNELS_INSERTSUCCESS,failure:s.a.CHANNELS_FAILURE},type:null}},d=function(e){return{callAPI:function(){return c.d.activateChannel(e)},types:{loading:s.a.ACTIVATECHANNEL,success:s.a.ACTIVATECHANNEL_SUCCESS,failure:s.a.ACTIVATECHANNEL_FAILURE},type:null}},u=function(e){return{callAPI:function(){return c.d.deletechnl(e)},types:{loading:s.a.CHANNELS,success:s.a.CHANNELS_INSERTSUCCESS,failure:s.a.CHANNELS_FAILURE},type:null}},p=function(e){return{callAPI:function(){return c.d.checkPaymentPlan(e)},types:{loading:s.a.CHECK_PAYMENTPLAN,success:s.a.CHECK_PAYMENTPLAN_SUCCESS,failure:s.a.CHECK_PAYMENTPLAN_FAILURE},type:null}},b=function(e){return{callAPI:function(){var t=Object(r.a)(i.a.mark((function t(){var a,n,r,s,l,o,d,u,p,b,m,h;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a=e.service.interface.iconbutton,n=e.service.interface.iconheader,r=e.service.interface.iconbot,s=e.service.bubble.iconbubble,l="",o="",d="",u="",!a){t.next=14;break}return(p=new FormData).append("file",a,a.name),t.next=13,c.e.uploadFile(p);case 13:l=t.sent.data.url;case 14:if(!n){t.next=20;break}return(b=new FormData).append("file",n,n.name),t.next=19,c.e.uploadFile(b);case 19:o=t.sent.data.url;case 20:if(!r){t.next=26;break}return(m=new FormData).append("file",r,r.name),t.next=25,c.e.uploadFile(m);case 25:d=t.sent.data.url;case 26:if(!s){t.next=32;break}return(h=new FormData).append("file",s,s.name),t.next=31,c.e.uploadFile(h);case 31:u=t.sent.data.url;case 32:return e.service.interface.iconbutton=l,e.service.interface.iconheader=o,e.service.interface.iconbot=d,e.service.bubble.iconbubble=u,t.abrupt("return",c.d.insertchnl(e));case 37:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),types:{loading:s.a.INSERT_CHANNEL,failure:s.a.INSERT_CHANNEL_FAILURE,success:s.a.INSERT_CHANNEL_SUCCESS},type:null}},m=function(){return{type:s.a.INSERT_CHANNEL_RESET}},h=function(e,t){return{callAPI:function(){var a=Object(r.a)(i.a.mark((function a(){var n,r,s,l,o,d,u,p,b;return i.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if("CHAZ"!==t&&"SMOOCHANDROID"!==t){a.next=35;break}if(n=e.service,r=n.interface.iconbutton,s=n.interface.iconheader,l=n.interface.iconbot,o=n.bubble.iconbubble,!r||"object"!==typeof r){a.next=12;break}return(d=new FormData).append("file",r,r.name),a.next=11,c.e.uploadFile(d);case 11:r=a.sent.data.url;case 12:if(!s||"object"!==typeof s){a.next=18;break}return(u=new FormData).append("file",s,s.name),a.next=17,c.e.uploadFile(u);case 17:s=a.sent.data.url;case 18:if(!l||"object"!==typeof l){a.next=24;break}return(p=new FormData).append("file",l,l.name),a.next=23,c.e.uploadFile(p);case 23:l=a.sent.data.url;case 24:if(!o||"object"!==typeof o){a.next=30;break}return(b=new FormData).append("file",o,o.name),a.next=29,c.e.uploadFile(b);case 29:o=a.sent.data.url;case 30:return e.service.interface.iconbutton=r,e.service.interface.iconheader=s,e.service.interface.iconbot=l,e.service.bubble.iconbubble=o,a.abrupt("return",c.d.editchnl(e));case 35:return a.abrupt("return",c.e.main(e));case 36:case"end":return a.stop()}}),a)})));return function(){return a.apply(this,arguments)}}(),types:{loading:s.a.EDIT_CHANNEL,failure:s.a.EDIT_CHANNEL_FAILURE,success:s.a.EDIT_CHANNEL_SUCCESS},type:null}},f=function(){return{type:s.a.EDIT_CHANNEL_RESET}},v=function(e,t){return{callAPI:function(){return c.d.getPagelistSub(e,t)},types:{loading:s.a.FACEBOOK_PAGES,success:s.a.FACEBOOK_PAGES_SUCCESS,failure:s.a.FACEBOOK_PAGES_FAILURE},type:null}},j=function(){return{type:s.a.FACEBOOK_PAGES_RESET}},x=function(e,t){return{callAPI:function(){return c.d.getPagelistSub(e,t)},types:{loading:s.a.MESSENGER_PAGES,success:s.a.MESSENGER_PAGES_SUCCESS,failure:s.a.MESSENGER_PAGES_FAILURE},type:null}},g=function(){return{type:s.a.MESSENGER_PAGES_RESET}},O=function(e,t){return{callAPI:function(){return c.d.getPagelistSub(e,t)},types:{loading:s.a.INSTAGRAM_PAGES,success:s.a.INSTAGRAM_PAGES_SUCCESS,failure:s.a.INSTAGRAM_PAGES_FAILURE},type:null}},y=function(){return{type:s.a.INSTAGRAM_PAGES_RESET}},S=function(e,t){return{callAPI:function(){return c.d.getPagelistSub(e,t)},types:{loading:s.a.INSTAGRAMDM_PAGES,success:s.a.INSTAGRAMDM_PAGES_SUCCESS,failure:s.a.INSTAGRAMDM_PAGES_FAILURE},type:null}},A=function(){return{type:s.a.INSTAGRAMDM_PAGES_RESET}},E=function(e){return{callAPI:function(){return c.d.synchronizeTemplate(e)},types:{failure:s.a.SYNCHRONIZE_TEMPLATE_FAILURE,loading:s.a.SYNCHRONIZE_TEMPLATE,success:s.a.SYNCHRONIZE_TEMPLATE_SUCCESS},type:null}},N=function(e){return{callAPI:function(){return c.d.addTemplate(e)},types:{failure:s.a.ADD_TEMPLATE_FAILURE,loading:s.a.ADD_TEMPLATE,success:s.a.ADD_TEMPLATE_SUCCESS},type:null}},C=function(e){return{callAPI:function(){return c.d.deleteTemplate(e)},types:{failure:s.a.DELETE_TEMPLATE_FAILURE,loading:s.a.DELETE_TEMPLATE,success:s.a.DELETE_TEMPLATE_SUCCESS},type:null}},w=function(e){return{callAPI:function(){return c.d.getPhoneList(e)},types:{loading:s.a.PHONE_LIST,success:s.a.PHONE_LIST_SUCCESS,failure:s.a.PHONE_LIST_FAILURE},type:null}}}}]);
//# sourceMappingURL=99.9ad67e22.chunk.js.map