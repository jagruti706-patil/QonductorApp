export const environment = {
  production: true,
  currentEnvironment: "QA",
  offset: new Date().getTimezoneOffset(),
  version: "1.0",
  // coreServiceUrl: "http://dev75:9086/QConstrue/",
  // coreServiceUrl: "http://testing28:8090/QConstrue/",
  // coreServiceUrl: "http://qonductor.myqone.com/QConstrue/", //Dev GCP URL
  coreServiceUrl: "https://qonductor-qa.myqone.com/QConstrue/", //Testing GCP URL
  // coreServiceUrl: "http://dev40:8080/QConstrue/",
  authServiceUrl: "https://qore-qa.myqone.com/auth/",
  ssoServiceLoginUrl:
    "https://accounts-qa.myqone.com/#/login?continue=https://qonductor-qa.myqone.com/puthash/setSID",
  ssoServiceLogoutUrl:
    "https://accounts-qa.myqone.com/#/logout?continue=https://qonductor-qa.myqone.com/puthash/setSID",
  // clientServiceUrl: 'http://dev40:8080/QConstrue/Client/',
  logServiceUrl: "https://qonductor-dev.myqone.com/QLogger/Logger/PostLog",
  docsServiceUrl: "https://qonductor-qa.myqone.com/edocManager/",
  archivalServiceUrl: "https://qonductor-qa.myqone.com/QArchival/",
  qoreServiceBaseUrl: "https://qore-qa.myqone.com/",
};
