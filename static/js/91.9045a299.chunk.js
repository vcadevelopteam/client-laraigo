(this["webpackJsonpclient-laraigo"]=this["webpackJsonpclient-laraigo"]||[]).push([[91],{1046:function(e,t,n){"use strict";var a=n(0),o=n(43);t.a=Object(o.a)(a.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),"Add")},1090:function(e,t,n){"use strict";n.r(t),n.d(t,"LayoutItem",(function(){return G}));var a=n(1091),o=n(26),i=n(1),c=n(20),l=n(169),r=n(51),u=n(94),d=n(452),s=n(102),v=n(101),f=n(257),b=n(171),p=n(10),m=n(48),j=n(0),g=n(46),h=n(1007),O=n.n(h),y=n(122),x=n(718),D=n(8),E=n(1081),A=n(1082),S=n(1046),T=n(850),_=n(205),C=n(40),k=n(83),w=n(7),L=n(25),R=n(301),N=n(44),H=n(881),B=n(2),I=Object(h.WidthProvider)(O.a),P=Object(l.a)((function(e){return{root:{display:"flex",flexDirection:"column",width:"100%"},dragDropContextRow:{display:"flex",flexDirection:"row",minHeight:500},droppableColumn:{display:"flex",flexDirection:"column",height:"100%"},droppableContainer:{display:"flex",backgroundColor:"red",color:"white",flexDirection:"column",height:"inherit",width:250},item:{backgroundColor:"blue",color:"white"},layout:{backgroundColor:"inherit",width:"100%"},header:{display:"flex",flexDirection:"row",gap:"1em"}}})),V=Object(l.a)((function(e){return{root:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",maxWidth:"80%",maxHeight:"80%",width:"80%",backgroundColor:"white",padding:"16px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"1em"}}})),M=function(e){var t=e.open,n=e.loading,a=e.defaultDescription,o=void 0===a?"":a,i=e.onClose,l=e.onSubmit,f=V(),b=Object(y.a)().t,p=Object(j.useState)(o),m=Object(c.a)(p,2),g=m[0],h=m[1];return Object(B.jsx)(d.a,{open:t,onClose:function(e,t){n||i()},"aria-labelledby":"dashboard-submit-modal-title","aria-describedby":"dashboard-submit-modal-description",children:Object(B.jsxs)(r.a,{className:f.root,children:[Object(B.jsx)(s.a,{id:"dashboard-submit-modal-title",variant:"h6",component:"h2",children:Object(B.jsx)(x.a,{i18nKey:D.a.description})}),Object(B.jsx)(v.a,{id:"dashboard-submit-modal-description",placeholder:b(D.a.enterDashboardDescription),value:g,onChange:function(e){return h(e.target.value)},InputProps:{readOnly:n}}),Object(B.jsx)(u.a,{variant:"contained",color:"primary",disabled:n||0===g.length,onClick:function(){return l(g)},children:Object(B.jsx)(x.a,{i18nKey:D.a.save})})]})})},F=Object(l.a)((function(e){return{root:{width:"inherit",height:"inherit",padding:"1em",display:"flex",overflow:"hidden",justifyContent:"center",alignItems:"center",minWidth:"unset",minHeight:"unset"},addIcon:{width:42,height:42}}})),U=function(e){var t=e.onClick,n=F();return Object(B.jsx)(u.a,{className:n.root,onClick:t,children:Object(B.jsx)(S.a,{color:"primary",className:n.addIcon})})},z=Object(l.a)((function(e){return{root:{backgroundColor:"white",width:"inherit",height:"inherit",padding:"1em",display:"block",overflow:"auto",position:"relative"},deleteBtn:{position:"absolute",top:1,right:1},funnelLvlTitle:{display:"flex",justifyContent:"space-between"},field:{marginBottom:"0.65rem"}}})),G=function(e){var t,n,a,l,r,d,s,v,b,p,g,h,O,x,E,A,_,C,k=e.layoutKey,w=e.edit,L=e.loading,N=void 0!==L&&L,H=e.templates,I=void 0===H?[]:H,P=e.kpis,V=void 0===P?[]:P,M=e.tags,F=void 0===M?[]:M,U=e.errors,G=e.getValues,J=e.setValue,K=e.register,q=e.unregister,W=e.onDelete,Y=z(),Q=Object(y.a)().t,X=Object(j.useState)(-1),Z=Object(c.a)(X,2),$=Z[0],ee=Z[1],te=Object(j.useState)(""),ne=Object(c.a)(te,2),ae=ne[0],oe=ne[1],ie=Object(j.useState)(G("".concat(k,".tags"))||[]),ce=Object(c.a)(ie,2),le=ce[0],re=ce[1],ue=Object(j.useState)([]),de=Object(c.a)(ue,2),se=de[0],ve=de[1];Object(j.useEffect)((function(){if(!1!==w){var e=G("".concat(k,".reporttemplateid"));void 0===e&&null===e||ee(I.findIndex((function(t){return t.reporttemplateid===e})));var t=G("".concat(k,".contentType"));void 0===t&&null===t||oe(t);G("".concat(k,".contentType"))}}),[w,G]),Object(j.useEffect)((function(){return K("".concat(k,".description"),{validate:me,value:G("".concat(k,".description"))||""}),K("".concat(k,".contentType"),{validate:pe,value:G("".concat(k,".contentType"))||""}),function(){q(k)}}),[K,q,Q,k]),Object(j.useEffect)((function(){"report"===ae?(q("".concat(k,".kpiid")),K("".concat(k,".reporttemplateid"),{validate:fe,value:G("".concat(k,".reporttemplateid"))||0}),K("".concat(k,".grouping"),{validate:me,value:G("".concat(k,".grouping"))||""}),K("".concat(k,".graph"),{validate:me,value:G("".concat(k,".graph"))||""}),K("".concat(k,".column"),{validate:be,value:G("".concat(k,".column"))||""}),K("".concat(k,".summarizationfunction")),K("".concat(k,".interval"),{value:G("".concat(k,".interval"))})):"kpi"===ae?(q("".concat(k,".reporttemplateid")),q("".concat(k,".grouping")),q("".concat(k,".graph")),q("".concat(k,".column")),K("".concat(k,".kpiid"),{validate:je,value:G("".concat(k,".kpiid"))||0})):"funnel"===ae&&(q("".concat(k,".kpiid")),q("".concat(k,".grouping")),q("".concat(k,".graph")),K("".concat(k,".reporttemplateid"),{validate:fe,value:G("".concat(k,".reporttemplateid"))||0}),K("".concat(k,".column"),{validate:be,value:G("".concat(k,".column"))||""}),K("".concat(k,".tags")))}),[ae,se,I]),Object(j.useEffect)((function(){if(-1!==$){var e=JSON.parse(I[$].columnjson),t=JSON.parse(I[$].summaryjson).map((function(t){var n;return{alias:"".concat(Q(D.a.summarization)," - ").concat(null===e||void 0===e||null===(n=e.find((function(e){return e.columnname===t.columnname})))||void 0===n?void 0:n.alias," (").concat(Q("function_"+t.function),")"),columnname:"".concat(t.columnname).concat(t.function),description:t.columnname,descriptionT:t.columnname,disabled:!1,join_alias:null,join_on:null,join_table:null,tablename:"",type:t.type,function:t.function}}));ve(t.concat(e))}else ve([])}),[$,I]);var fe=function(e){if(0===e||!I.some((function(t){return t.reporttemplateid===e})))return Q(D.a.field_required)},be=function(e){if(!e||0===e.length||!se.some((function(t){return t.columnname===e})))return Q(D.a.field_required)},pe=function(e){return e&&0!==e.length?"report"!==e&&"kpi"!==e&&"funnel"!==e?Q(D.a.invalidEntry):void 0:Q(D.a.field_required)},me=function(e){return e&&0!==e.length?void 0:Q(D.a.field_required)},je=function(e){return 0===e?Q(D.a.field_required):void 0};return Object(B.jsxs)("div",{className:Y.root,children:[Object(B.jsx)(f.a,{className:Y.deleteBtn,onClick:W,size:"small",children:Object(B.jsx)(T.a,{style:{width:18,height:18}})}),Object(B.jsx)(m.l,{className:Y.field,valueDefault:G("".concat(k,".description")),label:Q(D.a.title),disabled:N,error:null===(t=U[k])||void 0===t||null===(n=t.description)||void 0===n?void 0:n.message,onChange:function(e){return J("".concat(k,".description"),e)}}),Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.contentType),data:R.a,optionDesc:"key",optionValue:"key",valueDefault:G("".concat(k,".contentType")),onChange:function(e){var t=(null===e||void 0===e?void 0:e.key)||"";J("".concat(k,".contentType"),t),oe(t)},error:null===(a=U[k])||void 0===a||null===(l=a.contentType)||void 0===l?void 0:l.message,disabled:N,uset:!0,prefixTranslation:"dashboard_contentType_"}),"kpi"===ae&&Object(B.jsx)(m.u,{className:Y.field,label:"KPI",data:V,optionDesc:"kpiname",optionValue:"id",valueDefault:G("".concat(k,".kpiid")),onChange:function(e){return J("".concat(k,".kpiid"),(null===e||void 0===e?void 0:e.id)||0)},error:null===(r=U[k])||void 0===r||null===(d=r.kpiid)||void 0===d?void 0:d.message,disabled:N}),"report"===ae&&Object(B.jsxs)(B.Fragment,{children:[Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.report),data:I,optionDesc:"description",optionValue:"reporttemplateid",valueDefault:G("".concat(k,".reporttemplateid")),onChange:function(e){var t=(null===e||void 0===e?void 0:e.reporttemplateid)||0;J("".concat(k,".reporttemplateid"),t),0===t&&J("".concat(k,".column"),""),ee(e?I.findIndex((function(t){return t===e})):-1)},error:null===(s=U[k])||void 0===s||null===(v=s.reporttemplateid)||void 0===v?void 0:v.message,disabled:N}),Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.groupment),data:R.c,optionDesc:"key",optionValue:"key",valueDefault:G("".concat(k,".grouping")),onChange:function(e){J("".concat(k,".grouping"),(null===e||void 0===e?void 0:e.key)||""),J("".concat(k,".interval"),"")},error:null===(b=U[k])||void 0===b||null===(p=b.grouping)||void 0===p?void 0:p.message,disabled:N,uset:!0,prefixTranslation:"dashboard_groupment_"}),Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.chartType),data:R.b,optionDesc:"key",optionValue:"key",valueDefault:G("".concat(k,".graph")),onChange:function(e){J("".concat(k,".graph"),(null===e||void 0===e?void 0:e.key)||""),J("".concat(k,".interval"),"")},error:null===(g=U[k])||void 0===g||null===(h=g.graph)||void 0===h?void 0:h.message,disabled:N,uset:!0,prefixTranslation:"dashboard_chartType_"}),("bar"===G("".concat(k,".graph"))||"line"===G("".concat(k,".graph")))&&Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.displayinterval),data:[{key:"day",desc:Q(D.a.day)},{key:"week",desc:Q(D.a.week)},{key:"month",desc:Q(D.a.month)}],optionDesc:"desc",optionValue:"key",valueDefault:G("".concat(k,".interval")),onChange:function(e){return J("".concat(k,".interval"),(null===e||void 0===e?void 0:e.key)||"")},disabled:N}),Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.column),data:se,optionDesc:"alias",optionValue:"columnname",valueDefault:"".concat(G("".concat(k,".column"))).concat(G("".concat(k,".summarizationfunction"))||""),onChange:function(e){var t,n;(null===e||void 0===e?void 0:e.function)?J("".concat(k,".column"),null===e||void 0===e||null===(t=e.columnname)||void 0===t?void 0:t.slice(0,-((null===e||void 0===e||null===(n=e.function)||void 0===n?void 0:n.length)||0))):J("".concat(k,".column"),(null===e||void 0===e?void 0:e.columnname)||"");J("".concat(k,".summarizationfunction"),(null===e||void 0===e?void 0:e.function)||"")},error:null===(O=U[k])||void 0===O||null===(x=O.column)||void 0===x?void 0:x.message,disabled:N||0===se.length})]}),"funnel"===ae&&Object(B.jsxs)(B.Fragment,{children:[Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.report),data:I,optionDesc:"description",optionValue:"reporttemplateid",valueDefault:G("".concat(k,".reporttemplateid")),onChange:function(e){var t=(null===e||void 0===e?void 0:e.reporttemplateid)||0;J("".concat(k,".reporttemplateid"),t),0===t&&J("".concat(k,".column"),""),ee(e?I.findIndex((function(t){return t===e})):-1)},error:null===(E=U[k])||void 0===E||null===(A=E.reporttemplateid)||void 0===A?void 0:A.message,disabled:N}),Object(B.jsx)(m.u,{className:Y.field,label:Q(D.a.column),data:se.filter((function(e){return e.columnname.includes("tag")})),optionDesc:"alias",optionValue:"columnname",valueDefault:"".concat(G("".concat(k,".column"))).concat(G("".concat(k,".summarizationfunction"))||""),onChange:function(e){var t,n;(null===e||void 0===e?void 0:e.function)?J("".concat(k,".column"),null===e||void 0===e||null===(t=e.columnname)||void 0===t?void 0:t.slice(0,-((null===e||void 0===e||null===(n=e.function)||void 0===n?void 0:n.length)||0))):J("".concat(k,".column"),(null===e||void 0===e?void 0:e.columnname)||"");J("".concat(k,".summarizationfunction"),(null===e||void 0===e?void 0:e.function)||"")},error:null===(_=U[k])||void 0===_||null===(C=_.column)||void 0===C?void 0:C.message,disabled:N||0===se.length}),Object(B.jsx)(B.Fragment,{children:le.map((function(e,t){var n,a,o,c,l,r,u,d;return Object(B.jsxs)("div",{children:[Object(B.jsxs)("div",{className:Y.funnelLvlTitle,children:[Object(B.jsxs)("p",{style:{fontSize:14,fontWeight:500},children:[Q(D.a.level)," ",t+1]}),Object(B.jsx)(f.a,{onClick:function(){return function(e){var t=le.filter((function(t,n){return n!==e}));re(t),J("".concat(k,".tags"),t)}(t)},size:"small",style:{width:18,height:18,margin:14,marginRight:0},children:Object(B.jsx)(T.a,{style:{width:18,height:18}})})]}),Object(B.jsxs)("div",{style:{paddingLeft:40},children:[Object(B.jsx)(m.u,{fregister:Object(i.a)({},K("".concat(k,".tags[").concat(t,"].value"),{validate:function(e){return e&&e.length||Q(D.a.field_required)}})),className:Y.field,label:Q(D.a.value),data:F,optionDesc:"tag",optionValue:"tag",valueDefault:G("".concat(k,".tags[").concat(t,"].value")),onChange:function(e){var n=G("".concat(k,".tags"))||[];n[t].value=(null===e||void 0===e?void 0:e.tag)||"";var a=le;a[t].value=(null===e||void 0===e?void 0:e.tag)||"",re(a),J("".concat(k,".tags"),n)},error:null===(n=U[k])||void 0===n||null===(a=n.tags)||void 0===a||null===(o=a[t])||void 0===o||null===(c=o.value)||void 0===c?void 0:c.message}),Object(B.jsx)(m.l,{fregister:Object(i.a)({},K("".concat(k,".tags[").concat(t,"].title"),{validate:function(e){return e&&e.length||Q(D.a.field_required)}})),label:"".concat(Q(D.a.title)," ").concat(Q(D.a.level)," ").concat(t+1),valueDefault:G("".concat(k,".tags[").concat(t,"].title")),className:Y.field,onChange:function(e){var n=G("".concat(k,".tags"))||[];n[t].title=e||"";var a=le;a[t].title=e||"",re(a),J("".concat(k,".tags"),n)},error:null===(l=U[k])||void 0===l||null===(r=l.tags)||void 0===r||null===(u=r[t])||void 0===u||null===(d=u.title)||void 0===d?void 0:d.message})]})]},"tagdatalevel".concat(t+1))}))}),Object(B.jsxs)(u.a,{style:{float:"right"},onClick:function(){var e=G("".concat(k,".tags"))||[];re([].concat(Object(o.a)(e),[{value:"",title:""}])),J("".concat(k,".tags"),[].concat(Object(o.a)(e),[{value:"",title:""}]))},children:[Object(B.jsx)(S.a,{})," ",Q(D.a.add)," ",Q(D.a.level)]})]})]})},J=function(){return Object(B.jsx)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"},children:Object(B.jsx)(b.a,{})})};t.default=function(e){var t=e.edit,n=void 0!==t&&t,l=Object(y.a)().t,d=Object(g.j)(),s=Object(g.h)(),v=P(),f=Object(C.c)(),b=Object(g.g)(),h=Date.now().toString(),O=Object(j.useState)(!1),S=Object(c.a)(O,2),T=S[0],R=S[1],V=Object(j.useState)([{i:"add-btn-layout",x:3,y:0,w:3,h:2,minW:2,minH:1,isResizable:!1,isDraggable:!1,static:!1},{i:h,x:0,y:0,w:3,h:2,minW:2,minH:1,static:!1}]),F=Object(c.a)(V,2),z=F[0],K=F[1],q=Object(L.b)((function(e){return e.main.multiData})),W=Object(L.b)((function(e){return e.dashboard.dashboardtemplateSave})),Y=Object(L.b)((function(e){return e.dashboard.dashboardtemplate}));Object(j.useEffect)((function(){if(!0!==n||s.state)!0===n&&s.state?f(Object(H.i)(Object(i.a)(Object(i.a)({},s.state),{},{description:"".concat(s.state.description,"-v1"),dashboardtemplateid:0}))):!0!==n||s.state||Number(d.params.id)||b.push(p.a.DASHBOARD);else{var e=d.params.id;f(Object(H.c)(Object(w.Dc)(e)))}return f(Object(k.p)([Object(w.je)(),Object(w.id)(),Object(w.se)()])),function(){f(Object(k.y)()),f(Object(k.C)()),f(Object(H.g)())}}),[n,s.state,d.params.id,f]),Object(j.useEffect)((function(){if(!q.loading&&q.error){var e=l(q.code||"error_unexpected_error",{module:l(D.a.user).toLocaleLowerCase()});f(Object(N.e)({message:e,severity:"error",show:!0}))}}),[q,l,f]),Object(j.useEffect)((function(){if(!W.loading)if(W.error){var e=l(W.code||"error_unexpected_error",{module:l(D.a.dashboard).toLocaleLowerCase()});f(Object(N.e)({message:e,severity:"error",show:!0}))}else!0===W.success&&(f(Object(N.e)({message:"Se guard\xf3 el dashboard",severity:"success",show:!0})),b.push(p.a.DASHBOARD))}),[W,b,l,f]),Object(j.useEffect)((function(){if(!1!==n&&!Y.loading)if(Y.error){var e=l(Y.code||"error_unexpected_error",{module:l(D.a.user).toLocaleLowerCase()});f(Object(N.e)({message:e,severity:"error",show:!0}))}else Y.value&&(K((function(e){return[Object(i.a)(Object(i.a)({},e[0]),{},{x:3*(e.length-1)%12+3,y:1/0})].concat(Object(o.a)(JSON.parse(Y.value.layoutjson)))})),ae(JSON.parse(Y.value.detailjson)))}),[Y,n,l,f]);var Q=Object(_.d)({defaultValues:{}}),X=Q.register,Z=Q.unregister,$=Q.formState.errors,ee=Q.getValues,te=Q.setValue,ne=Q.handleSubmit,ae=Q.reset,oe=function(){var e=Date.now().toString();K((function(t){var n=[].concat(Object(o.a)(t),[{i:e,x:3*(t.length-1)%12,y:1/0,w:3,h:2,minW:2,minH:1,static:!1}]),a="add-btn-layout"===n[0].i&&n[0];return a&&(n[0]=Object(i.a)(Object(i.a)({},a),{},{x:3*(t.length-1)%12+3,y:1/0})),n}))},ie=Object(j.useCallback)((function(e){if(!0!==n||Y.value){var t=ee(),o=Object(a.a)(z).slice(1);f(Object(H.h)(Object(w.Cc)({id:n?Y.value.dashboardtemplateid:0,description:e,detailjson:JSON.stringify(t),layoutjson:JSON.stringify(o),status:"ACTIVO",type:"NINGUNO",operation:n&&0!==Y.value.dashboardtemplateid?"UPDATE":"INSERT"})))}}),[n,Y,z,ee,f]);return!0!==n||!Y.loading&&Y.value?Object(B.jsxs)(r.a,{className:v.root,children:[Object(B.jsx)(m.L,{breadcrumbs:[{id:"view-1",name:"Dashboards"},{id:"view-2",name:l(n?D.a.edit_custom_dashboard:D.a.create_custom_dashboard)}],handleClick:function(e){return"view-1"===e&&b.push(p.a.DASHBOARD)}}),Object(B.jsxs)("div",{className:v.header,children:[Object(B.jsx)(m.R,{title:n?Y.value.description:l(D.a.newDashboard)}),Object(B.jsx)("div",{style:{flexGrow:1}}),Object(B.jsx)(u.a,{variant:"contained",type:"button",color:"primary",startIcon:Object(B.jsx)(E.a,{color:"secondary"}),style:{backgroundColor:"#FB5F5F"},onClick:function(){return b.push(p.a.DASHBOARD)},children:Object(B.jsx)(x.a,{i18nKey:D.a.back})}),Object(B.jsx)(u.a,{variant:"contained",color:"primary",onClick:function(){z.length<=1?f(Object(N.e)({message:l(D.a.empty_dashboard_form_error),severity:"error",show:!0})):ne((function(e){R(!0)}),(function(e){return console.warn("errores",e)}))()},disabled:Y.loading,style:{backgroundColor:"#55BD84"},startIcon:Object(B.jsx)(A.a,{color:"secondary"}),children:Object(B.jsx)(x.a,{i18nKey:D.a.save})})]}),Object(B.jsx)("div",{style:{height:"1em"}}),function(){var e,t;return!q.loading&&"UFN_REPORTTEMPLATE_SEL"===(null===(e=q.data[0])||void 0===e?void 0:e.key)&&"UFN_KPI_LST"===(null===(t=q.data[1])||void 0===t?void 0:t.key)}()?Object(B.jsx)(I,{className:v.layout,layout:z,onLayoutChange:K,cols:12,rowHeight:140,children:z.map((function(e){return"add-btn-layout"===e.i?Object(B.jsx)("div",{children:Object(B.jsx)(U,{onClick:oe})},e.i):Object(B.jsx)("div",{children:Object(B.jsx)(G,{edit:n,layoutKey:e.i,templates:q.data[0].data,kpis:q.data[1].data,tags:q.data[2].data,loading:q.loading,register:X,unregister:Z,getValues:ee,setValue:te,errors:$,onDelete:function(){return t=e.i,void K((function(e){return e.filter((function(e){return e.i!==t}))}));var t}})},e.i)}))}):Object(B.jsx)(J,{}),Object(B.jsx)(M,{defaultDescription:!1===n?"":Y.value.description,open:T,loading:W.loading,onClose:function(){return R(!1)},onSubmit:ie})]}):Object(B.jsx)(J,{})}},881:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"e",(function(){return c})),n.d(t,"c",(function(){return l})),n.d(t,"i",(function(){return r})),n.d(t,"f",(function(){return u})),n.d(t,"h",(function(){return d})),n.d(t,"g",(function(){return s})),n.d(t,"a",(function(){return v})),n.d(t,"d",(function(){return f}));var a=n(28),o=n(74),i=function(e){return{callAPI:function(){return a.g.getDashboard({parameters:e})},types:{loading:o.a.GET_DASHBOARD,success:o.a.GET_DASHBOARD_SUCCESS,failure:o.a.GET_DASHBOARD_FAILURE},type:null}},c=function(){return{type:o.a.GET_DASHBOARD_RESET}},l=function(e){return{callAPI:function(){return a.e.main(e)},types:{loading:o.a.GET_DASHBOARDTEMPLATE,success:o.a.GET_DASHBOARDTEMPLATE_SUCCESS,failure:o.a.GET_DASHBOARDTEMPLATE_FAILURE},type:null}},r=function(e){return{payload:e,type:o.a.SET_DASHBOARDTEMPLATE}},u=function(){return{type:o.a.GET_DASHBOARDTEMPLATE_RESET}},d=function(e){return{callAPI:function(){return a.e.main(e)},types:{loading:o.a.SAVE_DASHBOARDTEMPLATE,success:o.a.SAVE_DASHBOARDTEMPLATE_SUCCESS,failure:o.a.SAVE_DASHBOARDTEMPLATE_FAILURE},type:null}},s=function(){return{type:o.a.SAVE_DASHBOARDTEMPLATE_RESET}},v=function(e){return{callAPI:function(){return a.e.main(e)},types:{loading:o.a.DELETE_DASHBOARDTEMPLATE,success:o.a.DELETE_DASHBOARDTEMPLATE_SUCCESS,failure:o.a.DELETE_DASHBOARDTEMPLATE_FAILURE},type:null}},f=function(){return{type:o.a.DELETE_DASHBOARDTEMPLATE_RESET}}}}]);
//# sourceMappingURL=91.9045a299.chunk.js.map