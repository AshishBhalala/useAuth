import t,{useCallback as e,useEffect as n}from"react";import{useService as r}from"@xstate/react";import{addSeconds as o,isAfter as i,differenceInSeconds as a}from"date-fns";import{Machine as u,assign as s,interpret as c}from"xstate";import{choose as h}from"xstate/lib/actions";import l from"auth0-js";import f from"netlify-identity-widget";function d(){return(d=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}var p=c(u({id:"useAuth",initial:"unauthenticated",context:{user:{},expiresAt:null,authResult:null,isAuthenticating:!1,error:void 0,errorType:void 0,config:{navigate:function(){return console.error("Please specify a navigation method that works with your router")},callbackDomain:"http://localhost:8000",customPropertyNamespace:"http://localhost:8000"}},states:{unauthenticated:{on:{LOGIN:"authenticating",CHECK_SESSION:"verifying",SET_CONFIG:{actions:["setConfig"]}}},authenticating:{on:{ERROR:"error",AUTHENTICATED:"authenticated",SET_CONFIG:{actions:["setConfig"]}},entry:["startAuthenticating"],exit:["stopAuthenticating"]},verifying:{invoke:{id:"checkSession",src:function(t,e){return t.config.authProvider.checkSession()},onDone:{target:"authenticated"},onError:{target:"error"}},entry:["startAuthenticating"],exit:["stopAuthenticating"]},authenticated:{on:{LOGOUT:"unauthenticated",SET_CONFIG:{actions:["setConfig"]},CHECK_SESSION:"verifying"},entry:["saveUserToContext","saveToLocalStorage"],exit:h([{cond:function(t,e){return"CHECK_SESSION"!==e.type},actions:["clearUserFromContext","clearLocalStorage"]}])},error:{entry:["saveErrorToContext","clearUserFromContext","clearLocalStorage"]}}},{actions:{startAuthenticating:s(function(t){return{isAuthenticating:!0}}),stopAuthenticating:s(function(t){return{isAuthenticating:!1}}),saveUserToContext:s(function(t,e){var n=e.data?e.data:e,r=n.authResult;return{user:n.user,authResult:r,expiresAt:o(new Date,r.expiresIn)}}),clearUserFromContext:s(function(t){return{user:{},expiresAt:null,authResult:null}}),saveToLocalStorage:function(t,e){var n=t.expiresAt,r=t.user;"undefined"!=typeof localStorage&&(localStorage.setItem("useAuth:expires_at",n?n.toISOString():"0"),localStorage.setItem("useAuth:user",JSON.stringify(r)))},clearLocalStorage:function(){"undefined"!=typeof localStorage&&(localStorage.removeItem("useAuth:expires_at"),localStorage.removeItem("useAuth:user"))},saveErrorToContext:s(function(t,e){return{errorType:e.errorType,error:e.error}}),setConfig:s(function(t,e){return{config:d({},t.config,e)}})}}));p.start(),function(t){if("undefined"!=typeof localStorage){var e=new Date(localStorage.getItem("useAuth:expires_at")||"0"),n=new Date;if(i(e,n)){var r=JSON.parse(localStorage.getItem("useAuth:user")||"{}");t("LOGIN"),t("AUTHENTICATED",{user:r,authResult:{expiresIn:a(e,n)}})}}}(p.send);var g=function(){var t=r(p),n=t[0],o=t[1],a=n.context.config,u=a.authProvider,s=a.navigate,c=a.callbackDomain,h=a.customPropertyNamespace,l=e(function(t){var e=(void 0===t?{}:t).postLoginRoute,n=void 0===e?"/":e;try{if(!u||!s||!c)return console.warn("authProvider not configured yet"),Promise.resolve();var r=function(){if("undefined"!=typeof window)return o("LOGIN"),Promise.resolve(u.handleLoginCallback(o)).then(function(t){t&&s(n)})}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},[u,s,c]),f=function(){return!(!n.context.expiresAt||!i(n.context.expiresAt,new Date))};return{isAuthenticating:n.context.isAuthenticating,isAuthenticated:f,isAuthorized:function(t){var e=Array.isArray(t)?t:[t],r=n.context.user[(h+"/user_metadata").replace(/\/+user_metadata/,"/user_metadata")];return!(!f()||!r)&&e.some(function(t){return r.roles.includes(t)})},user:n.context.user,userId:n.context.user?n.context.user.sub:null,authResult:n.context.authResult,login:function(){null==u||u.authorize()},signup:function(){null==u||u.signup()},logout:function(){null==u||u.logout(c),o("LOGOUT"),s("/")},handleAuthentication:l,dispatch:o}};function v(t,e){try{var n=t()}catch(t){return e(t)}return n&&n.then?n.then(void 0,e):n}var m=function(){function t(t){this.dispatch=t.dispatch,this.auth0=new l.WebAuth(d({},t))}var e=t.prototype;return e.authorize=function(){this.auth0.authorize()},e.signup=function(){this.auth0.authorize({mode:"signUp",screen_hint:"signup"})},e.logout=function(t){this.auth0.logout({returnTo:t})},e.handleLoginCallback=function(){try{var t=this;return Promise.resolve(new Promise(function(e,n){t.auth0.parseHash(function(n,r){try{n&&(t.dispatch("ERROR",{error:n,errorType:"authResult"}),e(!1));var o=v(function(){return Promise.resolve(t.handleAuthResult(r)).then(function(t){e(t)})},function(n){t.dispatch("ERROR",{error:n,errorType:"handleAuth"}),e(!1)});return Promise.resolve(o&&o.then?o.then(function(){}):void 0)}catch(t){return Promise.reject(t)}})}))}catch(t){return Promise.reject(t)}},e.checkSession=function(){try{var t=this;return Promise.resolve(new Promise(function(e,n){t.auth0.checkSession({},function(r,o){try{var i=function(){if(!r&&o&&o.accessToken&&o.idToken){var i=v(function(){return Promise.resolve(t.fetchUser(o)).then(function(t){e({user:t,authResult:o})})},function(t){n(t)});if(i&&i.then)return i.then(function(){})}else n(r||new Error("Session invalid"))}();return Promise.resolve(i&&i.then?i.then(function(){}):void 0)}catch(t){return Promise.reject(t)}})}))}catch(t){return Promise.reject(t)}},e.handleAuthResult=function(t){try{var e=this;return t&&t.accessToken&&t.idToken?Promise.resolve(e.fetchUser(t)).then(function(n){return e.dispatch("AUTHENTICATED",{authResult:t,user:n}),!0}):Promise.resolve(!1)}catch(t){return Promise.reject(t)}},e.fetchUser=function(t){try{var e=this;return Promise.resolve(new Promise(function(n,r){e.auth0.client.userInfo((null==t?void 0:t.accessToken)||"",function(t,e){t?r(t):n(e)})}))}catch(t){return Promise.reject(t)}},t}(),y={__proto__:null,Auth0:m,NetlifyIdentity:function(){function t(t){var e=this;this.netlifyIdentity=f,this.netlifyIdentity.init(t),this.dispatch=t.dispatch,this.netlifyIdentity.on("error",function(t){e.dispatch("ERROR",{error:t,errorType:"netlifyError"})}),this.netlifyIdentity.on("login",function(t){e.dispatch("AUTHENTICATED",{user:t,authResult:{expiresIn:7200}})}),this.netlifyIdentity.on("init",function(t){t&&(e.dispatch("LOGIN"),e.dispatch("AUTHENTICATED",{user:t,authResult:{expiresIn:7200}}))})}var e=t.prototype;return e.authorize=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("login")},e.signup=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("signup")},e.logout=function(t){this.netlifyIdentity.logout()},e.handleLoginCallback=function(t){return Promise.resolve(!0)},e.checkSession=function(){try{return Promise.resolve(this.netlifyIdentity.refresh()).then(function(){return{user:{},authResult:{}}})}catch(t){return Promise.reject(t)}},t}()},A=function(e){var r=e.children,o=e.navigate,i=e.auth0_domain,a=e.auth0_params,u=void 0===a?{}:a,s=e.customPropertyNamespace,c="undefined"!=typeof window?window.location.protocol+"//"+window.location.host:"http://localhost:8000",h={domain:i,clientID:e.auth0_client_id,redirectUri:c+"/auth0_callback",audience:"https://"+(e.auth0_audience_domain||i)+"/api/v2/",responseType:"token id_token",scope:"openid profile email"},l=g().dispatch;return n(function(){var t=new m(d({dispatch:l},h,u));l("SET_CONFIG",{authProvider:t,navigate:o,customPropertyNamespace:s,callbackDomain:c}),l("CHECK_SESSION")},[o,s,c]),t.createElement(t.Fragment,null,r)};export{A as AuthProvider,y as Providers,g as useAuth};
//# sourceMappingURL=index.module.js.map
