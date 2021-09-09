// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  currentEnvironment: "Staging",
  offset: new Date().getTimezoneOffset(),
  version: "1.0",
  // coreServiceUrl: "http://dev75:9086/QConstrue/",
  // coreServiceUrl: "http://dev40:8080/QConstrue/",
  // coreServiceUrl: "http://qonductor-dev.myqone.com/QConstrue/",
  coreServiceUrl: "https://qonductor-staging.myqone.com/QConstrue/",
  authServiceUrl: "https://qore-staging.myqone.com/auth/",
  ssoServiceLoginUrl:
    "https://accounts-staging.myqone.com/#/login?continue=https://qonductor-staging.myqone.com/puthash/setSID",
  ssoServiceLogoutUrl:
    "https://accounts-staging.myqone.com/#/logout?continue=https://qonductor-staging.myqone.com/puthash/setSID",
  // clientServiceUrl: 'http://dev40:8080/QConstrue/Client/',
  logServiceUrl: "https://qonductor-dev.myqone.com/QLogger/Logger/PostLog",
  docsServiceUrl: "https://qonductor-staging.myqone.com/edocManager/",
  archivalServiceUrl: "https://qonductor-staging.myqone.com/QArchival/",
  qoreServiceBaseUrl: "https://qore-staging.myqone.com/",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
