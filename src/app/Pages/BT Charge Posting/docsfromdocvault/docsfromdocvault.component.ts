import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Utility, enumOrderAssignSource } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { DatePipe } from "@angular/common";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import {
  GetFolders,
  GetCategory,
} from "src/app/Model/AR Management/Configuration/cabinet";
import { Api } from "../../Services/BT/api";
import { Observable, Subscription } from "rxjs";
import { SubSink } from "subsink";

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import {
  GridComponent,
  GridDataResult,
  DataStateChangeEvent,
  PageChangeEvent,
  SelectableSettings,
  RowArgs,
} from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { process, State } from "@progress/kendo-data-query";

import * as moment from "moment";

@Component({
  selector: "app-docsfromdocvault",
  templateUrl: "./docsfromdocvault.component.html",
  styleUrls: ["./docsfromdocvault.component.css"],
})
export class DocsfromdocvaultComponent implements OnInit {
  //subscription: Subscription;

  private subscription = new SubSink();

  public sort: SortDescriptor[] = [
    {
      field: "Name",
      dir: "asc",
    },
  ];
  public state: State = {
    skip: 0,
    take: 10000,
  };

  minimode: boolean = true;

  folders: GetFolders[];
  categories: GetCategory[];
  clsUtility: Utility;
  years: Array<any> = [{ year: 2020 }, { year: 2021 }, { year: 2022 }];

  public defaultYear = { year: 2019 };
  public folderDefaultValue = { foldername: "All" };
  public categoryDefaultValue = { categoryname: "All" };
  frmfilters: FormGroup;
  toggleme: boolean = true;
  sortdirection: boolean = true;
  loading: boolean = false;
  loadingfiles: boolean = false;
  loadingpdf: boolean = false;
  public activesessioninfo: any;
  public cabinetlist: any;
  public folderlist: any;
  public sub_folderlist: any;
  public copy_sub_folderlist: any;
  public OG_filelist: any;
  public filelist: any;
  public selectedfiledata: any;
  public gridView: GridDataResult;
  public selectedproduct: any = "";
  public fileofday: string = "";
  public doctoken: string = "";
  public OGdoctoken: string = "";
  public docUserID: string = "";
  public currenttoken: string = "";
  searching: boolean = false;
  filterName: string = "";

  constructor(
    fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private filterService: FilterService,
    private dataService: DataTransferService,
    private api: Api
  ) {
    this.clsUtility = new Utility();

    this.frmfilters = fb.group({
      fcCabinet: [""],
      fcSelectedfolder: [""],
      fcYear: [""],
      fcFolder: [""],
      fcCategory: [""],
      fcfinalfolder: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.get_Cabinetlist();
    //this.getactivesessioninfo(true);
    // this.getFolders();
    // this.getCategory();
  }

  get_Cabinetlist() {
    try {
      let seq = this.api.get_docservice("DocsVault/cabinate");
      this.subscription.add(
        seq.subscribe(
          (res) => {
            if (res != undefined && res != null) {
              this.cabinetlist = res.sort().reverse();
              if (this.cabinetlist.length > 0) {
                this.toastr.success("Cabinet List Loaded");
                this.cabinetlist.forEach((item, index) => {
                  if (item.folderName === "Triarq")
                    this.cabinetlist.splice(index, 1);
                });
              }
            } else {
              this.toastr.warning("Unable to Get Cabinet List");
            }
          },
          (err) => {
            this.loading = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  get_foldercontents() {
    if (
      this.frmfilters.controls.fcCabinet.value == "" ||
      this.frmfilters.controls.fcCabinet.value == null
    ) {
      this.toastr.warning("Select Cabinet");
      return;
    }

    this.loading = true;
    try {
      let seq = this.api.get_docservice(
        "DocsVault/getFolderContent/" +
          this.frmfilters.controls.fcCabinet.value +
          ""
      );
      this.subscription.add(
        seq.subscribe(
          (res) => {
            this.loading = false;
            if (res != undefined && res != null) {
              this.folderlist = res;
              this.toastr.success("Cabinet Folders Loaded");
            } else {
              this.toastr.warning("Unable to Get Folder List");
            }
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            console.log(err);
          }
        )
      );
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  get_subfoldercontents() {
    if (
      this.frmfilters.controls.fcSelectedfolder.value == "" ||
      this.frmfilters.controls.fcSelectedfolder.value == null
    ) {
      this.toastr.warning("Select Folder");
      return;
    }

    this.loading = true;
    try {
      //let seq = this.api.get_docvault_external("FolderDetails/GetFolderContents?TokenID=" + this.currenttoken + "&FolderID=" + this.frmfilters.controls.fcSelectedfolder.value + "&Format=json");
      let seq = this.api.get_docservice(
        "DocsVault/getFolderContent/" +
          this.frmfilters.controls.fcSelectedfolder.value +
          ""
      );
      this.subscription.add(
        seq.subscribe(
          (res) => {
            this.loading = false;
            if (res != undefined && res != null) {
              this.sub_folderlist = res;
              if (this.sub_folderlist.length > 0) {
                this.toastr.success("Sub Folder Loaded");
                this.sub_folderlist = this.sub_folderlist.filter(
                  (item) => item.name === "ADD ONS" || item.name === "ADD ON"
                );
                this.copy_sub_folderlist = this.sub_folderlist.slice();
              }
            } else {
              this.toastr.warning("Unable to Get Sub Folder List");
            }
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            console.log(err);
          }
        )
      );
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  sortfiles() {
    if (this.OG_filelist != null && this.OG_filelist != undefined) {
      if (this.OG_filelist.length > 0) {
        if (this.sortdirection) {
          this.OG_filelist = this.OG_filelist.sort(
            (a, b) =>
              Number(b.ffid.toString().replace(/\D/g, "")) -
              Number(a.ffid.toString().replace(/\D/g, ""))
          );
          this.filelist = this.OG_filelist;
        } else {
          this.OG_filelist = this.OG_filelist.sort(
            (a, b) =>
              Number(a.ffid.toString().replace(/\D/g, "")) -
              Number(b.ffid.toString().replace(/\D/g, ""))
          );
          this.filelist = this.OG_filelist;
        }
      }
    }
  }

  get_files() {
    if (
      this.frmfilters.controls.fcfinalfolder.value == "" ||
      this.frmfilters.controls.fcfinalfolder.value == null
    ) {
      this.toastr.warning("Select Sub Folder");
      return;
    }
    try {
      this.fileofday = this.sub_folderlist.find(
        (s) => s.ffid.toString() == this.frmfilters.controls.fcfinalfolder.value
      )["name"];
    } catch (error) {}

    this.loadingfiles = true;
    try {
      let seq = this.api.get_docservice(
        "DocsVault/getFolderContent/" +
          this.frmfilters.controls.fcfinalfolder.value +
          ""
      );
      this.subscription.add(
        seq.subscribe(
          (res) => {
            if (res != undefined && res != null) {
              this.OG_filelist = res;
              //this.OG_filelist = this.OG_filelist.sort((a, b) => Number(this.getTime(b.createdDate)) - Number(this.getTime(a.createdDate)));
              //this.OG_filelist.forEach(item => item.sortcol = item['ffid'].toString().replace(/\D/g,''));
              //this.OG_filelist = this.OG_filelist.sort((a, b) => Number(b.sortcol) - Number(a.sortcol));
              this.OG_filelist = this.OG_filelist.sort(
                (a, b) =>
                  Number(b.ffid.toString().replace(/\D/g, "")) -
                  Number(a.ffid.toString().replace(/\D/g, ""))
              );
              this.filelist = this.OG_filelist;
              //this.gridView = process(this.filelist, this.state);
            }
            this.loadingfiles = false;
          },
          (err) => {
            this.loadingfiles = false;
            console.log(err);
          }
        )
      );
    } catch (error) {
      this.loadingfiles = false;
      this.clsUtility.LogError(error);
    }
  }

  load_document(item: any) {
    this.get_filecontent(item.ffid);
  }

  get_filecontent(fileid) {
    let file_id = fileid;
    this.loadingpdf = true;
    try {
      let seq = this.api.get_docservice_filedownload(
        "DocsVault/download/" + fileid + ""
      );
      this.subscription.add(
        seq.subscribe(
          (res) => {
            this.loadingpdf = false;
            if (res != undefined && res != null) {
              if (res.size != undefined && res.size != null) {
                if (res.size == 0) {
                  this.toastr.warning(
                    "Unable to Get PDF Document, Wait Re-attempting."
                  );
                  this.pdfViewer.pdfSrc = "";
                  this.pdfViewer.refresh();
                } else {
                  this.reAttempt_pdf = 0;
                  this.pdfViewer.pdfSrc = res;
                  this.pdfViewer.refresh();
                }
              }
            }
            this.loadingpdf = false;
          },
          (err) => {
            this.loadingpdf = false;
            console.log(err);
          }
        )
      );
    } catch (error) {
      this.loadingpdf = false;
      this.clsUtility.LogError(error);
    }
  }

  getactivesessioninfo(loadcabinet: boolean = false) {
    this.loading = true;
    try {
      let seq = this.api.get_docservice("login");
      this.subscription.add(
        seq.subscribe(
          (res) => {
            // console.log("activesessioninfo");
            // console.log(res);
            // console.log(res["tokenId"]);
            this.currenttoken = res["tokenId"];
            this.activesessioninfo = res;
            this.loading = false;
            if (this.currenttoken == "") {
              this.toastr.warning("Unable to Get Token");
            } else {
              //this.toastr.success('Token Set Successfully');
              if (loadcabinet) {
                this.getlistofcabinets();
              }
            }
          },
          (err) => {
            this.loading = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  getactivesessioninfo_copy() {
    this.loading = true;
    try {
      let seq = this.api.get_docservice("login");
      this.subscription.add(
        seq.subscribe(
          (res) => {
            // console.log("activesessioninfo");
            // console.log(res);
            // console.log(res["tokenId"]);
            this.currenttoken = res["tokenId"];
            this.loading = false;
            if (this.currenttoken == "") {
              this.toastr.warning("Unable to Get Token");
            } else {
              this.toastr.success("Token Set Successfully");
            }
          },
          (err) => {
            this.loading = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  reAttemptCabinet = 0;
  maxreAttemptCabinet = 2;

  getlistofcabinets() {
    if (this.currenttoken != "") {
      this.loading = true;
      try {
        let seq = this.api.get_docvault_external(
          "FolderDetails/GetListOfCabinets?TokenID=" +
            this.currenttoken +
            "&Format=json"
        );
        this.subscription.add(
          seq
            // .map((res) => res.json())
            .subscribe(
              (res) => {
                this.loading = false;
                if (res != undefined && res != null) {
                  if (res.Response.Message == "Invalid TokenID") {
                    this.toastr.error("Token Invaild or Expired");
                    this.getactivesessioninfo();

                    this.reAttemptCabinet = this.reAttemptCabinet + 1;
                    if (this.reAttemptCabinet <= this.maxreAttemptCabinet) {
                      // console.log(
                      //   "Inside Cabinet ReAttempt Call - " +
                      //     String(this.reAttemptCabinet)
                      // );
                      this.getlistofcabinets();
                    }
                  } else if (res.Response.Message == "Operation Successful") {
                    this.reAttemptCabinet = 0;
                    this.toastr.success("Cabinet List Loaded");
                  } else {
                  }
                  if (res.Result != undefined && res.Result != null) {
                    this.cabinetlist = res.Result;
                  }
                }
              },
              (err) => {
                this.loading = false;
                console.log(err);
              }
            )
        );
      } catch (error) {
        this.loading = false;
        this.clsUtility.LogError(error);
      }
    } else {
      this.toastr.warning("Token Not Set");
    }
  }

  reAttempt_foldercontent = 0;
  maxreAttempt_foldercontent = 2;

  getfoldercontents() {
    if (
      this.frmfilters.controls.fcCabinet.value == "" ||
      this.frmfilters.controls.fcCabinet.value == null
    ) {
      this.toastr.warning("Select Cabinet");
      return;
    }

    if (this.currenttoken != "") {
      this.loading = true;
      try {
        let seq = this.api.get_docvault_external(
          "FolderDetails/GetFolderContents?TokenID=" +
            this.currenttoken +
            "&FolderID=" +
            this.frmfilters.controls.fcCabinet.value +
            "&Format=json"
        );
        this.subscription.add(
          seq
            // .map((res) => res.json())
            .subscribe(
              (res) => {
                this.loading = false;
                if (res != undefined && res != null) {
                  if (res.Response.Message == "Invalid TokenID") {
                    this.toastr.error("Token Invaild or Expired");

                    //ReAttempt after fetching updated Token
                    this.reAttempt_foldercontent =
                      this.reAttempt_foldercontent + 1;
                    if (
                      this.reAttempt_foldercontent <=
                      this.maxreAttempt_foldercontent
                    ) {
                      // console.log(
                      //   "Inside getfoldercontents ReAttempt Call - " +
                      //     String(this.reAttempt_foldercontent)
                      // );
                      let seq = this.api.get_docservice("login");
                      this.subscription.add(
                        seq.subscribe(
                          (res) => {
                            if (res != undefined && res != null) {
                              this.currenttoken = res["tokenId"];
                              this.getfoldercontents();
                            }
                          },
                          (err) => {
                            console.log("Error While fetching token");
                          }
                        )
                      );
                    }
                  } else if (res.Response.Message == "Operation Successful") {
                    this.reAttempt_foldercontent = 0;
                    this.toastr.success("Cabinet Folders Loaded");
                  } else {
                  }
                  if (res.Result != undefined && res.Result != null) {
                    this.folderlist = res.Result;
                    //this.folderlist.forEach(item => item.folderinfo = item['Name'] + '  / Haschild  ' + item['Haschild']);
                    console.log(res.Response.Message);
                  }
                }
                this.loading = false;
              },
              (err) => {
                this.loading = false;
                console.log(err);
              }
            )
        );
      } catch (error) {
        this.loading = false;
        this.clsUtility.LogError(error);
      }
    } else {
      this.toastr.warning("Token Not Set");
    }
  }

  reAttempt_Subfoldercontent = 0;
  maxreAttempt_Subfoldercontent = 2;

  getsubfoldercontents() {
    // console.log("this.frmfilters.controls.fcSelectedfolder.value");
    // console.log(this.frmfilters.controls.fcSelectedfolder.value);

    if (
      this.frmfilters.controls.fcSelectedfolder.value == "" ||
      this.frmfilters.controls.fcSelectedfolder.value == null
    ) {
      this.toastr.warning("Select Folder");
      return;
    }

    this.loading = true;
    try {
      let seq = this.api.get_docvault_external(
        "FolderDetails/GetFolderContents?TokenID=" +
          this.currenttoken +
          "&FolderID=" +
          this.frmfilters.controls.fcSelectedfolder.value +
          "&Format=json"
      );
      this.subscription.add(
        seq
          // .map((res) => res.json())
          .subscribe(
            (res) => {
              this.loading = false;
              if (res != undefined && res != null) {
                if (res.Response.Message == "Invalid TokenID") {
                  this.toastr.error("Token Invaild or Expired");
                  //ReAttempt after fetching updated Token

                  this.reAttempt_Subfoldercontent =
                    this.reAttempt_Subfoldercontent + 1;
                  if (
                    this.reAttempt_Subfoldercontent <=
                    this.maxreAttempt_Subfoldercontent
                  ) {
                    // console.log(
                    //   "Inside getsubfoldercontents ReAttempt Call - " +
                    //     String(this.reAttempt_Subfoldercontent)
                    // );
                    let seq = this.api.get_docservice("login");
                    this.subscription.add(
                      seq.subscribe(
                        (res) => {
                          if (res != undefined && res != null) {
                            this.currenttoken = res["tokenId"];
                            this.getsubfoldercontents();
                          }
                        },
                        (err) => {
                          console.log("Error While fetching token");
                        }
                      )
                    );
                  }
                } else if (res.Response.Message == "Operation Successful") {
                  this.reAttempt_Subfoldercontent = 0;
                  this.toastr.success("Sub Folder List Loaded");
                } else if (res.Response.Message == "No data to return") {
                  this.toastr.warning("No data to return");
                } else {
                }

                if (res.Result != undefined && res.Result != null) {
                  this.sub_folderlist = res.Result;
                  this.copy_sub_folderlist = this.sub_folderlist.slice();
                }
              }

              this.loading = false;
            },
            (err) => {
              this.loading = false;
              console.log(err);
            }
          )
      );
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  clear() {
    this.searching = false;
    this.filterName = "";
    this.filelist = this.OG_filelist;
  }

  filteritem(stringval: string) {
    if (this.OG_filelist != undefined && this.OG_filelist != null) {
      if (this.OG_filelist.length > 0) {
        this.filelist = this.OG_filelist.filter(
          (s) =>
            s.name.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1
        );
      }
    }
  }

  handleFilter(value) {
    this.copy_sub_folderlist = this.sub_folderlist.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  loaddocument(item: any) {
    this.getfilecontent(item.FFID);
  }

  reAttempt_files = 0;
  maxreAttempt_files = 2;

  getfiles() {
    if (
      this.frmfilters.controls.fcfinalfolder.value == "" ||
      this.frmfilters.controls.fcfinalfolder.value == null
    ) {
      this.toastr.warning("Select Sub Folder");
      return;
    }
    //this.fileofday

    try {
      this.fileofday = this.sub_folderlist.find(
        (s) => s.FFID.toString() == this.frmfilters.controls.fcfinalfolder.value
      )["Name"];
    } catch (error) {}

    this.loadingfiles = true;
    try {
      let seq = this.api.get_docvault_external(
        "FolderDetails/GetFolderContents?TokenID=" +
          this.currenttoken +
          "&FolderID=" +
          this.frmfilters.controls.fcfinalfolder.value +
          "&Format=json"
      );
      this.subscription.add(
        seq
          // .map((res) => res.json())
          .subscribe(
            (res) => {
              if (res != undefined && res != null) {
                if (res.Response.Message == "Invalid TokenID") {
                  this.toastr.error("Token Invaild or Expired");

                  //ReAttempt after fetching updated Token
                  this.reAttempt_files = this.reAttempt_files + 1;
                  if (this.reAttempt_files <= this.maxreAttempt_files) {
                    // console.log(
                    //   "Inside getfiles ReAttempt Call - " +
                    //     String(this.reAttempt_files)
                    // );
                    let seq = this.api.get_docservice("login");
                    this.subscription.add(
                      seq.subscribe(
                        (res) => {
                          if (res != undefined && res != null) {
                            this.currenttoken = res["tokenId"];
                            this.getfiles();
                          }
                        },
                        (err) => {
                          console.log("Error While fetching token");
                        }
                      )
                    );
                  }
                } else if (res.Response.Message == "Operation Successful") {
                  this.reAttempt_files = 0;
                  this.toastr.success("PDF Files Loaded");
                } else if (res.Response.Message == "No data to return") {
                  this.reAttempt_files = 0;
                  this.toastr.warning("No data to return");
                } else {
                }

                if (res.Result != undefined && res.Result != null) {
                  this.OG_filelist = res.Result;
                  this.filelist = res.Result;

                  this.gridView = process(this.filelist, this.state);
                }
              }
              this.loadingfiles = false;
            },
            (err) => {
              this.loadingfiles = false;
              console.log(err);
            }
          )
      );
    } catch (error) {
      this.loadingfiles = false;
      this.clsUtility.LogError(error);
    }
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.filelist, this.state);
  }

  cmbfolderchange(event) {
    // console.log("cmbclientchange");
    // console.log(event);
  }

  @ViewChild("pdfViewerAutoLoad", { static: true }) pdfViewer;

  reAttempt_pdf = 0;
  maxreAttempt_pdf = 2;

  getfilecontent(fileid) {
    let file_id = fileid;
    this.loadingpdf = true;
    try {
      let seq = this.api.get_docvault_externalfiledownload(
        "Download/DownloadFile?TokenID=" +
          this.currenttoken +
          "&FileID=" +
          fileid +
          ""
      );
      this.subscription.add(
        seq
          // .map(res => res.json())
          // .map((res) => {
          //   // console.log("b4 Map");
          //   // console.log(res);
          //   return new Blob([res.blob()], { type: "application/pdf" });
          // })
          .subscribe(
            (res) => {
              this.loadingpdf = false;
              // console.log("After Map");
              if (res != undefined && res != null) {
                // console.log(res);
                if (res.size != undefined && res.size != null) {
                  if (res.size == 0) {
                    this.toastr.warning(
                      "Unable to Get PDF Document, Wait Re-attempting."
                    );
                    this.pdfViewer.pdfSrc = "";
                    this.pdfViewer.refresh();

                    //ReAttempt after fetching updated Token
                    this.reAttempt_pdf = this.reAttempt_pdf + 1;
                    if (this.reAttempt_pdf <= this.maxreAttempt_pdf) {
                      // console.log(
                      //   "Inside getfilecontent ReAttempt Call - " +
                      //     String(this.reAttempt_pdf)
                      // );
                      let seq = this.api.get_docservice("login");
                      this.subscription.add(
                        seq.subscribe(
                          (res) => {
                            if (res != undefined && res != null) {
                              this.currenttoken = res["tokenId"];
                              this.getfilecontent(file_id);
                            }
                          },
                          (err) => {
                            console.log("Error While fetching token");
                          }
                        )
                      );
                    }
                  } else {
                    this.reAttempt_pdf = 0;
                    this.pdfViewer.pdfSrc = res;
                    this.pdfViewer.refresh();
                  }
                }
              }
              this.loadingpdf = false;
            },
            (err) => {
              this.loadingpdf = false;
              console.log(err);
            }
          )
      );
    } catch (error) {
      this.loadingpdf = false;
      this.clsUtility.LogError(error);
    }
  }

  getFolders() {
    try {
      this.filterService.getFolders().subscribe(
        (data) => {
          this.folders = <GetFolders[]>data;
          let julianDay = moment().dayOfYear().toString(); // Julian day
          let julianDayObj: GetFolders = this.folders.find(
            (element) => element.foldername <= julianDay
          );
          if (julianDayObj) {
            this.frmfilters.controls["fcFolder"].setValue(
              julianDayObj.foldername
            );
          }
        },
        (error) => {
          // this.clsUtility.showError(error);
        }
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  getCategory() {
    try {
      this.filterService.getCategory().subscribe(
        (data) => {
          this.categories = <GetCategory[]>data;
        },
        (error) => {
          // this.clsUtility.showError(error);
        }
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  ngOnDestroy() {
    try {
      // Unsubscribe when the component is destroyed
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}

//   keydown(event: any) {
//     const pattern = /[0-9]/;
//     const inputChar = String.fromCharCode(event.charCode);
//     console.log('inputChar');
//     console.log(inputChar);
// //alert(inputChar);
//     // if (!pattern.test(inputChar)) {
//     //     // invalid character, prevent input
//     //     event.preventDefault();
//     // }
//     if(this.OG_filelist != undefined && this.OG_filelist != null)
//     {
//       if (this.OG_filelist.length > 0) {
//         this.filelist = this.OG_filelist.filter(
//           s => s.Name.indexOf(this.filterName) !== -1
//         );
//       }
//     }
//   }

// doclogin() {
//   this.loading = true;
//   let getclient: { UserName: string,Password: string } = {
//     UserName: 'sagar',Password:'19triarq!'
//   };
//   console.log(getclient);
//   //https://www.yourdomain.com/DocsvaultAPI/LoginPost?UserName={UserName}&Password={Password}
//   try {
//     let seq = this.api.post_docvault_external("LoginPost?UserName={sagar}&Password={19triarq!}",null)
//     seq
//      // .map(res => res.json())
//       .subscribe(res => {
//         this.loading = false;
//         console.log('doclogin POST');
//         console.log(res);
//         // if (res != undefined && res != null) {
//         // this.toastr.info(res.Response.Message);
//         //   if (res.Result != undefined && res.Result != null) {
//         //     this.doctoken = res.Result.TokenID;
//         //     this.OGdoctoken = res.Result.TokenID;
//         //     this.doctoken = res.Result.TokenID;
//         //     this.currenttoken = this.doctoken;
//         //   }
//         // }
//       },
//         err => {
//           this.loading = false;
//           console.log(err);
//         }
//       );
//   } catch (error) {
//     this.loading = false;
//     this.clsUtility.LogError(error);
//   }
// }

// doclogin() {
//   this.loading = true;
//   try {
//     let seq = this.api.get_docvault_external("Login?UserName=sagar&Password=19triarq!&Format=JSON")
//     seq
//       .map(res => res.json())
//       .subscribe(res => {
//         this.loading = false;
//         console.log('doclogin');
//         console.log(res);
//         if (res != undefined && res != null) {
//         this.toastr.info(res.Response.Message);
//           if (res.Result != undefined && res.Result != null) {
//             this.doctoken = res.Result.TokenID;
//             this.OGdoctoken = res.Result.TokenID;
//             this.doctoken = res.Result.TokenID;
//             this.currenttoken = this.doctoken;
//           }
//         }
//       },
//         err => {
//           this.loading = false;
//           console.log(err);
//         }
//       );
//   } catch (error) {
//     this.loading = false;
//     this.clsUtility.LogError(error);
//   }
// }

// doclogout() {
//   this.loading = true;
//   try {
//     let seq = this.api.get_docvault_external("Logout?TokenID="+ this.doctoken +"&UserName=sagar")
//     seq
//       .subscribe(res => {
//         this.loading = false;
//         console.log('doclogout');
//         console.log(res);

//         if (res != undefined && res != null) {

//         }
//       },
//         err => {
//           this.loading = false;
//           console.log(err);
//         }
//       );
//   } catch (error) {
//     this.loading = false;
//     this.clsUtility.LogError(error);
//   }
// }
