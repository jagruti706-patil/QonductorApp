import { Component, OnInit, Input } from '@angular/core';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agentview',
  templateUrl: './agentview.component.html',
  styleUrls: ['./agentview.component.css'],
  providers: [NgbRatingConfig]
})
export class AgentviewComponent implements OnInit {
  @Input() Agent: any = [];
  constructor(config: NgbRatingConfig) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    config.readonly = true;
  }
  selectedAgent:any;
  ngOnInit() {
    if(this.Agent!=null||this.Agent!=undefined){
    this.selectedAgent=this.Agent;
  }
  }

}
