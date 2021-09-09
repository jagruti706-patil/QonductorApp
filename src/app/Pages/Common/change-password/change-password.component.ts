import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as CryptoJS from "crypto-js";
import { Utility } from "src/app/Model/utility";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { SubSink } from "../../../../../node_modules/subsink";
import { CoreauthService } from "../../Services/Common/coreauth.service";
import { ChangePassword } from "src/app/Model/Common/login";
import { CustomValidator2 } from "src/app/Model/Common/custom-validator2";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  frmsignup: FormGroup;
  isLoading = false;
  isaddmode: boolean = true;
  result: any;
  public loginUserid: string = "";
  public loginGCPUserid: number = 0;
  public defultPasswordChange: boolean = false;
  public userloggedin: boolean = false;
  public moodleuserid: string = "";
  upqcollege: any;
  getqcollegedata: any;
  getuser: any;
  clsUtility: Utility;
  cancelLink: string;
  private subscription = new SubSink();
  constructor(
    fb: FormBuilder,
    private _Router: Router,
    private toastr: ToastrService,
    private _routeParams: ActivatedRoute,
    private dataservice: DataTransferService,
    private authservice: CoreauthService
  ) {
    this.clsUtility = new Utility();
    this.frmsignup = fb.group(
      {
        olduser_pass: ["", Validators.required],
        userpass: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            CustomValidator2.cannotContainspace,
          ]),
        ],
        reuser_pass: ["", Validators.required],
      },
      {
        validator: Validators.compose([
          CustomValidator2.userpasswordsShouldMatch2,
          CustomValidator2.oldandnewpasswordcannotbesame,
        ]),
      }
    );
  }

  ngOnInit() {
    // this.globalSettings.userid.subscribe(value => (this.userid = value));
    // this.globalSettings.isuserloggedin.subscribe(
    //   value => (this.userloggedin = value)
    // );
    this.subscription.add(
      this.dataservice.ChangePassword.subscribe(
        (changepassword) => (this.defultPasswordChange = changepassword)
      )
    );
    this.subscription.add(
      this.dataservice.defaultNavigation.subscribe((link) => {
        if (this.defultPasswordChange) {
          this.cancelLink = "login";
        } else {
          this.cancelLink = link;
        }
      })
    );
    this.subscription.add(
      this.dataservice.loginGCPUserID.subscribe((id) => (this.loginUserid = id))
    );
    this.subscription.add(
      this.dataservice.loginUserID.subscribe(
        (gcpid) => (this.loginGCPUserid = gcpid)
      )
    );

    // console.log(this.loginUserid);
    // console.log(this.loginGCPUserid);
  }

  changepassword() {
    var base64Key = this.clsUtility.base64Key;
    var iv = this.clsUtility.iv;

    var source_string = this.frmsignup.controls.olduser_pass.value;
    var encrypted = CryptoJS.AES.encrypt(source_string, base64Key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    var source_string2 = this.frmsignup.controls.userpass.value;
    var newencryptedpass = CryptoJS.AES.encrypt(source_string2, base64Key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    let user: { currentpassword: string; id: string; newpassword: string } = {
      currentpassword: String(encrypted),
      id: this.loginUserid,
      newpassword: String(newencryptedpass),
    };
    // console.log(user);

    this.subscription.add(
      this.authservice.changePasswordAuthService(user).subscribe(
        (res) => {
          this.result = res;
          if (this.result.message == "Invalid Password") {
            this.frmsignup.controls.olduser_pass.setErrors({
              oldpasswordinvalid: true,
            });
          } else if (this.result.message == "Password Updated") {
            const changepwdDetails = new ChangePassword();
            // if (this.defultPasswordChange) {
            changepwdDetails.userid = this.loginUserid;
            changepwdDetails.ngcpuserid = this.loginGCPUserid;
            changepwdDetails.nhistoryid = 0;
            changepwdDetails.bisdefaultpassword = false;
            changepwdDetails.bispasswordchange = false;
            changepwdDetails.createdon = this.clsUtility.currentDateTime();
            changepwdDetails.modifiedon = this.clsUtility.currentDateTime();
            // console.log(changepwdDetails);

            this.subscription.add(
              this.authservice
                .saveChangePasswordDetails(changepwdDetails)
                .subscribe((result) => {
                  if (result == 1 || result == 2) {
                    this.toastr.info("Password Updated");
                    // this._Router.navigate(["/login"]);
                    window.location.assign(environment.ssoServiceLoginUrl);
                  }
                })
            );
            // }
            // else {
            //   changepwdDetails.userid = this.loginUserid;
            //   changepwdDetails.ngcpuserid = this.loginGCPUserid;
            //   changepwdDetails.nhistoryid = 0;
            //   changepwdDetails.bispasswordchange = true;
            //   changepwdDetails.bisdefaultpassword = this.defultPasswordChange;
            //   changepwdDetails.createdon = this.clsUtility.currentDateTime();
            //   changepwdDetails.modifiedon = this.clsUtility.currentDateTime();

            //   // console.log(changepwdDetails);

            //   this.authservice
            //     .updateChangePasswordDetails(changepwdDetails)
            //     .subscribe(result => {
            //       if (result == 1) {
            //         this.toastr.info("Password Updated");
            //         this._Router.navigate(["/login"]);
            //       }
            //     });
            // }
          } else {
            alert("Invalid Case");
          }
        },
        (err) => {
          this.toastr.error("Error in Service Call");
        }
      )
    );
    // let seq = this.api.postparam("users/changepassword", user);
    // seq
    //   .map(res => res.json())
    //   .subscribe(
    //     res => {
    //       this.result = res;
    //       if (this.result.message == "Invalid Password") {
    //         this.frmsignup.controls.olduser_pass.setErrors({
    //           oldpasswordinvalid: true
    //         });
    //       } else if (this.result.message == "Password Updated") {
    //         this.toastr.info("Password Updated");
    //         this.globalSettings.setLoginStatus(false);
    //         this.globalSettings.clearuserparameters();
    //         this._Router.navigate(["/login"]);
    //       } else {
    //         alert("Invalid Case");
    //       }
    //     },
    //     err => {
    //       this.toastr.error("Error in Service Call");
    //     }
    //   );
  }
  onCancelClick() {
    // routerLink="/{{ cancelLink }}"
    this.dataservice.ChangePassword.next(false);
    this._Router.navigate([this.cancelLink]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
