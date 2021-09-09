import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { SubSink } from "subsink";
import { AddEditGroupClientMappingComponent } from "../add-edit-group-client-mapping/add-edit-group-client-mapping.component";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { GroupClientMappingStatus } from "src/app/Model/AR Management/Configuration/group-client-mapping.model";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
declare var $: any;

@Component({
  selector: "app-group-client-mapping",
  templateUrl: "./group-client-mapping.component.html",
  styleUrls: ["./group-client-mapping.component.css"],
})
export class GroupClientMappingComponent implements OnInit, OnDestroy {
  clsUtility: Utility;
  groupClientMappingGridView: GridDataResult;
  pageSize = 0;
  pageSkip = 0;
  sort: SortDescriptor[] = [
    {
      field: "groupstatus",
      dir: "desc",
    },
    {
      field: "groupname",
      dir: "asc",
    },
  ];
  groupClientMappingItems: any[] = [];
  subscription: SubSink = new SubSink();
  @ViewChild("addEditGroupClientMapping", { static: true })
  addEditGroupClientMapping: AddEditGroupClientMappingComponent;
  gridLoader: boolean;
  clsAuthLogs: AuthLogs;
  constructor(
    private toastr: ToastrService,
    private configService: ConfigurationService,
    private dataService: DataTransferService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.pageSize = this.clsUtility.configPageSize;
    this.clsAuthLogs = new AuthLogs(http);
  }

  ngOnInit() {
    this.getGroupClientMappings();
  }

  OutputEditResult(evt: boolean) {
    try {
      if (evt) {
        this.addEditGroupClientMapping.editGroupClientMapping();
        $("#addEditGroupClientMappingModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onPageChange(event: PageChangeEvent) {
    try {
      this.pageSkip = event.skip;
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onSortChange(sort: SortDescriptor[]): void {
    try {
      this.sort = sort;
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onEditGroupClientMapping(evt: any) {
    try {
      // this.editClientUserMappingid = evt.dataItem.groupid;
      this.addEditGroupClientMapping.editGroupId = evt.dataItem.groupid.toString();
      this.addEditGroupClientMapping.editmappingtypeid =
        evt.dataItem.mappingtypeid;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onViewMappingDetails(dataItem: any) {
    try {
      // this.editClientUserMappingid = evt.dataItem.groupid;
      this.addEditGroupClientMapping.editGroupId = dataItem.groupid.toString();
      this.addEditGroupClientMapping.editmappingtypeid = dataItem.mappingtypeid;
      this.addEditGroupClientMapping.detailsGroupClientMapping();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private loadGridView(): void {
    try {
      this.groupClientMappingGridView = {
        data: orderBy(
          this.groupClientMappingItems.slice(
            this.pageSkip,
            this.pageSkip + this.pageSize
          ),
          this.sort
        ),
        total: this.groupClientMappingItems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddClick() {
    try {
      this.addEditGroupClientMapping.addGroupClientMapping();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getGroupClientMappings() {
    try {
      this.gridLoader = true;
      this.subscription.add(
        this.configService.getGroupClientMappings("0").subscribe(
          (data) => {
            if (data) {
              this.groupClientMappingItems = data;
              this.loadGridView();
            } else {
              if (data == 0) {
                this.clsUtility.LogError(
                  "Error while getting group client mapping data"
                );
              }
              this.groupClientMappingGridView = null;
              this.groupClientMappingItems = [];
            }
            this.gridLoader = false;
          },
          (error) => {
            this.gridLoader = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  updateGroupClientMappingStatus(dataItem: any, groupstatus: boolean) {
    try {
      let inputBody: GroupClientMappingStatus = new GroupClientMappingStatus();
      inputBody.groupid = dataItem.groupid;
      inputBody.mappingtypeid = dataItem.mappingtypeid;
      inputBody.groupstatus = groupstatus;
      this.gridLoader = true;
      this.subscription.add(
        this.configService.updateGroupClientMappingStatus(inputBody).subscribe(
          (data) => {
            if (data) {
              this.writeLog(
                dataItem.groupname +
                  " group mapping status " +
                  (groupstatus ? "activated" : "deactivated") +
                  " successfully",
                "UPDATE"
              );
              this.clsUtility.showSuccess("Status updated successfully");
              this.getGroupClientMappings();
            } else {
              this.writeLog(
                "Error while " +
                  (groupstatus ? "activating " : "deactivating ") +
                  dataItem.groupname +
                  " group mapping status",
                "UPDATE"
              );
              this.clsUtility.LogError(
                "Error while updating group client mapping status"
              );
            }
            this.gridLoader = false;
          },
          (error) => {
            this.gridLoader = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onSaveGroupClientMapping(evt: boolean) {
    //emmit this event whenn user save mapping
    try {
      if (evt) {
        this.getGroupClientMappings();
      }
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
  writeLog(Message: string, UserAction: string) {
    let ModuleName = "Qonductor-Configuration";
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
      loginuser: this.dataService.loginUserName,
      module: ModuleName,
      screen: "GroupClientMapping",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }
}
