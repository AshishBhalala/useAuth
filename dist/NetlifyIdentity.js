var t,e=(t=require("netlify-identity-widget"))&&"object"==typeof t&&"default"in t?t.default:t;exports.NetlifyIdentity=function(){function t(t){var n=this;this.dispatch=t.dispatch,this.netlifyIdentity=e,this.netlifyIdentity.init(t),this.netlifyIdentity.on("error",function(t){n.dispatch("ERROR",{error:t,errorType:"netlifyError"})}),this.netlifyIdentity.on("login",function(t){var e;n.dispatch("AUTHENTICATED",{user:t,authResult:{expiresIn:null==(e=t.token)?void 0:e.expires_in}})}),this.netlifyIdentity.on("init",function(t){var e;t&&(n.dispatch("LOGIN"),n.dispatch("AUTHENTICATED",{user:t,authResult:{expiresIn:null==(e=t.token)?void 0:e.expires_in}}))})}t.addDefaultParams=function(t,e){return void 0===t&&(t={}),t};var n=t.prototype;return n.authorize=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("login")},n.signup=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("signup")},n.logout=function(t){this.netlifyIdentity.logout()},n.handleLoginCallback=function(t){try{return console.warn("handleLoginCallback is unnecessary with Netlify Identity Widget"),Promise.resolve(!0)}catch(t){return Promise.reject(t)}},n.checkSession=function(){try{var t=this,e=function(e){var n,i=t.netlifyIdentity.currentUser();if(i)return{user:i,authResult:{expiresIn:null==(n=i.token)?void 0:n.expires_in}};throw new Error("Session invalid")},n=function(e,n){try{var i=Promise.resolve(t.netlifyIdentity.refresh()).then(function(){})}catch(t){return n()}return i&&i.then?i.then(void 0,n):i}(0,function(){throw new Error("Session invalid")});return Promise.resolve(n&&n.then?n.then(e):e())}catch(t){return Promise.reject(t)}},n.userId=function(t){return t.id},n.userRoles=function(t){return t.app_metadata.roles},t}();
//# sourceMappingURL=NetlifyIdentity.js.map
