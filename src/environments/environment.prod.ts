export const environment = {
  production: true,
  currentEnvironment: "Production",
  offset: new Date().getTimezoneOffset(),
  version: "1.0",
  // coreServiceUrl: "http://dev75:9086/QConstrue/",
  // coreServiceUrl: "http://testing28:8090/QConstrue/",
  coreServiceUrl: "https://qonductor.myqone.com/QConstrue/", //Dev GCP URL
  // coreServiceUrl: "http://34.96.103.54/QConstrue/", //Testing GCP URL
  // coreServiceUrl: "http://dev40:8080/QConstrue/",
  // authServiceUrl: "https://qore-dev.myqone.com/auth/",
  authServiceUrl: "https://qore.myqone.com/auth/",
  ssoServiceLoginUrl:
    "https://accounts.myqone.com/#/login?continue=https://qonductor.myqone.com/puthash/setSID",
  ssoServiceLogoutUrl:
    "https://accounts.myqone.com/#/logout?continue=https://qonductor.myqone.com/puthash/setSID",
  // clientServiceUrl: 'http://dev40:8080/QConstrue/Client/',
  logServiceUrl: "https://qonductor.myqone.com/QLogger/Logger/PostLog",
  docsServiceUrl: "https://qonductor.myqone.com/edocManager/",
  archivalServiceUrl: "https://qonductor.myqone.com/QArchival/",
  qoreServiceBaseUrl: "https://qore.myqone.com/",
};
