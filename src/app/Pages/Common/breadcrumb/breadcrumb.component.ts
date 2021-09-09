import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { BreadCrumb } from "src/app/Model/Common/breadcrumb";
import { distinctUntilChanged, filter, map } from "rxjs/operators";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    distinctUntilChanged(),
    map((event) => this.buildBreadCrumb(this.activatedRoute.root))
  );

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.breadcrumbs$);
    console.log(this.activatedRoute.root);
  }

  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: Array<BreadCrumb> = []
  ): Array<BreadCrumb> {
    console.log("route: ", route);
    // If no routeConfig is avalailable we are on the root path
    // const label = route.routeConfig
    //   ? route.routeConfig.data["breadcrumb"]
    //   : "Home";
    const label = route.routeConfig ? route.routeConfig.data["breadcrumb"] : "";
    const path = route.routeConfig ? route.routeConfig.path : "";
    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = `${url}${path}/`;
    const breadcrumb = {
      label: label,
      url: nextUrl,
    };
    const newBreadcrumbs = [...breadcrumbs, breadcrumb];
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
