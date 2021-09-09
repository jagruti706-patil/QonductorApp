import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { FilterService } from "../../../../Services/Common/filter.service";
import {
  Filter,
  OutputFilter,
  OutputAgent,
  InventoryInputModel,
  FliterClient,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { DataTransferService } from "../../../../Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-files",
  templateUrl: "./files.component.html",
  styleUrls: ["./files.component.css"],
})
export class FilesComponent implements OnInit, OnDestroy {
  private Clientid: number = 0;
  private Statusid: number = -1;
  public nSelectedClientID: number = 0;
  public selectedClientValue: number = 0;
  public Clientdetail: any = [];
  public sMasterStatus: any = [
    { Statusid: -1, Status: "All" },
    { Statusid: 1, Status: "Processed" },
    { Statusid: 0, Status: "Unprocessed" },
  ];
  // ["All", "Process", "Unprocess"];
  public ClientDefaultValue = { nclientid: 0, clientcodename: "All" };

  public FilesgridData: {};
  public FilesgridView: GridDataResult;
  private Filesitems: any[] = [];
  public Filesskip = 0;
  public FilespageSize = 10;

  private Files: any;
  private Filesid: number = 0;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public filterApplied = false;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  displaytotalrecordscount: number = 0;
  // Loading
  loadingFiles = true;
  loadingFilesGrid = true;

  public Filessort: SortDescriptor[] = [
    {
      field: "dtimportdate",
      dir: "desc",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private MasterService: MasterdataService,
    private ConfigurationService: ConfigurationService,
    private filterService: FilterService,
    private dataService: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.RetriveMasterData();
  }

  DropDownGroup = this.fb.group({
    fcClientName: [this.Clientid, Validators.required],
    fcMasterStatus: [this.Statusid, Validators.required],
  });

  get ClientName() {
    return this.DropDownGroup.get("fcClientName");
  }

  get MasterStatus() {
    return this.DropDownGroup.get("fcMasterStatus");
  }

  ngOnInit() {
    try {
      this.loadingFiles = true;
      this.Filesid = 0;
      this.getClientConfigurationById(this.Clientid);
      this.formValueChanged();
      // this.getFilesDetails(this.Clientid, this.Statusid);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ApplyFilter($event) {
    this.loadingFiles = true;
    this.loadingFilesGrid = true;
    var Fileevent = $event;
    this.Filesskip = 0;
    // console.log(Fileevent);

    if (Fileevent != null && Fileevent != undefined && Fileevent.length != 0) {
      this.Filesitems = Fileevent;
    } else {
      this.displaytotalrecordscount = 0;
      this.Filesitems = null;
    }

    if (Fileevent != null && Fileevent != undefined && Fileevent.length != 0)
      this.loadItemsFiles();
    else this.FilesgridView = null;
    this.loadingFiles = false;
    this.loadingFilesGrid = false;
    this.filterApplied = this.dataService.isFileFilterApplied;
  }

  formValueChanged(): any {
    try {
      this.Filesskip = 0;
      this.ClientName.valueChanges.subscribe(
        (data: number) => {
          if (data != null || data != undefined) {
            // this.getFilesDetails(
            //   this.ClientName.value,
            //   this.MasterStatus.value
            // );
          }
        },
        (err) => {
          this.loadingFiles = false;
        }
      );
      this.MasterStatus.valueChanges.subscribe(
        (data: number) => {
          if (data != null || data != undefined) {
            // this.getFilesDetails(
            //   this.ClientName.value,
            //   this.MasterStatus.value
            // );
          }
        },
        (err) => {
          this.loadingFiles = false;
        }
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientConfigurationById(id: number) {
    try {
      const filterinput = new Filter();
      filterinput.client = true;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = false;
      filterinput.automationstatus = false;
      filterinput.billingprovider = false;
      filterinput.insurance = false;
      filterinput.renderingprovider = false;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe(
            (data) => {
              if (data != null || data != undefined) {
                AllFilterJSON = data;
                if (AllFilterJSON.client != null) {
                  this.Clientdetail = AllFilterJSON.client;
                }
                this.selectedClientValue = 0;
              }
            },
            (err) => {
              this.loadingFiles = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  RetriveMasterData() {
    try {
      const filterclient = new FliterClient();
      filterclient.clientid = this.Clientid;
      this.lstFilter.client.push(filterclient);
      this.lstFilter.filestatus = -1;
      this.subscription.add(
        this.filterService
          .applyFilter(JSON.stringify(this.lstFilter), "File")
          .subscribe(
            (data) => {
              if (data != null && data != undefined) {
                this.Filesitems = data;
                if (data != null) this.loadItemsFiles();
                this.loadingFiles = false;
                this.loadingFilesGrid = false;
              }
            },
            (err) => {
              this.loadingFiles = false;
              this.loadingFilesGrid = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // getFilesDetails(Clientid: number, Statusid: number) {
  //   try {
  //     this.subscription.add(
  //       this.MasterService.getFileDetails(Clientid, Statusid).subscribe(
  //         async data => {
  //           if (data != null || data != undefined) {
  //             this.Filesitems = data;
  //             this.loadItemsFiles();
  //             await this.clsUtility.delay(1000);
  //           }
  //           this.loadingFiles = false;
  //         },
  //         err => {
  //           this.loadingFiles = false;
  //         }
  //       )
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  private loadItemsFiles(): void {
    try {
      this.FilesgridView = {
        data: orderBy(
          this.Filesitems.slice(
            this.Filesskip,
            this.Filesskip + this.FilespageSize
          ),
          this.Filessort
        ),
        total: this.Filesitems.length,
      };
      this.displaytotalrecordscount = this.FilesgridView.total;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortFilesChange(sort: SortDescriptor[]): void {
    try {
      if (this.Filesitems != null) {
        this.Filessort = sort;
        this.loadItemsFiles();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeFiles(event: PageChangeEvent): void {
    try {
      this.Filesskip = event.skip;
      this.loadItemsFiles();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onClientChange(event: any) {
    this.Filesskip = 0;
    this.nSelectedClientID = event;
    // this.getFilesDetails(this.nSelectedClientID, this.Statusid);
  }

  onMasterStatusChange(event: any) {
    // if (event == "Process") this.Statusid = 1;
    // else if (event == "Unprocess") this.Statusid = 0;
    // else this.Statusid = -1;
    this.Filesskip = 0;
    // this.getFilesDetails(this.nSelectedClientID, this.Statusid);
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
