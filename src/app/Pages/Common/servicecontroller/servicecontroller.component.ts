import { Component, OnInit, OnDestroy } from "@angular/core";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import {
  Utility,
  enumServiceStatus,
  enumEdocServiceStatus,
  enumSFTPServiceStatus,
} from "src/app/Model/utility";
import { SubSink } from "../../../../../node_modules/subsink";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { ServiceControllerModel } from "src/app/Model/BT Charge Posting/Service Controller/ServiceControllerModel";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { environment } from "src/environments/environment";
import { MailSend } from "src/app/Model/AR Management/Configuration/mail";
import { CoreauthService } from "../../Services/Common/coreauth.service";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import { CoreOperationService } from "../../Services/BT/core-operation.service";

@Component({
  selector: "app-servicecontroller",
  templateUrl: "./servicecontroller.component.html",
  styleUrls: ["./servicecontroller.component.css"],
})
export class ServicecontrollerComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();
  public QConstrueServiceStatus;
  isParserServiceStarted = false;
  isEdocParserServiceStarted = false;
  isButtonDisabled = false;
  isEdocButtonDisabled = false;
  // ParserServiceStatus: number;
  DbDetails: any = null;
  private clsUtility: Utility;
  scheduleTime: any;
  sftpScheuleTime: any;
  HL7ScheduleTime: any;
  docUploadScheduleTime: any;
  EdocServiceStatus: string;
  automationId: any;
  HL7ControlStatus: string;
  isHL7ServiceStarted: boolean;
  ishl7ButtonDisabled: boolean;
  EdocControlStatus: boolean;
  clsAuthLogs: AuthLogs;
  SFTPServiceStatus: string;
  isSFTPParserServiceStarted: boolean;
  isSFTPButtonDisabled: boolean;
  sftpSplitterScheuleTime: any;
  SFTPSplitterServiceStatus: string;
  isSFTPSplitterServiceStarted: boolean;
  isSFTPSplitterButtonDisabled: boolean;
  isArchivalServiceStarted: boolean;
  archivalServiceStatus: string;
  archivalScheduleTime: any;
  statusData: any[] = [];
  allStatusData: any[] = [];
  selectedStatus: any[] = [];
  archiveAfterDays: number;
  daysList: any[] = [
    {
      day: "Sunday",
      value: 0,
    },
    {
      day: "Monday",
      value: 1,
    },
    {
      day: "Tuesday",
      value: 2,
    },
    {
      day: "Wednesday",
      value: 3,
    },
    {
      day: "Thursday",
      value: 4,
    },
    {
      day: "Friday",
      value: 5,
    },
    {
      day: "Saturday",
      value: 6,
    },
  ];
  archivalDay: number;

  constructor(
    private ConfigurationService: ConfigurationService,
    private toaster: ToastrService,
    private datatransfer: DataTransferService,
    private authService: CoreauthService,
    private http: HttpClient,
    private coreService: CoreOperationService
  ) {
    this.clsUtility = new Utility(toaster);
    this.clsAuthLogs = new AuthLogs(http);
  }

  ngOnInit() {
    try {
      this.GetQConstrueParserServiceStatus();
      this.GetQConstrueDatabaseDetails();
      this.GetServiceSetting("0");
      this.getAutomationControlStatus("0", "fromInit");
      this.getEdocServiceStatus();
      this.getArchivalServiceStatus();
      this.getAllStatus();
      this.getHL7ServiceStatus();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  GetQConstrueDatabaseDetails() {
    try {
      this.subscription.add(
        this.ConfigurationService.getDBDetails().subscribe((data) => {
          if (data != null || data != undefined) {
            this.DbDetails = data;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  GetQConstrueParserServiceStatus() {
    try {
      this.subscription.add(
        this.ConfigurationService.getQConstrueParserServiceStatus().subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.setParserStatus(data);
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ParserServiceStatusChanged(status: number): any {
    try {
      this.subscription.add(
        this.ConfigurationService.postQConstrueParserServiceStatus(
          status
        ).subscribe((data) => {
          this.GetQConstrueParserServiceStatus();
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  setParserStatus(data): any {
    try {
      // this.ParserServiceStatus = data;
      switch (data) {
        case 0:
          this.QConstrueServiceStatus = enumServiceStatus[0];
          this.isParserServiceStarted = false;
          this.isButtonDisabled = false;
          break;
        case 1:
          this.QConstrueServiceStatus = enumServiceStatus[1];
          this.isParserServiceStarted = true;
          this.isButtonDisabled = false;
          break;
        case 2:
          this.QConstrueServiceStatus = enumServiceStatus[2];
          this.isParserServiceStarted = true;
          this.isButtonDisabled = false;
          break;
        case 3:
          this.QConstrueServiceStatus = enumServiceStatus[3];
          this.isParserServiceStarted = true;
          this.isButtonDisabled = false;
          break;
        case 4:
          this.QConstrueServiceStatus = enumServiceStatus[4];
          this.isParserServiceStarted = true;
          this.isButtonDisabled = false;
          break;
        case 5:
          this.QConstrueServiceStatus = enumServiceStatus[5];
          this.isParserServiceStarted = true;
          this.isButtonDisabled = false;
          break;
        case 6:
          this.QConstrueServiceStatus = enumServiceStatus[6];
          this.isParserServiceStarted = true;
          this.isButtonDisabled = false;
          break;
        case 7:
          this.QConstrueServiceStatus = enumServiceStatus[7];
          this.isParserServiceStarted = true;
          this.isButtonDisabled = false;
          break;
      }
      // console.log(
      //   "this.QConstrueServiceStatus  : " + this.QConstrueServiceStatus
      // );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onStartService() {
    try {
      this.ParserServiceStatusChanged(1);
      this.getMailConfigurationByTitle("Qconstrue", "Start");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onStopService() {
    try {
      this.ParserServiceStatusChanged(0);
      this.getMailConfigurationByTitle("Qconstrue", "Stop");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  GetServiceSetting(id: string) {
    try {
      this.subscription.add(
        this.ConfigurationService.GetEdocServiceSetting(id).subscribe(
          (data) => {
            if (data) {
              data.forEach((ele) => {
                switch (ele.settingsname) {
                  case "scheduledtime":
                    this.scheduleTime = this.hoursandminutes(ele.settingsvalue);
                    break;
                  case "FTPScheduler":
                    this.sftpScheuleTime = this.hoursandminutes(
                      ele.settingsvalue
                    );
                    break;
                  case "SFTPSplitterScheduler":
                    this.sftpSplitterScheuleTime = this.hoursandminutes(
                      ele.settingsvalue
                    );
                    break;
                  case "SFTPSplitterSchedulerStatus":
                    switch (+ele.settingsvalue) {
                      case 0:
                        this.SFTPSplitterServiceStatus =
                          "SFTP Splitter service Stopped";
                        this.isSFTPSplitterServiceStarted = false;
                        this.isSFTPSplitterButtonDisabled = false;
                        break;
                      case 1:
                        this.SFTPSplitterServiceStatus =
                          "SFTP Splitter service Started";
                        this.isSFTPSplitterServiceStarted = true;
                        this.isSFTPSplitterButtonDisabled = false;
                        break;
                      case 2:
                        this.SFTPSplitterServiceStatus =
                          "SFTP Splitter service running";
                        this.isSFTPSplitterServiceStarted = true;
                        this.isSFTPSplitterButtonDisabled = false;
                        break;
                      case 3:
                        this.SFTPSplitterServiceStatus =
                          "SFTP Splitter service In-Process";
                        this.isSFTPSplitterServiceStarted = true;
                        this.isSFTPSplitterButtonDisabled = true;
                        break;
                    }
                    break;
                  case "archivescheduletime":
                    this.archivalScheduleTime = this.hoursandminutes(
                      ele.settingsvalue
                    );
                    break;
                  case "archivestatus":
                    if (ele.settingsvalue !== "") {
                      ele.settingsvalue.split(",").forEach((item) => {
                        this.selectedStatus.push(+item);
                      });
                    } else {
                      this.selectedStatus = [];
                    }
                    break;

                  case "archiveafterdays":
                    this.archiveAfterDays = +ele.settingsvalue;
                    break;
                  case "archiveonweekday":
                    this.archivalDay = +ele.settingsvalue;
                    break;
                }
              });
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveScheduleTime(settingsname: string) {
    try {
      // console.log(this.selectedStatus);
      let scheduledtime: string;
      let json = new ServiceControllerModel();
      switch (settingsname) {
        case "scheduledtime":
          scheduledtime = moment(this.scheduleTime).format("HH:mm");
          break;
        case "FTPScheduler":
          scheduledtime = moment(this.sftpScheuleTime).format("HH:mm");
          break;
        case "SFTPSplitterScheduler":
          scheduledtime = moment(this.sftpSplitterScheuleTime).format("HH:mm");
          break;
        case "archivescheduletime":
          json.serviceSettings.push({
            settingsname: "archivestatus",
            settingsvalue: this.selectedStatus.join(","),
          });
          json.serviceSettings.push({
            settingsname: "archiveafterdays",
            settingsvalue: this.archiveAfterDays.toString(),
          });
          json.serviceSettings.push({
            settingsname: "archiveonweekday",
            settingsvalue: this.archivalDay.toString(),
          });
          scheduledtime = moment(this.archivalScheduleTime).format("HH:mm");
          break;
      }
      json.serviceSettings.push({
        settingsname: settingsname,
        settingsvalue: scheduledtime,
      });
      json.createdby = this.datatransfer.SelectedGCPUserid;
      json.createdon = this.clsUtility.currentDateTime();
      json.modifiedby = this.datatransfer.SelectedGCPUserid;
      json.modifiedon = this.clsUtility.currentDateTime();

      this.subscription.add(
        this.ConfigurationService.SaveEDocServiceSetting(json).subscribe(
          (data) => {
            if (data == 1) {
              this.clsUtility.showSuccess("Time scheduled successfully");
            } else {
              this.clsUtility.showError("Error while scheduling time");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
      switch (settingsname) {
        case "scheduledtime":
          this.getMailConfigurationByTitle(
            "EdocService: Schedule Time",
            scheduledtime
          );
          break;
        case "FTPScheduler":
          this.getMailConfigurationByTitle(
            "SFTPService: Schedule Time",
            scheduledtime
          );
          break;
        case "SFTPSplitterScheduler":
          this.getMailConfigurationByTitle(
            "SFTPSplitterService: Schedule Time",
            scheduledtime
          );
          break;
        case "archivescheduletime":
          let archivalDayText: string = this.daysList.find(
            (ele) => ele.value === this.archivalDay
          ).day;
          let selectedStatusText: string[] = [];
          this.selectedStatus.forEach((ele) => {
            selectedStatusText.push(
              this.statusData.find((item) => item.statuscode === ele).status
            );
          });
          let serviceSettingValue: string =
            "<table border='1' style='border-collapse:collapse;'><tbody><tr><td style='width:60%'>Archival day: </td><td style='width:40%'>" +
            archivalDayText +
            "</td></tr><tr><td style='width:60%'>Archival after days: </td><td style='width:40%'>" +
            this.archiveAfterDays +
            "</td></tr><tr><td style='width:60%'>Archival schedule time: </td><td style='width:40%'>" +
            scheduledtime +
            "</td></tr><tr><td style='width:60%'>Archival status: </td><td style='width:40%'>" +
            selectedStatusText.join(";<br/>") +
            "</td></tr></tbody></table>";
          this.getMailConfigurationByTitle(
            "ArchivalService: Setting changes",
            serviceSettingValue
          );
          break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveHL7ScheduleTime() {
    try {
      let scheduledtime: string;
      scheduledtime = moment(this.HL7ScheduleTime).format("HH:mm");
      let json: {
        hl7scheduledtime: string;
        id: string;
      } = {
        hl7scheduledtime: scheduledtime,
        id: this.automationId,
      };

      this.subscription.add(
        this.ConfigurationService.SaveHL7ServiceSetting(json).subscribe(
          (data) => {
            if (data == 1) {
              this.clsUtility.showSuccess("Time scheduled successfully");
            } else {
              this.clsUtility.showError("Error while scheduling time");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
      this.getMailConfigurationByTitle(
        "HL7Service: Schedule Time",
        scheduledtime
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveDocUploadScheduleTime() {
    try {
      let scheduledtime: string;
      scheduledtime = moment(this.docUploadScheduleTime).format("HH:mm");
      let json: {
        edocsscheduledtime: string;
        id: string;
      } = {
        edocsscheduledtime: scheduledtime,
        id: this.automationId,
      };

      this.subscription.add(
        this.ConfigurationService.SaveDocUploadServiceSetting(json).subscribe(
          (data) => {
            if (data == 1) {
              this.clsUtility.showSuccess("Time scheduled successfully");
            } else {
              this.clsUtility.showError("Error while scheduling time");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
      this.getMailConfigurationByTitle(
        "DocumentUploadService: Schedule Time",
        scheduledtime
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EdocServiceStatusChanged(flag: boolean) {
    try {
      this.subscription.add(
        this.ConfigurationService.EdocServiceStatusChanged(flag).subscribe(
          (data) => {
            this.getEdocServiceStatus();
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
      if (flag) {
        this.getMailConfigurationByTitle("EdocService", "Start");
      } else {
        this.getMailConfigurationByTitle("EdocService", "Stop");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  updateSFTPSplitterServiceStatus(status: number) {
    try {
      let json = new ServiceControllerModel();
      // json.settingsname = "SFTPSplitterSchedulerStatus";
      // json.settingsvalue = status.toString();
      json.serviceSettings = [
        {
          settingsname: "SFTPSplitterSchedulerStatus",
          settingsvalue: status.toString(),
        },
      ];
      json.createdby = this.datatransfer.SelectedGCPUserid;
      json.createdon = this.clsUtility.currentDateTime();
      json.modifiedby = this.datatransfer.SelectedGCPUserid;
      json.modifiedon = this.clsUtility.currentDateTime();

      this.subscription.add(
        this.ConfigurationService.SaveEDocServiceSetting(json).subscribe(
          (data) => {
            if (data == 1) {
              switch (status) {
                case 0:
                  this.SFTPSplitterServiceStatus =
                    "SFTP Splitter service Stopped";
                  this.isSFTPSplitterServiceStarted = false;
                  this.isSFTPSplitterButtonDisabled = false;
                  break;
                case 1:
                  this.SFTPSplitterServiceStatus =
                    "SFTP Splitter service Started";
                  this.isSFTPSplitterServiceStarted = true;
                  this.isSFTPSplitterButtonDisabled = false;
                  break;
                case 2:
                  this.SFTPSplitterServiceStatus =
                    "SFTP Splitter service running";
                  this.isSFTPSplitterServiceStarted = true;
                  this.isSFTPSplitterButtonDisabled = false;
                  break;
                case 3:
                  this.SFTPSplitterServiceStatus =
                    "SFTP Splitter service In-Process";
                  this.isSFTPSplitterServiceStarted = true;
                  this.isSFTPSplitterButtonDisabled = true;
                  break;
              }
            } else {
              this.clsUtility.showError(
                "Error while start SFTP Splitter service"
              );
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );

      if (status) {
        this.getMailConfigurationByTitle("SFTP Splitter Service", "Start");
      } else {
        this.getMailConfigurationByTitle("SFTP Splitter Service", "Stop");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  getEdocServiceStatus() {
    try {
      this.subscription.add(
        this.ConfigurationService.getEdocServiceStatus().subscribe(
          (data) => {
            this.setEdocStatus(data);
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  getSFTPSplitterServiceStatus() {
    try {
      this.subscription.add(
        this.ConfigurationService.GetEdocServiceSetting(
          "0",
          "SFTPSplitterSchedulerStatus"
        ).subscribe(
          (data) => {
            if (data) {
              let ftpSplitterServiceStatusElement = data.find(
                (element) =>
                  element.settingsname === "SFTPSplitterSchedulerStatus"
              );
              if (ftpSplitterServiceStatusElement) {
                switch (+ftpSplitterServiceStatusElement.settingsvalue) {
                  case 0:
                    this.SFTPSplitterServiceStatus =
                      "SFTP Splitter service Stopped";
                    this.isSFTPSplitterServiceStarted = false;
                    this.isSFTPSplitterButtonDisabled = false;
                    break;
                  case 1:
                    this.SFTPSplitterServiceStatus =
                      "SFTP Splitter service Started";
                    this.isSFTPSplitterServiceStarted = true;
                    this.isSFTPSplitterButtonDisabled = false;
                    break;
                  case 2:
                    this.SFTPSplitterServiceStatus =
                      "SFTP Splitter service running";
                    this.isSFTPSplitterServiceStarted = true;
                    this.isSFTPSplitterButtonDisabled = false;
                    break;
                  case 3:
                    this.SFTPSplitterServiceStatus =
                      "SFTP Splitter service In-Process";
                    this.isSFTPSplitterServiceStarted = true;
                    this.isSFTPSplitterButtonDisabled = true;
                    break;
                }
              }
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  updateHL7ServiceStatus(status: number) {
    try {
      let json = new ServiceControllerModel();
      // json.settingsname = "SFTPSplitterSchedulerStatus";
      // json.settingsvalue = status.toString();
      json.serviceSettings = [
        {
          settingsname: "hl7controlstatus",
          settingsvalue: status.toString(),
        },
      ];
      json.createdby = this.datatransfer.SelectedGCPUserid;
      json.createdon = this.clsUtility.currentDateTime();
      json.modifiedby = this.datatransfer.SelectedGCPUserid;
      json.modifiedon = this.clsUtility.currentDateTime();

      this.subscription.add(
        this.ConfigurationService.SaveEDocServiceSetting(json).subscribe(
          (data) => {
            if (data == 1) {
              switch (status) {
                case 0:
                  this.HL7ControlStatus = "HL7 service Stopped";
                  this.isHL7ServiceStarted = false;
                  this.ishl7ButtonDisabled = false;
                  break;
                case 1:
                  this.HL7ControlStatus = "HL7 service Started";
                  this.isHL7ServiceStarted = true;
                  this.ishl7ButtonDisabled = false;
                  break;
                // case 2:
                //   this.SFTPSplitterServiceStatus =
                //     "SFTP Splitter service running";
                //   this.isSFTPSplitterServiceStarted = true;
                //   this.isSFTPSplitterButtonDisabled = false;
                //   break;
                // case 3:
                //   this.SFTPSplitterServiceStatus =
                //     "SFTP Splitter service In-Process";
                //   this.isSFTPSplitterServiceStarted = true;
                //   this.isSFTPSplitterButtonDisabled = true;
                //   break;
              }
            } else {
              this.clsUtility.showError("Error while start HL7 service");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );

      if (status) {
        this.getMailConfigurationByTitle("HL7 Service", "Start");
      } else {
        this.getMailConfigurationByTitle("HL7 Service", "Stop");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  getHL7ServiceStatus() {
    try {
      this.subscription.add(
        this.ConfigurationService.GetEdocServiceSetting(
          "0",
          "hl7controlstatus"
        ).subscribe(
          (data) => {
            if (data) {
              let ftpSplitterServiceStatusElement = data.find(
                (element) => element.settingsname === "hl7controlstatus"
              );
              if (ftpSplitterServiceStatusElement) {
                switch (+ftpSplitterServiceStatusElement.settingsvalue) {
                  case 0:
                    this.HL7ControlStatus = "HL7 service Stopped";
                    this.isHL7ServiceStarted = false;
                    this.ishl7ButtonDisabled = false;
                    break;
                  case 1:
                    this.HL7ControlStatus = "HL7 service Started";
                    this.isHL7ServiceStarted = true;
                    this.ishl7ButtonDisabled = false;
                    break;
                  // case 2:
                  //   this.SFTPSplitterServiceStatus =
                  //     "SFTP Splitter service running";
                  //   this.isSFTPSplitterServiceStarted = true;
                  //   this.isSFTPSplitterButtonDisabled = false;
                  //   break;
                  // case 3:
                  //   this.SFTPSplitterServiceStatus =
                  //     "SFTP Splitter service In-Process";
                  //   this.isSFTPSplitterServiceStarted = true;
                  //   this.isSFTPSplitterButtonDisabled = true;
                  //   break;
                }
              }
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  setEdocStatus(data: any) {
    try {
      switch (data) {
        case 0:
          this.EdocServiceStatus = enumEdocServiceStatus[0];
          this.isEdocParserServiceStarted = false;
          this.isEdocButtonDisabled = false;
          break;
        case 1:
          this.EdocServiceStatus = enumEdocServiceStatus[1];
          this.isEdocParserServiceStarted = true;
          this.isEdocButtonDisabled = false;
          break;
        case 2:
          this.EdocServiceStatus = enumEdocServiceStatus[2];
          this.isEdocParserServiceStarted = true;
          this.isEdocButtonDisabled = false;
          break;
        case 3:
          this.EdocServiceStatus = enumEdocServiceStatus[3];
          this.isEdocParserServiceStarted = true;
          this.isEdocButtonDisabled = false;
          break;
        case 4:
          this.EdocServiceStatus = enumEdocServiceStatus[4];
          this.isEdocParserServiceStarted = true;
          this.isEdocButtonDisabled = false;
          break;
        case 5:
          this.EdocServiceStatus = enumEdocServiceStatus[5];
          this.isEdocParserServiceStarted = true;
          this.isEdocButtonDisabled = false;
          break;
        case 6:
          this.EdocServiceStatus = enumEdocServiceStatus[6];
          this.isEdocParserServiceStarted = true;
          this.isEdocButtonDisabled = false;
          break;
        case 7:
          this.EdocServiceStatus = enumEdocServiceStatus[7];
          this.isEdocParserServiceStarted = true;
          this.isEdocButtonDisabled = false;
          break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getAutomationControlStatus(id: string, fromName: string) {
    try {
      this.subscription.add(
        this.ConfigurationService.getHL7Control(id).subscribe(
          (data) => {
            if (data) {
              // console.log("Automation Service data:", data);
              if (data.length > 0) {
                if (fromName == "fromInit") {
                  this.automationId = data[0].id;
                  this.EdocControlStatus = data[0].edoccontrolstatus;
                  this.docUploadScheduleTime = this.hoursandminutes(
                    data[0].edocsscheduledtime
                  );
                  // this.HL7ControlStatus = data[0].hl7controlstatus;
                  this.HL7ScheduleTime = this.hoursandminutes(
                    data[0].hl7scheduledtime
                  );
                }
                // else if (fromName == "fromHL7") {
                //   this.HL7ControlStatus = data[0].hl7controlstatus;
                // }
                else if (fromName == "fromEdoc") {
                  this.EdocControlStatus = data[0].edoccontrolstatus;
                }
              }
            }
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  hoursandminutes(time): any {
    try {
      let date: Date;
      if (time) {
        let hoursandminute = time.split(":", 2);
        let hours = hoursandminute[0];
        let minutes = hoursandminute[1];
        date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
      }
      return date;
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  HL7UpdateStatus(flag: boolean) {
    try {
      let json: {
        id: string;
        hl7controlstatus: boolean;
      } = {
        id: this.automationId,
        hl7controlstatus: flag,
      };
      this.subscription.add(
        this.ConfigurationService.HL7UpdateStatus(json).subscribe(
          (data) => {
            this.getAutomationControlStatus("0", "fromHL7");
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
      if (flag) {
        this.getMailConfigurationByTitle("HL7 Service", "Start");
      } else {
        this.getMailConfigurationByTitle("HL7 Service", "Stop");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  updateAutomationEdocServiceStatus(status: boolean) {
    try {
      let json: {
        edoccontrolstatus: boolean;
        id: string;
      } = {
        edoccontrolstatus: status,
        id: this.automationId,
      };
      this.subscription.add(
        this.ConfigurationService.updateAutomationEdocServiceStatus(
          json
        ).subscribe(
          (data) => {
            this.getAutomationControlStatus("0", "fromEdoc");
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
      if (status) {
        this.getMailConfigurationByTitle("Document Upload Service", "Start");
      } else {
        this.getMailConfigurationByTitle("Document Upload Service", "Stop");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  getArchivalServiceStatus() {
    try {
      this.subscription.add(
        this.ConfigurationService.getArchivalServiceStatus().subscribe(
          (data) => {
            if (data == null) {
              this.clsUtility.LogError("Error while getting service status");
              this.archivalServiceStatus = "";
            } else {
              this.setArchivalStatus(data);
            }
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  archivalUpdateStatus(status: boolean) {
    try {
      this.subscription.add(
        this.ConfigurationService.updateArchivalServiceStatus(status).subscribe(
          (data) => {
            if (data == null) {
              this.clsUtility.LogError("Error while updating service status");
              this.archivalServiceStatus = "";
            } else {
              this.setArchivalStatus(data);
            }
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
      if (status) {
        this.getMailConfigurationByTitle("Archival Service", "Start");
      } else {
        this.getMailConfigurationByTitle("Archival Service", "Stop");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  setArchivalStatus(status: number) {
    try {
      switch (status) {
        case 0:
          this.isArchivalServiceStarted = false;
          this.archivalServiceStatus = "Archival Service is stopped";
          break;
        case 1:
          this.isArchivalServiceStarted = true;
          this.archivalServiceStatus = "Archival Service is running";
          break;
        case 4:
          this.isArchivalServiceStarted = true;
          this.archivalServiceStatus = "Archival Service is started";
          break;
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  getAllStatus() {
    try {
      this.subscription.add(
        this.coreService.OrderInventoryStatus("0").subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.statusData = data;
              this.allStatusData = data;
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public isItemSelected(value: string): boolean {
    return this.selectedStatus.some((item) => item === value);
  }
  public summaryTagSelectedValues(dataItems: any[], key: string): string {
    return dataItems.map((ele) => ele[key]).join(",");
  }
  handleStatusFilter(value: string) {
    if (this.allStatusData) {
      this.statusData = this.allStatusData.filter(
        (s) =>
          s.status.toLowerCase().includes(value.toLowerCase().trim()) === true
      );
    }
  }
  writeLog(Message: string, UserAction: string) {
    let ModuleName = "Qonductor";
    let para: {
      application: string;
      clientip: string;
      clientbrowser: number;
      loginuser: string;
      module: string;
      screen: string;
      message: string;
      useraction: string;
      transactionid: string;
    } = {
      application: "Qonductor",
      clientip: "",
      clientbrowser: null,
      loginuser: this.datatransfer.loginUserName,
      module: ModuleName,
      screen: "OrderInventory",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }
  getMailConfigurationByTitle(serviceName: string, serviceSetting: string) {
    try {
      // this.loadingDailyProduction = true;
      var date = moment().format("MM/DD/YYYY");
      var objMailSend = new MailSend();
      if (serviceName == "EdocService: Schedule Time") {
        this.writeLog(
          serviceName + " setting changed." + serviceSetting,
          "UPDATE"
        );
      } else {
        this.writeLog(
          serviceName + " service setting changed." + serviceSetting,
          "UPDATE"
        );
      }
      this.subscription.add(
        this.ConfigurationService.getMailByTitle(
          "QonductorServiceControllerNotification"
        ).subscribe(
          (data) => {
            // console.log(data);

            if ((data != null || data != undefined) && data != 0) {
              objMailSend.FromEmail = data.emailfrom.toString();
              objMailSend.FromPassword = this.clsUtility.decryptAES(
                data.frompassword
              );
              if (
                data.emailsubject == null ||
                data.emailsubject == undefined ||
                data.emailbody == null ||
                data.emailbody == undefined
              ) {
                this.clsUtility.showError(
                  "Invalid email configuration. Please contact system administrator."
                );
                return;
              } else {
                var emailsubject = data.emailsubject;
                var serviceEnvironment = environment.currentEnvironment;
                emailsubject = emailsubject.replace(
                  "{{environment}}",
                  serviceEnvironment != "Production"
                    ? "-" + serviceEnvironment
                    : ""
                );
                objMailSend.Subject = emailsubject;
                var emailbody = data.emailbody;
                emailbody = emailbody.replace(
                  "{{environment}}",
                  environment.currentEnvironment
                );
                emailbody = emailbody.replace("{{servicename}}", serviceName);
                emailbody = emailbody.replace(
                  "{{servicestatus}}",
                  serviceSetting
                );
                emailbody = emailbody.replace(
                  "{{username}}",
                  this.datatransfer.loginUserName
                );
                emailbody = emailbody.replace(
                  "{{date}}",
                  this.clsUtility.currentDateTime()
                );

                objMailSend.Body = emailbody;
                emailbody = null;
                emailsubject = null;
              }
              if (
                data.emailtoreceive != null ||
                data.emailtoreceive != undefined
              ) {
                objMailSend.To = data.emailtoreceive
                  .toString()
                  .replace(/,/g, ";");
              }
              if (
                data.emailccreceive != null ||
                data.emailccreceive != undefined
              ) {
                objMailSend.Cc = data.emailccreceive
                  .toString()
                  .replace(/,/g, ";");
              }

              // console.log(objMailSend);

              this.subscription.add(
                this.authService.sendMail(objMailSend, null).subscribe(
                  (response) => {
                    this.clsUtility.showSuccess(response.status);
                    // console.log(response.status);
                    // this.loadingDailyProduction = false;
                  },
                  (err) => {
                    this.clsUtility.showError("Error in mail send");
                    // this.loadingDailyProduction = false;
                  }
                )
              );
            } else {
              this.clsUtility.showError(
                "Email configuration is not available. Please contact system administrator."
              );
              // this.loadingDailyProduction = false;
            }
          },
          (err) => {
            this.clsUtility.showError("Error to receive email template");
            // this.loadingDailyProduction = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
