import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
import { AddftpdetailsComponent } from "../addftpdetails/addftpdetails.component";
import { Ftpdetails } from "src/app/Model/AR Management/Configuration/ftpdetails";

declare var $: any;

@Component({
  selector: "app-ftpdetails",
  templateUrl: "./ftpdetails.component.html",
  styleUrls: ["./ftpdetails.component.css"],
})
export class FtpdetailsComponent implements OnInit, OnDestroy {
  public FtpdetailsgridData: {};
  public FtpdetailsgridView: GridDataResult;
  private Ftpdetailsitems: any[] = [];
  public Ftpdetailsskip = 0;
  public FtpdetailspageSize = 10;

  private FtpdetailsConfiguration: any;
  private ftpdetailsid: number = 0;
  public editFtpdetailsid: number = 0;
  public EditFtpdetailsid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public bisFTPPresent: boolean = false;

  @ViewChild("AddFtpdetailsChild", { static: true })
  private AddFtpdetailsChild: AddftpdetailsComponent;

  public Ftpdetailssort: SortDescriptor[] = [
    {
      field: "sftpname",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.FtpdetailspageSize = this.clsUtility.configPageSize;
  }

  OutputFtpdetailsEditResult($event) {
    try {
      this.ftpdetailsid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getFtpdetailsById();
      }

      this.AddFtpdetailsChild.ResetComponents();
      this.editFtpdetailsid = null;
      this.EditFtpdetailsid = null;
      $("#addftpdetailsModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.ftpdetailsid = 0;
      this.getFtpdetailsById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getFtpdetailsById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getFtpdetailsById(
          this.ftpdetailsid
        ).subscribe((data) => {
          if (data != null || data != undefined) {
            if (data.length == 0) this.bisFTPPresent = false;
            else this.bisFTPPresent = true;
            // const indexFtp = data.findIndex(x => x.status == true);
            // if (indexFtp != -1) this.bisActivePresent = true;
            // else this.bisActivePresent = false;
            this.FtpdetailsgridData = data;
            this.Ftpdetailsitems = data;
            this.loadItemsFtpdetails();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadItemsFtpdetails(): void {
    try {
      this.FtpdetailsgridView = {
        data: orderBy(
          this.Ftpdetailsitems.slice(
            this.Ftpdetailsskip,
            this.Ftpdetailsskip + this.FtpdetailspageSize
          ),
          this.Ftpdetailssort
        ),
        total: this.Ftpdetailsitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortFtpdetailsChange(sort: SortDescriptor[]): void {
    try {
      if (this.Ftpdetailsitems != null) {
        this.Ftpdetailssort = sort;
        this.loadItemsFtpdetails();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeFtpdetails(event: PageChangeEvent): void {
    try {
      this.Ftpdetailsskip = event.skip;
      this.loadItemsFtpdetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditFtpdetailsTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.editFtpdetailsid = dataItem.nsfptid;
      this.InputEditMessage = "Do you want to edit ftp details ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddFtpdetails() {
    try {
      this.editFtpdetailsid = 0;
      this.EditFtpdetailsid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditFtpdetailsid = this.editFtpdetailsid;
        $("#addftpdetailsModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateFtpdetailsStatus(Ftpdetailsid, Ftpdetails) {
    try {
      const jsonftpdetails = JSON.stringify(Ftpdetails);
      this.subscription.add(
        this.ConfigurationService.updateFtpdetailsStatus(
          Ftpdetailsid,
          jsonftpdetails
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else if (data == 0) {
              this.clsUtility.showError("Status not updated");
            } else {
              this.clsUtility.showInfo(
                "Status cannot be updated already in use"
              );
            }
            this.getFtpdetailsById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnFtpdetailsStatus(Ftpdetailsid, FtpdetailsStatus) {
    try {
      let objFtpdetails: Ftpdetails;
      objFtpdetails = new Ftpdetails();
      objFtpdetails.nsfptid = Ftpdetailsid;
      objFtpdetails.status = FtpdetailsStatus;

      this.updateFtpdetailsStatus(Ftpdetailsid, objFtpdetails);
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
}
