import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Ftpdetails } from "src/app/Model/AR Management/Configuration/ftpdetails";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addftpdetails",
  templateUrl: "./addftpdetails.component.html",
  styleUrls: ["./addftpdetails.component.css"],
})
export class AddftpdetailsComponent implements OnInit, OnChanges {
  public newFtpdetails = true;
  private Ftpdetailsdetail: any = [];
  public FtpdetailsEditid: any;
  public selectedFtpdetailsValue: string;
  private clsFtpdetails: Ftpdetails;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;
  // Loading
  loadingFtpdetails = true;

  // Received Input from parent component
  @Input() InputFtpdetailsEditid: any;

  // Send Output to parent component
  @Output() OutputFtpdetailsEditResult = new EventEmitter<boolean>();

  OutputftpdetailsEditResult(data: any) {
    let outFtpdetailsEditResult = data;
    this.OutputFtpdetailsEditResult.emit(outFtpdetailsEditResult);
  }

  FtpdetailsGroup = this.fb.group({
    fcHost: ["", [Validators.required, Validators.maxLength(100)]],
    fcPort: [
      "",
      [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(4),
      ],
    ],
    fcUserName: ["", [Validators.required, Validators.maxLength(100)]],
    fcPassword: [
      "",
      // [Validators.required, Validators.minLength(8), Validators.maxLength(50)]
      [Validators.required, Validators.maxLength(50)],
    ],
    fcWorkingdirectory: ["", [Validators.required, Validators.maxLength(100)]],
    fcFTPName: ["", [Validators.required, Validators.maxLength(100)]],
  });

  constructor(
    private fb: FormBuilder,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService,
    private datatransfer: DataTransferService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  get FTPName() {
    return this.FtpdetailsGroup.get("fcFTPName");
  }

  get Host() {
    return this.FtpdetailsGroup.get("fcHost");
  }

  get Port() {
    return this.FtpdetailsGroup.get("fcPort");
  }

  get UserName() {
    return this.FtpdetailsGroup.get("fcUserName");
  }

  get Password() {
    return this.FtpdetailsGroup.get("fcPassword");
  }

  get Workingdirectory() {
    return this.FtpdetailsGroup.get("fcWorkingdirectory");
  }

  ngOnInit() {
    try {
      this.clsFtpdetails = new Ftpdetails();
      if (
        this.InputFtpdetailsEditid != null &&
        this.InputFtpdetailsEditid != 0
      ) {
        this.newFtpdetails = false;
        this.FtpdetailsEditid = this.InputFtpdetailsEditid;
        this.getFtpdetailsById(this.FtpdetailsEditid);
      } else {
        this.newFtpdetails = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsFtpdetails = new Ftpdetails();
      if (
        this.InputFtpdetailsEditid != null &&
        this.InputFtpdetailsEditid != 0
      ) {
        this.newFtpdetails = false;
        this.FtpdetailsEditid = this.InputFtpdetailsEditid;
        this.getFtpdetailsById(this.FtpdetailsEditid);
      } else {
        this.newFtpdetails = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getFtpdetailsById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getFtpdetailsById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Ftpdetailsdetail = data;
            this.FillFtpdetailsGroup();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateFtpdetails() {
    try {
      if (
        this.Host.valid &&
        this.Port.valid &&
        this.UserName.valid &&
        this.Password.valid &&
        this.Workingdirectory.valid &&
        this.FTPName.valid &&
        !this.clsUtility.CheckEmptyString(this.Host.value) &&
        !this.clsUtility.CheckEmptyString(this.Port.value) &&
        !this.clsUtility.CheckEmptyString(this.UserName.value) &&
        !this.clsUtility.CheckEmptyString(this.Password.value) &&
        !this.clsUtility.CheckEmptyString(this.Workingdirectory.value) &&
        !this.clsUtility.CheckEmptyString(this.FTPName.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postFtpdetails() {
    try {
      const jsonqsuite = JSON.stringify(this.clsFtpdetails);
      this.subscription.add(
        this.ConfigurationService.saveFtpdetails(jsonqsuite).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("FTP Details added successfully");
                this.OutputftpdetailsEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("FTP Details not added");
                this.OutputftpdetailsEditResult(false);
              } else {
                this.clsUtility.showInfo("FTP Details already registered");
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateFtpdetails() {
    try {
      const jsonqsuite = JSON.stringify(this.clsFtpdetails);
      this.subscription.add(
        this.ConfigurationService.updateFtpdetails(jsonqsuite).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("FTP Details updated successfully");
                this.OutputftpdetailsEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("FTP Details not added");
                this.OutputftpdetailsEditResult(false);
              } else {
                this.clsUtility.showInfo("FTP Details already registered");
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveFtpdetails() {
    try {
      this.submitted = true;
      if (this.validateFtpdetails()) {
        var strHost: string = this.Host.value;
        var strPort: string = this.Port.value;
        var strUserName: string = this.UserName.value;
        // var strPassword: string = this.Password.value;
        var strPassword: string = this.clsUtility
          .encryptAES(this.Password.value)
          .toString();

        var strWorkingdirectory: string = this.Workingdirectory.value;
        var strFTPName: string = this.FTPName.value;
        // let SelectedUserid = 0;
        let currentDateTime = this.clsUtility.currentDateTime();
        // if (this.datatransfer.SelectedGCPUserid != undefined)
        //   SelectedUserid = this.datatransfer.SelectedGCPUserid;
        // let agentname;
        // const indexagent = this.Agentdetail.findIndex(
        //   x => x.ngcpuserid == this.AgentName.value
        // );
        // if (indexagent >= 0) {
        //   agentname = this.Agentdetail[indexagent]["displayname"];
        // }
        // let clientname;
        // const indexclient = this.Clientdetail.findIndex(
        //   x => x.nclientid == this.ClientName.value
        // );
        // if (indexclient >= 0) {
        //   clientname = this.Clientdetail[indexclient]["sclientname"];
        // }
        if (this.newFtpdetails) {
          this.clsFtpdetails.nsfptid = 0;
          this.clsFtpdetails.sftphost = strHost.trim();
          this.clsFtpdetails.sftpport = Number(strPort.trim());
          this.clsFtpdetails.sftpuser = strUserName.trim();
          this.clsFtpdetails.sftppass = strPassword.trim();
          this.clsFtpdetails.sftpworkingdir = strWorkingdirectory.trim();
          this.clsFtpdetails.sftpname = strFTPName.trim();
          this.clsFtpdetails.status = true;
          this.clsFtpdetails.createdon = currentDateTime;
          this.clsFtpdetails.modifiedon = currentDateTime;
          this.postFtpdetails();
        } else if (
          this.Ftpdetailsdetail.sftphost != strHost.trim() ||
          this.Ftpdetailsdetail.sftpport != strPort.trim() ||
          this.Ftpdetailsdetail.sftpuser != strUserName.trim() ||
          this.Ftpdetailsdetail.sftppass != strPassword.trim() ||
          // this.clsUtility
          //   .decryptobj(this.Ftpdetailsdetail.sftppass)
          //   .toString() != this.Password.value.trim() ||
          this.Ftpdetailsdetail.sftpworkingdir != strWorkingdirectory.trim() ||
          this.Ftpdetailsdetail.sftpname != strFTPName.trim()
        ) {
          this.clsFtpdetails.nsfptid = this.InputFtpdetailsEditid;
          this.clsFtpdetails.sftphost = strHost.trim();
          this.clsFtpdetails.sftpport = Number(strPort.trim());
          this.clsFtpdetails.sftpuser = strUserName.trim();
          this.clsFtpdetails.sftppass = strPassword.trim();
          this.clsFtpdetails.sftpworkingdir = strWorkingdirectory.trim();
          this.clsFtpdetails.sftpname = strFTPName.trim();
          this.clsFtpdetails.status = this.Ftpdetailsdetail.status;
          this.clsFtpdetails.modifiedon = currentDateTime;
          this.updateFtpdetails();
        } else {
          this.OutputftpdetailsEditResult(false);
          $("#addftpdetailsModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillFtpdetailsGroup() {
    try {
      let Ftpdetails: Ftpdetails;
      Ftpdetails = this.Ftpdetailsdetail;
      this.Host.setValue(Ftpdetails.sftphost);
      this.Port.setValue(Ftpdetails.sftpport);
      this.UserName.setValue(Ftpdetails.sftpuser);
      // this.Password.setValue(Ftpdetails.sftppass);
      this.Password.setValue(
        this.clsUtility.decryptAES(Ftpdetails.sftppass).toString()
      );

      this.Workingdirectory.setValue(Ftpdetails.sftpworkingdir);
      this.FTPName.setValue(Ftpdetails.sftpname);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputftpdetailsEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.FtpdetailsGroup.reset();
      this.submitted = false;
      this.InputFtpdetailsEditid = null;
      this.clsFtpdetails = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  IsConnectionExists = -1;
  OnCheckFTPConnection() {
    this.loadingFtpdetails = true;
    try {
      var strHost: string = this.Host.value;
      var strPort: string = this.Port.value;
      var strUserName: string = this.UserName.value;
      // var strPassword: string = this.Password.value;
      var strPassword: string = this.clsUtility
        .encryptAES(this.Password.value)
        .toString();
      var strWorkingdirectory: string = this.Workingdirectory.value;
      var strFTPName: string = this.FTPName.value;
      let currentDateTime = this.clsUtility.currentDateTime();
      var clsFtpdetails: Ftpdetails = new Ftpdetails();
      // console.log(clsFtpdetails);
      clsFtpdetails.nsfptid = this.InputFtpdetailsEditid;
      clsFtpdetails.sftphost = strHost.trim();
      clsFtpdetails.sftpport = Number(strPort.trim());
      clsFtpdetails.sftpuser = strUserName.trim();
      clsFtpdetails.sftppass = strPassword.trim();
      clsFtpdetails.sftpworkingdir = strWorkingdirectory.trim();
      clsFtpdetails.sftpname = strFTPName.trim();
      clsFtpdetails.status = this.Ftpdetailsdetail.status;
      clsFtpdetails.modifiedon = currentDateTime;
      const jsonqsuite = JSON.stringify(clsFtpdetails);
      // console.log(jsonqsuite);

      this.subscription.add(
        this.ConfigurationService.CheckFtpExists(jsonqsuite).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              // console.log(data);

              if (data == true) {
                this.clsUtility.showSuccess("FTP connection established.");
                this.IsConnectionExists = 0;
              } else {
                this.clsUtility.showError(
                  "Unable to establish ftp connection."
                );
                this.IsConnectionExists = 1;
              }
              this.loadingFtpdetails = false;
            } else {
              this.clsUtility.showError("Unable to establish ftp connection.");
              this.IsConnectionExists = 1;
            }
          },
          (err) => {
            this.clsUtility.showError("Unable to establish ftp connection.");
            this.IsConnectionExists = 1;
            this.loadingFtpdetails = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    } finally {
      clsFtpdetails = null;
    }
  }
}
