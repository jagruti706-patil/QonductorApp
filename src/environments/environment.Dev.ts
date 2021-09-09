export const environment = {
  production: true,
  currentEnvironment: "Development",
  offset: new Date().getTimezoneOffset(),
  version: "1.0",
  // coreServiceUrl: "http://dev75:9086/QConstrue/",
  // coreServiceUrl: "http://testing28:8090/QConstrue/",
  // coreServiceUrl: "https://qonductor-dev.myqone.com/QConstrue/", //Dev GCP URL
  coreServiceUrl: "https://qonductor-dev.myqone.com/QConstrue/", //Dev GCP URL
  // coreServiceUrl: "http://34.96.103.54/QConstrue/", //Testing GCP URL
  // coreServiceUrl: "http://dev40:8080/QConstrue/",
  authServiceUrl: "https://qore-dev.myqone.com/auth/",
  ssoServiceLoginUrl:
    "https://accounts-dev.myqone.com/#/login?continue=https://qonductor-dev.myqone.com/puthash/setSID",
  ssoServiceLogoutUrl:
    "https://accounts-dev.myqone.com/#/logout?continue=https://qonductor-dev.myqone.com/puthash/setSID",
  // clientServiceUrl: 'http://dev40:8080/QConstrue/Client/',
  logServiceUrl: "https://qonductor-dev.myqone.com/QLogger/Logger/PostLog",
  docsServiceUrl: "https://qonductor-dev.myqone.com/edocManager/",
  archivalServiceUrl: "https://qonductor-dev.myqone.com/QArchival/",
  qoreServiceBaseUrl: "https://qore-dev.myqone.com/",
};
