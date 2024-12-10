"use strict";(self.webpackChunktrade_bo_fe=self.webpackChunktrade_bo_fe||[]).push([[929],{61949:(e,a,s)=>{s.d(a,{Z:()=>t});s(72791);var n=s(80184);const t=e=>{let{children:a,className:s="",background:t="bg-primary-100",textClassName:l="",textColor:r="bg-background-100",icon:o,iconClassName:i="",type:c="button",onClick:d}=e;return(0,n.jsxs)("button",{className:"flex justify-center items-center gap-x-[0.625rem] px-4 py-2 rounded-xl ".concat(t," ").concat(s),type:c,onClick:d,children:[o&&(0,n.jsx)("img",{src:o,className:i,alt:"BotLambotrade"}),(0,n.jsx)("p",{className:"".concat(l," ").concat(r," bg-clip-text text-transparent font-bold"),children:a})]})}},24373:(e,a,s)=>{s.d(a,{Z:()=>o});var n=s(97893),t=s(72791),l=s(52373),r=s(80184);const o=e=>{let{id:a,name:s,label:o,isLabelOutside:i=!1,placeholder:c,prefix:d,type:u="text",value:m,error:h,helperText:p,helperTextEnd:x,decimalsLimit:b=3,decimalScale:w,fixedDecimalLength:g,fullWidth:f,searchIcon:v,symbol:k,icon:N,autoComplete:j,button:y,isInputDisabled:C,searchIconClassName:Z="",containerClassName:S="",inputClassName:B="",symbolClassName:P="",helperClassName:L="",helperTextClassName:T="",helperTextEndClassName:M="",resetValue:O,onChange:V,onValueChange:_,onBlur:q,onFocus:E,onKeyDown:F,onKeyUp:K,onMouseOver:z,onMouseLeave:D}=e;const[R,U]=(0,t.useState)(!1),[A,W]=(0,t.useState)(!1),[H,I]=(0,t.useState)(!1),Q=(0,t.useRef)(null),X=H?"text":"password",G=o&&!i?"pt-[1.625rem] pb-[0.375rem]":"py-4";return(0,r.jsxs)("div",{className:"relative ".concat(f?"w-full":""," ").concat(S),children:[!!o&&i&&(0,r.jsx)("div",{className:"mb-2 cubic-bezier ssss",children:(0,r.jsx)("label",{className:"overflow-hidden text-ellipsis whitespace-nowrap small-caps",onClick:()=>{var e;null===(e=Q.current)||void 0===e||e.focus()},children:o})}),!!o&&!i&&(0,r.jsx)("label",{className:"cubic-bezier absolute left-0 top-0  ".concat(N||y?"w-[85%]":"w-[70%]"," overflow-hidden text-ellipsis whitespace-nowrap ").concat(R||m?"pl-3 pr-3 py-[0.375rem] text-xs text-ink-60":"pl-3 pr-3 py-4 text-base text-ink-40"),onClick:()=>{var e;null===(e=Q.current)||void 0===e||e.focus()},children:o}),!!v&&(0,r.jsx)("div",{className:"absolute left-3 top-[50%] translate-y-[-50%]",children:(0,r.jsx)("img",{className:"w-[1.5rem] ".concat(Z),src:v,alt:"BotLambotrade"})}),(0,r.jsxs)("div",{className:"".concat(v?"pl-10 pr-3":"pl-3 pr-3"," flex justify-between items-center gap-x-3 rounded-xl ").concat(C?"border-input-ink bg-ink-10":h?"border-input-red":R||A?"border-primary":"border-input-ink"),children:[(0,r.jsxs)("div",{className:"relative z-10 flex-grow flex justify-between items-center",children:["number"===u&&(0,r.jsx)(l.Z,{id:a,name:s,autoComplete:!0===j?"new-password":"",className:"".concat(G," w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent caret-yellow-500 focus:outline-none ").concat(R||m||!o||i?"placeholder-ink-20":"placeholder-transparent"," ").concat(B),value:m,placeholder:c,onChange:V,onValueChange:(e,a,s)=>{_&&_(e,a,s)},onBlur:e=>{q&&q(e),U(!1)},onFocus:e=>{E&&E(e),U(!0)},onKeyDown:F,onKeyUp:K,onMouseOver:e=>{z&&z(e),W(!0)},onMouseLeave:e=>{D&&D(e),W(!1)},prefix:d,disabled:C,allowNegativeValue:!1,decimalsLimit:b,decimalScale:w,fixedDecimalLength:g,disableAbbreviations:!0,decimalSeparator:".",groupSeparator:",",maxLength:13,ref:Q}),"number"!==u&&(0,r.jsx)("input",{id:a,name:s,autoComplete:!0===j?"new-password":"",className:"".concat(G," w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent caret-input focus:outline-none ").concat(R||m||!o||i?"placeholder-ink-20":"placeholder-transparent"," ").concat(B),type:"password"===u?X:u,value:m,placeholder:c,onChange:V,onBlur:e=>{q&&q(e),U(!1)},onFocus:e=>{E&&E(e),U(!0)},onKeyDown:F,onKeyUp:K,onMouseOver:e=>{z&&z(e),W(!0)},onMouseLeave:e=>{D&&D(e),W(!1)},disabled:C,ref:Q}),k&&(0,r.jsx)("span",{className:"".concat(G," ").concat(P),children:k})]}),(!!m&&O||!!N||!!y)&&(0,r.jsxs)("div",{className:"z-10 flex justify-end items-center gap-x-[1.25rem]",children:[!!m&&O&&(0,r.jsx)("div",{className:"".concat(y||N?"input-icon-seperator":""," ").concat(R||A?"opacity-100":"opacity-50"),onClick:e=>{var a;O&&(O(),null===(a=Q.current)||void 0===a||a.focus())},children:(0,r.jsx)(n.Z,{className:"w-[1.5rem] !fill-ink-60 cursor-pointer"})}),!!N&&(0,r.jsx)("div",{className:"".concat(y?"input-icon-seperator":""),children:(0,r.jsx)("img",{className:"w-[1.5rem] cursor-pointer",src:N,alt:"BotLambotrade",onClick:()=>{var e;null===(e=Q.current)||void 0===e||e.focus(),I((e=>!e))}})}),!!y&&(0,r.jsx)("div",{className:"py-[0.375rem]",children:y})]})]}),(!!p||!!x)&&(0,r.jsxs)("div",{className:"px-3 pt-2 flex justify-between ".concat(L),children:[(0,r.jsx)("p",{className:"".concat(C?"text-ink-80":h?"text-red-100":"text-ink-80"," text-sm ").concat(T),children:p}),(0,r.jsx)("p",{className:"text-ink-100 text-sm ".concat(M),children:x})]})]})}},66882:(e,a,s)=>{s.d(a,{X:()=>m});var n=s(72791),t=s(51230),l=s(97893),r=s(80184);const o={success:t.Z.toast.check,warning:t.Z.toast.warning,error:t.Z.toast.error},i={success:"text-green-100",warning:"text-yellow-100",error:"text-red-100"},c={success:"Th\xe0nh c\xf4ng",warning:"C\u1ea3nh b\xe1o",error:"Th\u1ea5t b\u1ea1i"},d=n.forwardRef(((e,a)=>{let{id:s,message:n,variant:t,closeSnackBar:d}=e;return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",{className:"flex items-center justify-between gap-x-3 p-4 rounded-3xl w-[full] md:w-[25rem] transition-all bg-dropdown toast-in-right",ref:a,children:[(0,r.jsxs)("div",{className:"flex items-center justify-between gap-x-3",children:[(0,r.jsx)("div",{className:"flex-shrink-0 p-[0.625rem] rounded-2xl bg-ink-05",children:(0,r.jsx)("img",{className:"w-8",src:t&&o[t],alt:"BotLambotrade"})}),(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"mb-1 font-bold ".concat(t&&i[t]),children:t&&c[t]}),(0,r.jsx)("p",{className:"text-ink-80 text-sm",children:n})]})]}),(0,r.jsx)("button",{onClick:d,children:(0,r.jsx)(l.Z,{className:"fill-ink-100"})})]},s)})}));var u=s(78737);const m=()=>{const{enqueueSnackbar:e,closeSnackbar:a}=(0,u.Ds)();return(0,n.useCallback)(((s,n)=>{e(s,{...n,content:e=>{const{variant:t}=n||{variant:void 0};return(0,r.jsx)(d,{id:"".concat(e),message:s,variant:t||"success",closeSnackBar:()=>{a(e)}})}})}),[a,e])}},95929:(e,a,s)=>{s.r(a),s.d(a,{default:()=>k});var n=s(80169),t=s(11611),l=s(51230),r=s(63263),o=s(61949),i=s(41916),c=s(24373),d=s(55705),u=s(66882),m=s(72791),h=s(6907),p=s(24805),x=s(57689),b=s(11087),w=s(21280),g=s(28247),f=s(81724),v=s(80184);const k=()=>{const[e,a]=(0,m.useState)(!1),[s,k]=(0,m.useState)(!1),[N,j]=(0,m.useState)(!1),y=((0,p.useMediaQuery)({query:"(max-width: 767px)"}),(0,p.useMediaQuery)({query:"(max-width: 1024px)"}),(0,w.C)((e=>e.user.isLoggedIn))),[C,Z]=(0,m.useState)(!1),S=(0,u.X)(),[B,P]=(0,m.useState)(!1),[L,T]=(0,m.useState)(!1),M=(0,x.s0)(),O=(0,w.T)(),V=(0,x.UO)(),_=(0,x.TH)(),q=()=>{P(!0)},E=()=>{P(!1),D.resetForm()},F=()=>{T(!0)},K=()=>{T(!1),R.resetForm()},z=((0,m.useCallback)((()=>{}),[]),(0,d.TA)({initialValues:{username:"",password:""},validationSchema:f.Ry({username:f.Z_().required("Vui l\xf2ng nh\u1eadp user name bot").matches(/^[a-zA-Z][_-a-zA-Z0-9@.]{5,19}$/gi,"User name bot ph\u1ea3i t\u1eeb 6 \u0111\u1ebfn 20 k\xfd t\u1ef1, b\u1eaft \u0111\u1ea7u b\u1eb1ng ch\u1eef v\xe0 kh\xf4ng ch\u1ee9a k\xfd t\u1ef1 \u0111\u1eb7c bi\u1ec7t"),password:f.Z_().min(6,"M\u1eadt kh\u1ea9u c\u1ee7a b\u1ea1n ph\u1ea3i d\xe0i \xedt nh\u1ea5t 6 k\xfd t\u1ef1").max(20,"M\u1eadt kh\u1ea9u c\u1ee7a b\u1ea1n kh\xf4ng \u0111\u01b0\u1ee3c qu\xe1 20 k\xfd t\u1ef1").required("Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u")}),onSubmit:async(e,a)=>{try{(async e=>{const a=await O((0,g.pH)(e));if(g.pH.fulfilled.match(a)){const e=a.payload;console.log("USER:",e),S("\u0110\u0103ng nh\u1eadp th\xe0nh c\xf4ng!",{variant:"success"}),M("/")}else if(console.log(a),"string"!==typeof a.payload){var s,n,t,l;const e=null===(s=a.payload)||void 0===s?void 0:s.username,r=null===(n=a.payload)||void 0===n?void 0:n.email,o=null===(t=a.payload)||void 0===t?void 0:t.password1,i=null===(l=a.payload)||void 0===l?void 0:l.non_field_errors,c=e?e[0]:r?r[0]:o?o[0]:i?i[0]:"\u0110\u0103ng nh\u1eadp t\xe0i kho\u1ea3n th\u1ea5t b\u1ea1i";S("".concat(c),{variant:"error"})}else S("\u0110\u0103ng nh\u1eadp t\xe0i kho\u1ea3n th\u1ea5t b\u1ea1i",{variant:"error"})})({username:e.username,password:e.password})}catch(s){}}})),D=(0,d.TA)({initialValues:{email:""},validationSchema:f.Ry({email:f.Z_().email("Email kh\xf4ng \u0111\xfang, vui l\xf2ng nh\u1eadp l\u1ea1i").max(50,"Email kh\xf4ng th\u1ec3 v\u01b0\u1ee3t qu\xe1 50 k\xfd t\u1ef1").required("Vui l\xf2ng nh\u1eadp email")}),onSubmit:async(e,a)=>{const s={email:e.email};r.Z.post(t.Z.resetPasswordRequest,s).then((e=>{console.log(e),E(),S("G\u1eedi y\xeau c\u1ea7u th\xe0nh c\xf4ng",{variant:"success"})})).catch((e=>{console.log(e),S("G\u1eedi y\xeau c\u1ea7u th\u1ea5t b\u1ea1i",{variant:"error"})}))}}),R=(0,d.TA)({initialValues:{newPassword:"",confirmNewPassword:"",uid:"",resetKey:""},validationSchema:f.Ry({newPassword:f.Z_().required("Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u").min(6,"M\u1eadt kh\u1ea9u c\u1ee7a b\u1ea1n ph\u1ea3i d\xe0i \xedt nh\u1ea5t 6 k\xfd t\u1ef1").max(20,"M\u1eadt kh\u1ea9u c\u1ee7a b\u1ea1n kh\xf4ng \u0111\u01b0\u1ee3c qu\xe1 20 k\xfd t\u1ef1"),confirmNewPassword:f.Z_().required("Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u").min(6,"M\u1eadt kh\u1ea9u c\u1ee7a b\u1ea1n ph\u1ea3i d\xe0i \xedt nh\u1ea5t 6 k\xfd t\u1ef1").max(20,"M\u1eadt kh\u1ea9u c\u1ee7a b\u1ea1n kh\xf4ng \u0111\u01b0\u1ee3c qu\xe1 20 k\xfd t\u1ef1").oneOf([f.iH("newPassword"),null],"M\u1eadt kh\u1ea9u ph\u1ea3i kh\u1edbp")}),onSubmit:async(e,a)=>{const s={new_password1:e.newPassword,new_password2:e.confirmNewPassword,uid:e.uid,token:e.resetKey};console.log(s),r.Z.post("".concat(t.Z.resetPasswordConfirm),s).then((e=>{K(),S("C\u1eadp nh\u1eadp m\u1eadt kh\u1ea9u th\xe0nh c\xf4ng",{variant:"success"}),M("/login")})).catch((e=>{console.log(e),S("C\u1eadp nh\u1eadp m\u1eadt kh\u1ea9u th\u1ea5t b\u1ea1i",{variant:"error"})}))}});(0,m.useEffect)((()=>{y&&C&&M("/"),Z(!0)}),[y,M,C]),(0,m.useEffect)((()=>{if(console.log(V),C||Z(!0),C&&_.pathname.includes("verify-email"))S("X\xe1c nh\u1eadn email th\xe0nh c\xf4ng",{variant:"success"}),M("/login",{replace:!0});else if(C&&V.uid&&V.reset_key){console.log(V);const e=V.uid,a=V.reset_key;R.setFieldValue("uid",e),R.setFieldValue("resetKey",a),F()}}),[S,C,_.pathname,M,V]);return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(h.ql,{children:(0,v.jsx)("title",{children:"BotLambotrade | Login"})}),(0,v.jsx)("div",{className:"relative min-h-[100vh] w-full bg-login-mobile-background xl:bg-login-background bg-cover bg-no-repeat",children:(0,v.jsxs)("div",{className:"absolute xl:top-[19%] 2xl:top-[23%] xl:left-[17.2%] left-[50%] translate-x-[-50%] bottom-[1rem] xl:bottom-[unset] p-6 xl:p-0 xl:translate-x-0 w-[calc(100%-2rem)] md:w-[calc(100%-10rem)] xl:w-[28.875rem] bg-background-80 xl:bg-transparent rounded-3xl",children:[(0,v.jsx)("h1",{className:"mb-8 bg-primary-100 bg-clip-text text-transparent text-3.5xl font-semibold",children:"\u0110\u0103ng nh\u1eadp"}),(0,v.jsx)(c.Z,{id:"username",name:"username",label:"user name bot",type:"username",fullWidth:!0,isLabelOutside:!0,value:z.values.username,onChange:z.handleChange,onBlur:z.handleBlur,error:z.touched.username&&Boolean(z.errors.username),helperText:z.touched.username&&z.errors.username,containerClassName:"mb-4"}),(0,v.jsx)(c.Z,{id:"password",name:"password",type:"password",label:"m\u1eadt kh\u1ea9u",fullWidth:!0,isLabelOutside:!0,value:z.values.password,onChange:z.handleChange,onBlur:z.handleBlur,error:z.touched.password&&Boolean(z.errors.password),helperText:z.touched.password&&z.errors.password,icon:l.Z.input.eye,containerClassName:"mb-4"}),(0,v.jsx)("div",{className:"flex justify-end mb-8",children:(0,v.jsx)("button",{onClick:()=>{q()},className:"text-transparent cursor-pointer bg-primary-100 bg-clip-text",children:"Qu\xean m\u1eadt kh\u1ea9u?"})}),(0,v.jsx)("button",{className:"w-full p-4 mb-8 text-center bg-primary-100 rounded-2xl",onClick:()=>z.handleSubmit(),children:(0,v.jsx)("p",{className:"font-semibold text-transparent bg-background-100 bg-clip-text",children:"\u0110\u0103ng nh\u1eadp"})}),(0,v.jsx)("div",{className:"text-center",children:(0,v.jsxs)("p",{children:["Ch\u01b0a c\xf3 t\xe0i kho\u1ea3n"," ",(0,v.jsx)(b.rU,{className:"text-transparent bg-primary-100 bg-clip-text",to:"/register",children:"\u0110\u0103ng k\xfd"})," ","t\u1ea1i \u0111\xe2y"]})})]})}),(0,v.jsx)(i.Z,{isOpen:B,handleOpen:q,handleClose:E,children:(0,v.jsxs)("div",{className:"absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl",children:[(0,v.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-ink-10",children:[(0,v.jsx)("h3",{className:"text-xl font-semibold text-ink-100",children:"Qu\xean m\u1eadt kh\u1ea9u"}),(0,v.jsx)(n.Z,{className:"cursor-pointer",onClick:E})]}),(0,v.jsxs)("div",{className:"flex flex-col px-6 pt-6 pb-8",children:[(0,v.jsx)("p",{className:"mb-6 text-ink-80",children:"Vui l\xf2ng nh\u1eadp email \u0111\u0103ng nh\u1eadp t\xe0i kho\u1ea3n"}),(0,v.jsx)(c.Z,{id:"email",name:"email",label:"email",type:"email",fullWidth:!0,isLabelOutside:!0,value:D.values.email,onChange:D.handleChange,onBlur:D.handleBlur,error:D.touched.email&&Boolean(D.errors.email),helperText:D.touched.email&&D.errors.email,helperTextEnd:"".concat(D.values.email.length,"/50"),containerClassName:"mb-12"}),(0,v.jsx)("div",{className:"items-center justify-center gap-4",children:(0,v.jsx)(o.Z,{className:"w-full py-4",textClassName:"font-bold",onClick:()=>{D.handleSubmit()},children:"Ti\u1ebfp t\u1ee5c"})})]})]})}),(0,v.jsx)(i.Z,{isOpen:L,handleOpen:F,handleClose:K,children:(0,v.jsxs)("div",{className:"absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100vw-2rem)] md:w-[31.25rem] bg-background-80 rounded-3xl",children:[(0,v.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-ink-10",children:[(0,v.jsx)("h3",{className:"text-xl font-semibold text-ink-100",children:"\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u"}),(0,v.jsx)(n.Z,{className:"cursor-pointer",onClick:K})]}),(0,v.jsxs)("div",{className:"flex flex-col px-6 pt-6 pb-8",children:[(0,v.jsx)("p",{className:"mb-6 text-ink-80",children:"Vui l\xf2ng c\xe0i \u0111\u1eb7t m\u1eadt kh\u1ea9u truy c\u1eadp t\xe0i kho\u1ea3n"}),(0,v.jsx)(c.Z,{id:"newPassword",name:"newPassword",type:"password",label:"m\u1eadt kh\u1ea9u m\u1edbi",fullWidth:!0,isLabelOutside:!0,value:R.values.newPassword,onChange:R.handleChange,onBlur:R.handleBlur,error:R.touched.newPassword&&Boolean(R.errors.newPassword),helperText:R.touched.newPassword&&R.errors.newPassword,helperTextEnd:"".concat(R.values.newPassword.length,"/20"),icon:l.Z.input.eye,containerClassName:"mb-6"}),(0,v.jsx)(c.Z,{id:"confirmNewPassword",name:"confirmNewPassword",type:"password",label:"m\u1eadt kh\u1ea9u m\u1edbi",fullWidth:!0,isLabelOutside:!0,value:R.values.confirmNewPassword,onChange:R.handleChange,onBlur:R.handleBlur,error:R.touched.confirmNewPassword&&Boolean(R.errors.confirmNewPassword),helperText:R.touched.confirmNewPassword&&R.errors.confirmNewPassword,helperTextEnd:"".concat(R.values.confirmNewPassword.length,"/20"),icon:l.Z.input.eye,containerClassName:"mb-12"}),(0,v.jsx)("div",{className:"items-center justify-center gap-4",children:(0,v.jsx)(o.Z,{className:"w-full py-4",textClassName:"font-bold",type:"submit",onClick:()=>{R.handleSubmit()},children:"X\xe1c nh\u1eadn"})})]})]})})]})}},80169:(e,a,s)=>{s.d(a,{Z:()=>l});var n=s(74223),t=s(80184);const l=(0,n.Z)((0,t.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"}),"CloseOutlined")}}]);
//# sourceMappingURL=929.7f601759.chunk.js.map