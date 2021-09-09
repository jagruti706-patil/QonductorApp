import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Payercrosswalk } from "src/app/Model/AR Management/Configuration/payercrosswalk";
import { AddpayercrosswalkComponent } from "src/app/Pages/AR Management/Common/Configuration/payer-cross-walk/addpayercrosswalk/addpayercrosswalk.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-payercrosswalk",
  templateUrl: "./payercrosswalk.component.html",
  styleUrls: ["./payercrosswalk.component.css"],
})
export class PayercrosswalkComponent implements OnInit, OnDestroy {
  private Statusid: number = 0;

  public PayercrosswalkgridData: {};
  public PayercrosswalkgridView: GridDataResult;
  private Payercrosswalkitems: any[] = [];
  public Payercrosswalkskip = 0;
  // public PayercrosswalkpageSize = 3;

  private Payercrosswalkid: number = 0;
  public editPayercrosswalkid: number = 0;
  private deletePayercrosswalkid: number = 0;
  public EditPayercrosswalkid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public totalpagescount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;

  // Loading
  loadingpayercrosswalk = true;
  loadingpayercrosswalkGrid = true;

  @ViewChild("AddPayercrosswalkChild", { static: true })
  private AddPayercrosswalkChild: AddpayercrosswalkComponent;

  public Payercrosswalksort: SortDescriptor[] = [
    {
      field: "payername",
      dir: "desc",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    // this.pagesize = 130;
  }

  // StatusCrosswalkGroup = this.fb.group({
  //   fcCrosswalkStatus: ['', Validators.required],
  // });

  // get Status() {
  //   return this.StatusCrosswalkGroup.get('fcCrosswalkStatus');
  // }

  ngOnInit() {
    try {
      this.setStatus("StatusUnmapped");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getPayercrosswalkById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getPayercrosswalkById(
          this.Payercrosswalkid,
          this.Statusid,
          this.page,
          this.pagesize
        ).subscribe((data) => {
          if (data.content != null || data.content != undefined) {
            this.displaycurrentpages = data.pageable.pageNumber + 1;
            this.displaytotalpages = data.totalPages;
            this.totalpagescount = data.totalPages;
            this.displaytotalrecordscount = data.totalElements;
            // console.log(data);

            // this.PayercrosswalkgridData = data;
            // this.Payercrosswalkitems = data;
            // this.loadPayercrosswalkitems();
          } else {
            this.displaycurrentpages = 0;
            this.displaytotalpages = 0;
            this.totalpagescount = 0;
            this.displaytotalrecordscount = 0;
            this.Payercrosswalkitems = null;
            this.PayercrosswalkgridView = null;
          }
          this.displaycurrentpages = data.pageable.pageNumber + 1;
          this.displaytotalpages = data.totalPages;
          this.totalpagescount = data.totalPages;
          this.displaytotalrecordscount = data.totalElements;
          if (JSON.stringify(data.last) == "true") {
            this.Isnextdisabled = true;
          } else {
            this.Isnextdisabled = false;
          }
          if (this.page == 0) {
            this.Ispreviousdisabled = true;
          } else {
            this.Ispreviousdisabled = false;
          }

          this.PayercrosswalkgridData = data.content;
          this.Payercrosswalkitems = data.content;
          if (data.content != null) this.loadPayercrosswalkitems();
          else this.PayercrosswalkgridView = null;
          this.loadingpayercrosswalk = false;
          this.loadingpayercrosswalkGrid = false;
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadPayercrosswalkitems(): void {
    try {
      this.PayercrosswalkgridView = {
        data: orderBy(this.Payercrosswalkitems, this.Payercrosswalksort),
        total: this.Payercrosswalkitems.length,
        // data: orderBy(
        //   this.Payercrosswalkitems.slice(
        //     this.Payercrosswalkskip,
        //     this.Payercrosswalkskip + this.PayercrosswalkpageSize
        //   ),
        //   this.Payercrosswalksort
        // ),
        // total: this.Payercrosswalkitems.length
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortPayercrosswalkChange(sort: SortDescriptor[]): void {
    try {
      if (this.Payercrosswalkitems != null) {
        this.Payercrosswalksort = sort;
        this.loadPayercrosswalkitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangePayercrosswalk(event: PageChangeEvent): void {
    try {
      this.Payercrosswalkskip = event.skip;
      this.loadPayercrosswalkitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditPayercrosswalk({ sender, rowIndex, dataItem }) {
    try {
      this.editPayercrosswalkid = dataItem.crosswalkid;
      this.InputEditMessage = "Do you want to edit payer crosswalk?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  DeletePayercrosswalk({ sender, rowIndex, dataItem }) {
    try {
      this.deletePayercrosswalkid = dataItem.crosswalkid;
      this.InputDeleteMessage = "Do you want to delete payercrosswalk?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  deletePayercrosswalk() {
    try {
      this.subscription.add(
        this.ConfigurationService.deletePayercrosswalk(
          this.deletePayercrosswalkid
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              alert("Payercrosswalk deleted successfully");
            } else {
              alert("Payercrosswalk not deleted");
            }
            this.Payercrosswalkid = 0;
            this.getPayercrosswalkById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updatePayercrosswalkStatus(Payercrosswalkid, Payercrosswalk) {
    try {
      const jsonpayercrosswalk = JSON.stringify(Payercrosswalk);
      this.subscription.add(
        this.ConfigurationService.updatePayercrosswalkStatus(
          Payercrosswalkid,
          jsonpayercrosswalk
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else {
              this.clsUtility.showError("Status not updated");
            }
            this.getPayercrosswalkById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddPayercrosswalk() {
    try {
      this.editPayercrosswalkid = 0;
      this.EditPayercrosswalkid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditPayercrosswalkid = this.editPayercrosswalkid;
        $("#addpayercrosswalkModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputDeleteResult($event) {
    try {
      this.OutDeleteResult = $event;
      if (this.OutDeleteResult == true) {
        this.deletePayercrosswalk();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputPayercrosswalkEditResult($event) {
    try {
      this.Payercrosswalkid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getPayercrosswalkById();
      }
      this.AddPayercrosswalkChild.ResetComponents();
      this.editPayercrosswalkid = null;
      this.EditPayercrosswalkid = null;
      $("#addpayercrosswalkModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  setStatus(Status: string) {
    try {
      this.page = 0;
      this.Payercrosswalkskip = 0;
      if (Status == "StatusAll") this.Statusid = 0;
      else if (Status == "StatusMapped") this.Statusid = 1;
      else this.Statusid = 2;
      this.Payercrosswalkskip = 0;
      this.getPayercrosswalkById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnPayercrosswalkStatus(Payercrosswalkid, PayercrosswalkStatus) {
    try {
      let objPayercrosswalk: Payercrosswalk;
      objPayercrosswalk = new Payercrosswalk();
      objPayercrosswalk.crosswalkid = Payercrosswalkid;
      objPayercrosswalk.bisactive = PayercrosswalkStatus;
      this.updatePayercrosswalkStatus(Payercrosswalkid, objPayercrosswalk);
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

  onClickPrevious() {
    try {
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        this.getPayercrosswalkById();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        this.getPayercrosswalkById();
      }
    } catch (error) {
      this.page = this.page - 1;
      this.clsUtility.LogError(error);
    }
  }
}
