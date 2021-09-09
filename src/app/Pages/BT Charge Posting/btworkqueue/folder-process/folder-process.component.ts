import { Component, OnInit } from "@angular/core";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import {
  GridDataResult,
  PageChangeEvent,
  SelectableSettings,
  SelectableMode,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import {
  FolderCategoryAndYearModel,
  GetFolders,
} from "src/app/Model/AR Management/Configuration/cabinet";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";

@Component({
  selector: "app-folder-process",
  templateUrl: "./folder-process.component.html",
  styleUrls: ["./folder-process.component.css"],
})
export class FolderProcessComponent implements OnInit {
  public pagesize: number = 0;
  public mode: SelectableMode = "multiple";
  public OrderSelected: any = [];
  loading: boolean = false;
  loadingGrid: boolean = false;
  // public folderDefaultValue = { externalid: "0", foldername: "All" };
  OrderGridData: any[] = [];
  OrderGridView: GridDataResult;
  private clsUtility: Utility;
  vwExportButton = false;
  private subscription = new SubSink();
  public selectableSettings: SelectableSettings;
  public OrderSort: SortDescriptor[] = [];
  folders: any[] = [];
  cabinets: any[] = [];
  public OrderSkip = 0;

  constructor(
    private configurationService: ConfigurationService,
    private toaster: ToastrService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private fb: FormBuilder,
    private coreService: CoreOperationService
  ) {
    this.setSelectableSettings();
    this.clsUtility = new Utility(toaster);
    // this.pagesize = 20;
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
      mode: this.mode,
    };
  }

  FolderProcessForm: FormGroup = this.fb.group({
    fcFolder: [],
    fcCabinet: [],
  });

  get fcFolder() {
    return this.FolderProcessForm.get("fcFolder");
  }
  get fcCabinet() {
    return this.FolderProcessForm.get("fcCabinet");
  }
  ngOnInit() {
    this.pagesize = this.clsUtility.pagesize;
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
        }
      })
    );
    this.getCabinets();
  }
  public selectedCallback = (args) => args.dataItem;
  getCabinets() {
    try {
      this.subscription.add(
        this.configurationService.Getfolderdata("0").subscribe(
          (data) => {
            if (data) {
              this.cabinets = data;
              for (let i = 0; i < this.cabinets.length; i++) {
                if (this.cabinets[i].status) {
                  this.fcCabinet.setValue(this.cabinets[i].externalid);
                }
              }
              this.getFolders(this.fcCabinet.value);
            } else {
              this.cabinets = null;
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

  public selectionChange(item: any): void {
    this.getFolders(item.externalid);
  }

  OrderloadItems() {
    try {
      if (this.OrderGridData) {
        this.OrderGridView = {
          data: orderBy(
            this.OrderGridData.slice(
              this.OrderSkip,
              this.OrderSkip + this.pagesize
            ),
            this.OrderSort
          ),
          total: this.OrderGridData.length,
        };
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OrderSortChange(sort: SortDescriptor[]): void {
    if (this.OrderGridData != null) {
      this.OrderSort = sort;
      this.OrderloadItems();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getFolders(cabinetId: string) {
    try {
      this.fcFolder.reset();
      this.folders = [];
      this.subscription.add(
        this.coreService.getFoldersForProcess(cabinetId).subscribe(
          (data) => {
            this.folders = data;
            // console.log(data);
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
  getQueue() {
    try {
      this.OrderGridView = null;
      this.OrderGridData = [];
      let externalId = this.fcFolder.value;
      if (externalId) {
        this.loadingGrid = true;
        this.OrderSelected = [];
        this.subscription.add(
          this.coreService.getFoldersDifference(externalId).subscribe(
            (data) => {
              // console.log(data);
              if (data) {
                this.OrderGridData = data;
              } else {
                this.OrderGridData = [];
              }
              this.OrderSkip = 0;
              this.OrderloadItems();
              this.loadingGrid = false;
            },
            (error) => {
              this.loadingGrid = false;
              this.clsUtility.showError(error);
            }
          )
        );
      } else {
        this.clsUtility.showInfo("Select folder");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  processFolder() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo("Select folder(s) to process");
        return;
      }
      this.loading = true;
      this.subscription.add(
        this.coreService.reprocessFolders(this.OrderSelected).subscribe(
          (data) => {
            // console.log(data);
            if (data == 1) {
              this.clsUtility.showSuccess("Folder(s) processed successfully");
              this.OrderSelected = [];
              this.getQueue();
            } else {
              this.clsUtility.showError("Error while processing folder(s)");
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.loading = false;
      this.clsUtility.showError(error);
    }
  }

  OrderPageChange(event: PageChangeEvent): void {
    this.OrderGridView = null;
    this.OrderSkip = event.skip;
    this.OrderloadItems();
  }
}
