import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Client } from "src/app/Model/AR Management/Configuration/client";
import { Clientlogin } from "src/app/Model/AR Management/Configuration/clientlogin";
import { AddclientloginComponent } from "src/app/Pages/AR Management/Common/Configuration/client-logins/addclientlogin/addclientlogin.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-clientlogins",
  templateUrl: "./clientlogins.component.html",
  styleUrls: ["./clientlogins.component.css"],
})
export class ClientloginsComponent implements OnInit, OnDestroy {
  public ClientlogingridData: {};
  public ClientlogingridView: GridDataResult;
  private Clientloginitems: any[] = [];
  public Clientloginskip = 0;
  public ClientloginpageSize = 10;

  private Clientlogin: any;
  private clientloginid: number = 0;
  public editClientloginid: number = 0;
  private deleteClientloginid: number = 0;
  public EditClientloginid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddClientloginChild", { static: true })
  private AddClientloginChild: AddclientloginComponent;

  public Clientloginsort: SortDescriptor[] = [
    {
      field: "sclientname",
      dir: "desc",
    },
  ];

  constructor(
    private route: Router,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.ClientloginpageSize = this.clsUtility.configPageSize;
  }

  OutputClientLoginEditResult($event) {
    try {
      this.clientloginid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getClientLoginById();
      }
      this.AddClientloginChild.ResetComponents();
      this.editClientloginid = null;
      this.EditClientloginid = null;
      $("#addclientloginModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.clientloginid = 0;
      this.getClientLoginById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientLoginById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientLoginById(
          this.clientloginid
        ).subscribe(async (data) => {
          if (data != null || data != undefined) {
            this.ClientlogingridData = data;
            this.Clientloginitems = data;
            this.loadItemsClientlogin();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadItemsClientlogin(): void {
    try {
      this.ClientlogingridView = {
        data: orderBy(
          this.Clientloginitems.slice(
            this.Clientloginskip,
            this.Clientloginskip + this.ClientloginpageSize
          ),
          this.Clientloginsort
        ),
        total: this.Clientloginitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortClientloginChange(sort: SortDescriptor[]): void {
    try {
      if (this.Clientloginitems != null) {
        this.Clientloginsort = sort;
        this.loadItemsClientlogin();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeClientlogin(event: PageChangeEvent): void {
    try {
      this.Clientloginskip = event.skip;
      this.loadItemsClientlogin();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditClientlogin({ sender, rowIndex, dataItem }) {
    try {
      this.editClientloginid = dataItem.nloginid;
      this.InputEditMessage = "Do you want to edit client login ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateClientloginStatus(Clientloginid, Clientlogin) {
    try {
      const jsonclientlogin = JSON.stringify(Clientlogin);
      this.subscription.add(
        this.ConfigurationService.updateClientLoginStatus(
          Clientloginid,
          jsonclientlogin
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else {
              this.clsUtility.showError("Status not updated");
            }
            this.getClientLoginById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddClientLogin() {
    try {
      this.editClientloginid = 0;
      this.EditClientloginid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditClientloginid = this.editClientloginid;
        $("#addclientloginModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClientLoginStatus(Clientloginid, ClientloginStatus) {
    try {
      let objClientlogin: Clientlogin;
      objClientlogin = new Clientlogin();
      objClientlogin.nloginid = Clientloginid;
      objClientlogin.bisactivelogin = ClientloginStatus;
      this.updateClientloginStatus(Clientloginid, objClientlogin);
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
