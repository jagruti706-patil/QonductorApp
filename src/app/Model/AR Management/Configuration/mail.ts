export class MailSave {
  configid: number;
  title: string;
  emailfrom: string;
  frompassword: string;
  emailto: MailInput[];
  emailcc: MailInput[];
  userid: number;
  username: string;
  createdon: string;
  modifiedon: string;
  sendsms: boolean = false;
}

export class MailTitle {
  configid: number;
  title: string;
  emailfrom: string;
  frompassword: string;
  emailto: MailInput[];
  emailcc: MailInput[];
  emailsubject: string;
  emailbody: string;
  userid: number;
  username: string;
  createdon: string;
  modifiedon: string;
}

export class MailRetrive {
  configid: number;
  title: string;
  emailfrom: string;
  frompassword: string;
  emailto: MailInput[];
  emailcc: MailInput[];
  semailto: string[] = [];
  semailcc: string[] = [];
  userid: number;
  username: string;
  emailsubject: string;
  emailbody: string;
  createdon: string;
  modifiedon: string;
  filelocation: string;
  sendsms: boolean = false;
}
export class MailSend {
  // public ResponseEntity<?> sendMailWithAttchment(@RequestParam(name = "FromEmail") String FromEmail,
  // @RequestParam(name = "FromPassword") String FromPassword,
  // @RequestParam(name = "To") String To,
  // 		@RequestParam(name = "Body") String Body,
  // @RequestParam(name = "Subject") String Subject,
  // 		@RequestParam(name = "Cc", required = false) String Cc,
  // 		@RequestParam(name = "file", required = false) MultipartFile file) {
  FromEmail: string;
  FromPassword: string;
  To: string;
  Body: string;
  Cc: string;
  Subject: string;
  // file: FormData;
  // fileLocation: string;
}
export class MailInput {
  Id: number;
  Email: string;
}
