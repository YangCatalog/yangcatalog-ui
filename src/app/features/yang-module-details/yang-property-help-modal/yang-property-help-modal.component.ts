import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'yc-yang-property-help-modal',
  templateUrl: './yang-property-help-modal.component.html',
  styleUrls: ['./yang-property-help-modal.component.scss']
})
export class YangPropertyHelpModalComponent implements OnInit {
  property: string;
  help: string;

  constructor() { }

  ngOnInit(): void {
  }

}
