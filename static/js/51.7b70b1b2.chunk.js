(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[51],{1051:function(e,t,n){"use strict";n.r(t),n.d(t,"useStyles",(function(){return q})),n.d(t,"Copyright",(function(){return K}));var a=n(1),r=n(20),i=n(0),o=n.n(i),s=n(169),c=n(94),l=n(101),u=n(51),d=n(102),b=n(378),f=n(257),p=n(816),j=n.n(p),g=n(839),m=n.n(g),O=n(716),h=n(1150),x=n(156),v=n(25),y=n(171),w=n(209),C=n(40),S=n(159),_=n(7),k=n(46),E=n(122),A=n(718),L=n(8),I=n(799),R=n.n(I),W=n(964),N=n.n(W),P=n(963),G=n.n(P),M=n(37),D=n(44),F=n(14),T=n(16),V=n(205),z=n(48),H=n(859),U=n(2),q=Object(s.a)((function(e){return{paper:{display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},containerLogin:{height:"100vh",display:"flex",alignItems:"center"},form:{width:"100%",marginTop:e.spacing(1)},submit:{margin:e.spacing(3,0,2)},progress:{margin:e.spacing(2,"auto",3),display:"block"},alert:{display:"inline-flex",width:"100%"},alertheader:{display:"inline-flex",width:"100%",marginTop:e.spacing(1)},childContainer:{display:"flex",flexDirection:"column",width:"100%"},buttonGoogle:{"& button":{width:"100%",justifyContent:"center"}},paswordCondition:{textAlign:"center"},badge:{paddingRight:"0.6em",paddingLeft:"0.6em",borderRadius:"10rem",display:"inline-block",padding:"0.25em 0.4em",fontSize:"75%",fontWeight:"bold",lineHeight:"1",textAlign:"center",whiteSpace:"nowrap",verticalAlign:"baseline",marginLeft:"10px"},badgeSuccess:{color:"#fff",backgroundColor:"#28a745"},badgeFailure:{color:"#fff",backgroundColor:"#fb5f5f"}}})),B=function(){window.open("/privacy","_blank")};function K(){var e=Object(E.a)().t;return Object(U.jsxs)(i.Fragment,{children:[Object(U.jsxs)(d.a,{variant:"body2",color:"textPrimary",align:"center",children:["Copyright \xa9 "," Laraigo ",(new Date).getFullYear()]}),Object(U.jsx)(d.a,{variant:"body2",color:"textPrimary",align:"center",children:Object(U.jsx)("a",{rel:"noopener noreferrer",style:{fontWeight:"bold",color:"#6F1FA1",cursor:"pointer"},onClick:B,children:e(L.a.privacypoliciestitle)})})]})}var J=function(e){var t,n=e.openModal,a=e.setOpenModal,s=e.onTrigger,c=Object(C.c)(),l=Object(E.a)().t,u=Object(v.b)((function(e){return e.subscription.requestRecoverPassword})),d=Object(i.useState)(!1),b=Object(r.a)(d,2),f=b[0],p=b[1],j=Object(V.d)({defaultValues:{username:""}}),g=j.register,m=j.handleSubmit,O=j.setValue,h=j.getValues,x=j.formState.errors;o.a.useEffect((function(){g("username",{validate:function(e){return e&&e.length>0||""+l(L.a.field_required)}})}),[g]),Object(i.useEffect)((function(){f&&(u.loading||u.error?u.error&&(c(Object(D.e)({show:!0,severity:"error",message:l(u.msg||"error_unexpected_db_error")})),c(Object(D.d)(!1)),p(!1)):(c(Object(D.e)({show:!0,severity:"success",message:l(u.msg||"success")})),c(Object(D.d)(!1)),p(!1),s()))}),[u,f]);var y=m((function(e){c(Object(D.a)({visible:!0,question:l(L.a.recoverpasswordconfirmation),callback:function(){c(Object(H.b)(e)),c(Object(D.d)(!0)),p(!0)}}))}));return Object(U.jsx)(z.g,{open:n,title:l(L.a.recoverpasswordtitle),buttonText1:l(L.a.cancel),buttonText2:l(L.a.recoverpasswordbutton),handleClickButton1:function(){return a(!1)},handleClickButton2:y,button2Type:"submit",children:Object(U.jsx)(z.l,{label:l(L.a.billingusername),valueDefault:h("username"),error:null===x||void 0===x||null===(t=x.username)||void 0===t?void 0:t.message,onChange:function(e){return O("username",e)},className:"col-12"})})};t.default=function(){var e=Object(E.a)().t,t=Object(C.c)(),n=q(),o=Object(k.g)(),s=Object(k.h)(),d=Object(v.b)((function(e){return e.login.login})),p=Object(i.useState)({username:"",password:""}),g=Object(r.a)(p,2),I=g[0],W=g[1],P=Object(i.useState)(!1),V=Object(r.a)(P,2),z=V[0],H=V[1],B=Object(i.useState)(!1),X=Object(r.a)(B,2),Y=X[0],Q=X[1];return Object(i.useEffect)((function(){var e=s.state||{};(null===e||void 0===e?void 0:e.showSnackbar)&&t(Object(D.e)({show:!0,severity:"success",message:(null===e||void 0===e?void 0:e.message)||""}))}),[s]),Object(i.useEffect)((function(){Object(_.Gb)()?o.push("/"):localStorage.removeItem("firstLoad")}),[]),Object(i.useEffect)((function(){!d.error&&d.user&&Object(_.Gb)()&&(t(Object(M.f)(d.user.automaticConnection)),localStorage.setItem("firstLoad","1"),window.open(d.user.redirect?d.user.redirect:"/supervisor","_self"))}),[d]),Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)("meta",{name:"google-signin-client_id",content:F.a.GOOGLECLIENTID_LOGIN}),Object(U.jsx)("script",{src:"https://apis.google.com/js/platform.js",async:!0,defer:!0}),Object(U.jsxs)(h.a,{component:"main",maxWidth:"xs",className:n.containerLogin,children:[Object(U.jsxs)("div",{className:n.childContainer,children:[Object(U.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:Object(U.jsx)(T.vb,{style:{height:200}})}),Object(U.jsxs)("div",{className:n.paper,children:[Object(U.jsx)(J,{openModal:z,setOpenModal:H,onTrigger:function(){H(!1)}}),d.error&&Object(U.jsx)(O.a,{className:n.alertheader,variant:"filled",severity:"error",children:e(d.code||"error_unexpected_error")}),Object(U.jsxs)("form",{className:n.form,onSubmit:function(e){e.preventDefault(),t(Object(S.b)(I.username,I.password))},children:[Object(U.jsx)(l.a,{variant:"outlined",margin:"normal",fullWidth:!0,required:!0,value:I.username,onChange:function(e){return W((function(t){return Object(a.a)(Object(a.a)({},t),{},{username:e.target.value.trim()})}))},label:e(L.a.username),name:"usr"}),Object(U.jsx)(l.a,{variant:"outlined",margin:"normal",fullWidth:!0,required:!0,label:e(L.a.password),name:"password",type:Y?"text":"password",autoComplete:"current-password",value:I.password,onChange:function(e){return W((function(t){return Object(a.a)(Object(a.a)({},t),{},{password:e.target.value.trim()})}))},InputProps:{endAdornment:Object(U.jsx)(b.a,{position:"end",children:Object(U.jsx)(f.a,{"aria-label":"toggle password visibility",onClick:function(){return Q(!Y)},onMouseDown:function(e){return e.preventDefault()},edge:"end",children:Y?Object(U.jsx)(j.a,{}):Object(U.jsx)(m.a,{})})})}}),d.loading?Object(U.jsx)(y.a,{className:n.progress}):Object(U.jsxs)("div",{style:{alignItems:"center"},children:[Object(U.jsx)(c.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:n.submit,children:Object(U.jsx)(A.a,{i18nKey:L.a.logIn})}),Object(U.jsx)(R.a,{appId:F.a.FACEBOOKAPP,callback:function(e){e&&e.id&&t(Object(S.b)(null,null,e.id))},buttonStyle:{borderRadius:"3px",height:"48px",display:"flex",alignItems:"center",fontSize:"14px",fontStyle:"normal",fontWeight:600,textTransform:"none",justifyContent:"center",width:"100%",marginBottom:"16px"},textButton:e(L.a.login_with_facebook),icon:Object(U.jsx)(N.a,{style:{color:"white",marginRight:"8px"}}),disableMobileRedirect:!0}),Object(U.jsx)("div",{className:n.buttonGoogle,children:Object(U.jsx)(G.a,{clientId:F.a.GOOGLECLIENTID_LOGIN,buttonText:e(L.a.login_with_google),style:{justifyContent:"center",width:"100%"},onSuccess:function(e){e&&e.googleId&&t(Object(S.b)(null,null,null,e.googleId))},onFailure:function(e){if(console.warn("GOOGLE LOGIN FAILURE: "+JSON.stringify(e)),e&&e.error)switch(e.error){case"idpiframe_initialization_failed":case"popup_closed_by_user":break;default:alert(e.error)}},cookiePolicy:"single_host_origin",accessType:"online",autoLoad:!1})})]}),Object(U.jsx)(x.a,{container:!0,children:Object(U.jsxs)(x.a,{item:!0,children:[Object(U.jsxs)("p",{children:[Object(U.jsx)(A.a,{i18nKey:L.a.newRegisterMessage}),Object(U.jsx)("span",{style:{fontWeight:"bold",color:"#6F1FA1",cursor:"pointer"},onClick:function(){window.open("https://laraigo.com/en/#pricetable","_self")},children:e(L.a.newRegisterMessage2)})]}),Object(U.jsxs)("p",{children:[Object(U.jsx)(A.a,{i18nKey:L.a.recoverpassword1}),Object(U.jsx)("span",{style:{fontWeight:"bold",color:"#6F1FA1",cursor:"pointer"},onClick:function(){H(!0)},children:e(L.a.recoverpassword2)})]})]})})]})]}),Object(U.jsx)(u.a,{mt:8,children:Object(U.jsx)(K,{})})]}),Object(U.jsx)(w.a,{})]})]})}},1150:function(e,t,n){"use strict";var a=n(4),r=n(11),i=n(31),o=n(0),s=(n(5),n(9)),c=n(15),l=n(21),u=o.forwardRef((function(e,t){var n=e.classes,i=e.className,c=e.component,u=void 0===c?"div":c,d=e.disableGutters,b=void 0!==d&&d,f=e.fixed,p=void 0!==f&&f,j=e.maxWidth,g=void 0===j?"lg":j,m=Object(r.a)(e,["classes","className","component","disableGutters","fixed","maxWidth"]);return o.createElement(u,Object(a.a)({className:Object(s.default)(n.root,i,p&&n.fixed,b&&n.disableGutters,!1!==g&&n["maxWidth".concat(Object(l.a)(String(g)))]),ref:t},m))}));t.a=Object(c.a)((function(e){return{root:Object(i.a)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",paddingLeft:e.spacing(2),paddingRight:e.spacing(2),display:"block"},e.breakpoints.up("sm"),{paddingLeft:e.spacing(3),paddingRight:e.spacing(3)}),disableGutters:{paddingLeft:0,paddingRight:0},fixed:Object.keys(e.breakpoints.values).reduce((function(t,n){var a=e.breakpoints.values[n];return 0!==a&&(t[e.breakpoints.up(n)]={maxWidth:a}),t}),{}),maxWidthXs:Object(i.a)({},e.breakpoints.up("xs"),{maxWidth:Math.max(e.breakpoints.values.xs,444)}),maxWidthSm:Object(i.a)({},e.breakpoints.up("sm"),{maxWidth:e.breakpoints.values.sm}),maxWidthMd:Object(i.a)({},e.breakpoints.up("md"),{maxWidth:e.breakpoints.values.md}),maxWidthLg:Object(i.a)({},e.breakpoints.up("lg"),{maxWidth:e.breakpoints.values.lg}),maxWidthXl:Object(i.a)({},e.breakpoints.up("xl"),{maxWidth:e.breakpoints.values.xl})}}),{name:"MuiContainer"})(u)},816:function(e,t,n){"use strict";var a=n(45),r=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=r(n(0)),o=(0,a(n(62)).default)(i.createElement("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"}),"Visibility");t.default=o},839:function(e,t,n){"use strict";var a=n(45),r=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=r(n(0)),o=(0,a(n(62)).default)(i.createElement("path",{d:"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"}),"VisibilityOff");t.default=o},859:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return o})),n.d(t,"c",(function(){return s}));var a=n(28),r=n(89),i=function(e){return{callAPI:function(){return a.l.recoverPassword(e)},types:{failure:r.a.RECOVER_PASSWORD_FAILURE,loading:r.a.RECOVER_PASSWORD,success:r.a.RECOVER_PASSWORD_SUCCESS},type:null}},o=function(e){return{callAPI:function(){return a.l.changePassword(e)},types:{failure:r.a.CHANGE_PASSWORD_FAILURE,loading:r.a.CHANGE_PASSWORD,success:r.a.CHANGE_PASSWORD_SUCCESS},type:null}},s=function(e){return{callAPI:function(){return a.l.validateChannels(e)},types:{failure:r.a.VALIDATE_CHANNELS_FAILURE,loading:r.a.VALIDATE_CHANNELS,success:r.a.VALIDATE_CHANNELS_SUCCESS},type:null}}},964:function(e,t,n){"use strict";var a=n(45),r=n(61);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=r(n(0)),o=(0,a(n(62)).default)(i.createElement("path",{d:"M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"}),"Facebook");t.default=o}}]);
//# sourceMappingURL=51.7b70b1b2.chunk.js.map