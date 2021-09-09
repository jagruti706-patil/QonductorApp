// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  currentEnvironment: "Local",
  offset: new Date().getTimezoneOffset(),
  version: "1.0",
  // coreServiceUrl: "http://dev75:9086/QConstrue/",
  // coreServiceUrl: "http://dev40:8080/QConstrue/",
  // coreServiceUrl: "http://testing20:8081/QConstrue/",
  coreServiceUrl: "https://qonductor-dev.myqone.com/QConstrue/",
  authServiceUrl: "https://qore-dev.myqone.com/auth/",
  // clientServiceUrl: 'http://dev40:8080/QConstrue/Client/',
  ssoServiceLoginUrl:
    "https://accounts-dev.myqone.com/#/login?continue=http://localhost:4200/puthash/setSID",
  ssoServiceLogoutUrl:
    "https://accounts-dev.myqone.com/#/logout?continue=http://localhost:4200/puthash/setSID",
  logServiceUrl: "https://qonductor-dev.myqone.com/QLogger/Logger/PostLog",
  // logServiceUrl: "https://34.95.84.115/QLogger/Logger/PostLog"
  docsServiceUrl: "https://qonductor-dev.myqone.com/edocManager/",
  archivalServiceUrl: "https://qonductor-dev.myqone.com/QArchival/",
  // docsServiceUrl: "http://dev53:8090/QonductorEdocManager/",
  qoreServiceBaseUrl: "https://qore-dev.myqone.com/",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
