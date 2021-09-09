import { Component } from "@angular/core";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
// declare let gtag: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  private IsLogin: boolean = false;

  constructor(
    private route: Router,
    private datatransfer: DataTransferService
  ) {
    const navEndEvent$ = route.events.pipe(
      filter((e) => e instanceof NavigationEnd)
    );

    // navEndEvent$.subscribe((e: NavigationEnd) => {
    //   gtag("config", "UA-108651057-5", { page_path: e.urlAfterRedirects });
    //   // gtag('set', {'user_id': 'USER_ID'});
    // });
  } //constructor

  title = "qonductor";

  ngOnInit() {
    // if (this.datatransfer.IsLogin != undefined)
    // this.IsLogin = this.datatransfer.IsLogin;
    // console.log(JSON.stringify(this.IsLogin));
  }
}
