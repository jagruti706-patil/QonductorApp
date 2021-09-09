export class Login {}

export class User {
  nuserid: number;
  sloginname: string;
  spassword: string;
  sfirstname: string;
  smiddlename: string;
  slastname: string;
  sgender: string;
  dob: string;
  createby: number;
  createduserid: number;
  userroles: any;
  username: string;
}

export class UserLogin {
  sloginname: string;
  srolename: string;
  nuserid: number;
  nroleid: number;
}

export class UserDetails {
  username: string;
  password: string;
}

export class AuthUserDetails {
  userid: number;
  firstname: string;
  lastname: string;
  username: string;
  loginemailid: string;
  token: string;
  roles: Roles[] = [];
  groups: string[];
  applications: Application[] = [];
  defaultnavigation: string;
  gcpuserid: number;
  grouplist: Groups;
  groupids: string;
}

export class Groups {
  groupid: string;
  groupname: string;
  groupcode: string;
}
export class Roles {
  roleid: number;
  rolename: string;
}

export class Application {
  applicationcode: number;
  applicationname: string;
}

export class GCPUser {
  ngcpuserid: number;
  userid: string;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  homephone: string;
  email: string;
  birthdate: string;
  gender: string;
  isactive: string;
  isclientadmin: string;
  issuperadmin: string;
  published: string;
  updated: string;
  username: string;
  displayname: string;
  initials: string = "";
  pendingtask: number = 0;
  workavg: number = 0;
  errorrate: number = 0;
  rating: number = 0;
  roleid: number;
  rolename: string;
  // "userid": "1032",
  // "firstname": "Ami",
  // "lastname": "Thomas",
  // "mobilenumber": null,
  // "homephone": null,
  // "email": null,
  // "birthdate": null,
  // "gender": null,
  // "isactive": null,
  // "isclientadmin": null,
  // "issuperadmin": null,
  // "published": null,
  // "updated": null
}

export class Logindetails {
  nloginid: number;
  loginuserid: number;
  loginusername: string;
  loginstatus: string;
  logindatetime: string;
  logoutdatetime: string;
}
export class BrowserIpDetails {
  clientip: string;
  country: string;
  countryCode: string;
  continent: string;
  region: string;
  city: string;
}

export class ChangePassword {
  // {
  //   "bisdefaultpassword": true,
  //   "bispasswordchange": true,
  //   "createdon": "2019-07-03T09:03:51.859Z",
  //   "modifiedon": "2019-07-03T09:03:51.859Z",
  //   "ngcpuserid": 0,
  //   "nhistoryid": 0,
  //   "userid": "string"
  // }
  nhistoryid: number;
  userid: string;
  ngcpuserid: number;
  bisdefaultpassword: boolean;
  bispasswordchange: boolean;
  createdon: string;
  modifiedon: string;
}
export class ReleaseInfo {
  createdon: string;
  doclocation: string;
  docname: string;
  nloginid: number;
  releasedate: string;
  releaseid: string;
  releasenotesflag: boolean;
  releaseversion: string;
}
export class SaveUserLoginResponse {
  releaseflag: ReleaseInfo;
  releaseinfo: ReleaseInfo[];
}
