import { Component, OnInit, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { Utility } from "src/app/Model/utility";
import { User, GCPUser } from "src/app/Model/Common/login";
import {
  Filter,
  OutputFilter,
  OutputAgent,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { Validators, FormBuilder } from "@angular/forms";
import { CoreauthService } from "../../../Services/Common/coreauth.service";
import { AuthRole } from "src/app/Model/Common/auth-class";
import { SubSink } from "../../../../../../node_modules/subsink";

@Component({
  selector: "app-agents",
  templateUrl: "./agents.component.html",
  styleUrls: ["./agents.component.css"],
  providers: [NgbRatingConfig],
})
export class AgentsComponent implements OnInit, OnDestroy {
  public RoleDefaultValue = { roleid: 0, rolename: "All" };
  Roles: AuthRole[];
  Users: GCPUser[];
  private clsUtility: Utility;
  private subscription = new SubSink();
  rating: any = 3;

  // Loading
  loadingAgenttask = true;

  constructor(
    private authService: CoreauthService,
    private fb: FormBuilder,
    private filterService: FilterService,
    config: NgbRatingConfig
  ) {
    this.clsUtility = new Utility();
    // customize default values of ratings used by this component tree
    config.max = 5;
    config.readonly = true;
  }
  AgentRoleGroup = this.fb.group({
    fcUserRole: ["", Validators.required],
  });

  get fbcUserRole() {
    return this.AgentRoleGroup.get("fcUserRole");
  }

  ngOnInit() {
    try {
      this.getRoles();
      this.formValueChanged();
      this.fetchAllUserRoleWise();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  SelectedRole: number = 0;
  formValueChanged(): any {
    try {
      this.subscription.add(
        this.fbcUserRole.valueChanges.subscribe(
          (data: number) => {
            // if (data !== 0) {
            // console.log(data);
            if (data != null || data != undefined) {
              this.SelectedRole = data;
              this.fetchAllUserRoleWise();
            }
            // }
          },
          (err) => {
            this.loadingAgenttask = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getRoles() {
    try {
      this.subscription.add(
        this.authService.getAllRoles().subscribe(
          (data) => {
            // console.log(data);
            if (data != null || data != undefined) {
              this.Roles = data;
            }
          },
          (err) => {
            this.loadingAgenttask = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  fetchAllUserRoleWise(): any {
    try {
      this.getUserList();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getUserList(): any {
    try {
      this.subscription.add(
        // this.authService.getUsersByRole(this.SelectedRole).subscribe(data => {
        //   if (data != null || data != undefined) {
        //     // console.log(data);
        //     this.Users = data;
        //   }
        //   this.loadingAgenttask = false;
        // })
        this.authService
          .getAllLocalUserWorkDetails(this.SelectedRole)
          .subscribe(
            (data) => {
              if (data != null || data != undefined) {
                // console.log(data);
                this.Users = data;
              }
              this.loadingAgenttask = false;
            },
            (err) => {
              this.loadingAgenttask = false;
            }
          )
      );
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
