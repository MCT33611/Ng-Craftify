import{a as A}from"./chunk-BWDK4YJ7.js";import{a as $}from"./chunk-74CHJCYH.js";import{B as M,C as q,G as D,I as L,J as G,M as Q,N as B,P as z,n as F,p as R,x as N,z as a}from"./chunk-WEBSOFYO.js";import{$b as j,Ab as s,Ba as V,Fb as C,Ib as d,Kb as x,Pb as T,Qb as S,Rb as P,Tb as v,V as b,Vb as E,Wa as m,Xa as h,f as O,ja as I,nb as w,pb as y,ra as p,rb as k,sa as c,ub as _,zb as r}from"./chunk-JPTIIQB7.js";var U=["otpInput"];function Z(n,l){n&1&&(r(0,"span",12),v(1," OTP must not contain characters "),s())}function H(n,l){n&1&&(r(0,"span",12),v(1," OTP is not valid "),s())}function J(n,l){if(n&1&&(r(0,"p",17),v(1),s()),n&2){let g=x();m(),E(" Resend OTP in ",g.countdown," seconds ")}}function K(n,l){if(n&1){let g=C();r(0,"a",18),d("click",function(){p(g);let e=x();return c(e.resendOTP())}),v(1,"Resend OTP"),s()}if(n&2){let g=x();k("disabled",!g.canResendOTP)}}var ue=(()=>{let l=class l{constructor(t,e,i,o,f){this._fb=t,this._auth=e,this._router=i,this._route=o,this._alert=f,this.countdown=60,this.isCountdownActive=!1,this.canResendOTP=!1,this.isInValid=!1,this.email=null,this.otpVerified=new V,this.isEmailFromParams=!1,this.destroy$=new O,this.otpForm=this._fb.group({otp1:["",[a.required,a.maxLength(1)]],otp2:["",[a.required,a.maxLength(1)]],otp3:["",[a.required,a.maxLength(1)]],otp4:["",[a.required,a.maxLength(1)]]})}ngOnInit(){this.startCountdown(),this.email?(this.sendOtp(),this.isEmailFromParams=!1):this._route.paramMap.pipe(b(this.destroy$)).subscribe(t=>{this.email=t.get("email"),this.email?(this.sendOtp(),this.isEmailFromParams=!0):(this._alert.error("OTP sender: email is undefined!"),this._router.navigate(["/auth/sign-up"]))})}sendOtp(){this.email&&this._auth.sentOtp(this.email).pipe(b(this.destroy$)).subscribe({complete:()=>this._alert.success("Please check your mailbox"),error:t=>{this._alert.error(`${t.status}: ${t.error.title}`),this._router.navigate(["/auth/sign-up"])}})}onInputChange(t,e){let o=t.target.value;o&&e<this.otpInputs.length-1&&this.otpInputs.toArray()[e+1].nativeElement.focus(),!o&&e>0&&t.key==="Backspace"&&this.otpInputs.toArray()[e-1].nativeElement.focus(),this.isInValid=!1}onSubmit(){if(this.otpForm.valid&&this.email){let t=Object.values(this.otpForm.value).join("");this._auth.confirmEmail(t,this.email).pipe(b(this.destroy$)).subscribe({complete:()=>{this.isEmailFromParams?this._router.navigate(["/auth/sign-in"]):this.otpVerified.emit(!0)},error:e=>{this.otpVerified.emit(!1),this._alert.error(`${e.status}: ${e.error.title}`),console.log(e)}})}}startCountdown(){this.countdown=60,this.isCountdownActive=!0,this.canResendOTP=!1,this.clearCountdownInterval(),this.countdownInterval=window.setInterval(()=>{this.countdown>0?this.countdown--:(this.clearCountdownInterval(),this.isCountdownActive=!1,this.canResendOTP=!0)},1e3)}clearCountdownInterval(){this.countdownInterval&&clearInterval(this.countdownInterval)}resendOTP(){this.canResendOTP&&(this.startCountdown(),this.sendOtp())}containsCharacters(t){return/[a-zA-Z]/.test(t)}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete(),this.clearCountdownInterval()}};l.\u0275fac=function(e){return new(e||l)(h(B),h(A),h(R),h(F),h($))},l.\u0275cmp=I({type:l,selectors:[["app-otp"]],viewQuery:function(e,i){if(e&1&&T(U,5),e&2){let o;S(o=P())&&(i.otpInputs=o)}},inputs:{email:"email"},outputs:{otpVerified:"otpVerified"},standalone:!0,features:[j],decls:27,vars:5,consts:[["otpInput",""],[1,"w-full","h-screen","flex","items-center","justify-center"],[1,"flex","items-center","justify-center"],[1,"otp-verification"],[3,"ngSubmit","formGroup"],[1,"otp-inputs","flex","flex-col","space-y-16","mb-6"],[1,"flex","flex-row","items-center","justify-between","mx-auto","w-full","max-w-xs","gap-3"],[1,"w-16","h-16"],["formControlName","otp1","type","text","maxlength","1","placeholder","*",1,"w-full","h-full","flex","flex-col","items-center","justify-center","text-center","px-5","outline-none","rounded-xl","border-2","border-violet-700-200","text-lg","bg-white","focus:bg-gray-50","focus:ring-1","ring-blue-700",3,"keyup"],["formControlName","otp2","type","text","maxlength","1","placeholder","*",1,"w-full","h-full","flex","flex-col","items-center","justify-center","text-center","px-5","outline-none","rounded-xl","border-2","border-violet-200","text-lg","bg-white","focus:bg-gray-50","focus:ring-1","ring-blue-700",3,"keyup"],["formControlName","otp3","type","text","maxlength","1","placeholder","*",1,"w-full","h-full","flex","flex-col","items-center","justify-center","text-center","px-5","outline-none","rounded-xl","border-2","border-violet-200","text-lg","bg-white","focus:bg-gray-50","focus:ring-1","ring-blue-700",3,"keyup"],["formControlName","otp4","type","text","maxlength","1","placeholder","*",1,"w-full","h-full","flex","flex-col","items-center","justify-center","text-center","px-5","outline-none","rounded-xl","border-2","border-violet-200","text-lg","bg-white","focus:bg-gray-50","focus:ring-1","ring-blue-700",3,"keyup"],[1,"text-red-600","font-normal"],[1,"flex","justify-between"],["type","submit",1,"btn","overflow-hidden","relative","w-30","bg-blue-500","text-white","py-4","px-4","rounded-xl","font-bold","uppercase","--","before:block","before:absolute","before:h-full","before:w-1/2","before:rounded-full","before:bg-violet-400","before:top-0","before:left-1/4","before:transition-transform","before:opacity-0","before:hover:opacity-100","hover:text-violet-200","hover:before:animate-ping","transition-all","duration-300",3,"disabled"],[1,"relative"],[1,"flex","flex-col"],[1,"countdown-timer"],[3,"click"]],template:function(e,i){if(e&1){let o=C();r(0,"div",1)(1,"div",2)(2,"div",3)(3,"form",4),d("ngSubmit",function(){return p(o),c(i.onSubmit())}),r(4,"div",5)(5,"div",6)(6,"div",7)(7,"input",8,0),d("keyup",function(u){return p(o),c(i.onInputChange(u,0))}),s()(),r(9,"div",7)(10,"input",9,0),d("keyup",function(u){return p(o),c(i.onInputChange(u,1))}),s()(),r(12,"div",7)(13,"input",10,0),d("keyup",function(u){return p(o),c(i.onInputChange(u,2))}),s()(),r(15,"div",7)(16,"input",11,0),d("keyup",function(u){return p(o),c(i.onInputChange(u,3))}),s()()()(),w(18,Z,2,0,"span",12)(19,H,2,0,"span",12),r(20,"div",13)(21,"button",14)(22,"span",15),v(23,"verify"),s()(),r(24,"div",16),w(25,J,2,1,"p",17)(26,K,2,2),s()()()()()()}e&2&&(m(3),y("formGroup",i.otpForm),m(15),_(18,i.containsCharacters(i.otpForm.value.otp4)?18:-1),m(),_(19,i.isInValid?19:-1),m(2),y("disabled",!i.otpForm.valid),m(4),_(25,i.isCountdownActive?25:26))},dependencies:[z,D,N,M,q,Q,L,G],styles:["input[type=number][_ngcontent-%COMP%]::-webkit-inner-spin-button, input[type=number][_ngcontent-%COMP%]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}"]});let n=l;return n})();export{ue as a};
