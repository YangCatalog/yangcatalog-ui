import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { YangSearchService } from '../../yang-search/yang-search.service';
import { YangShowNodeComponent } from '../yang-show-node.component';

@Component({
  selector: 'yc-yang-show-node-modal',
  templateUrl: './yang-show-node-modal.component.html',
  styleUrls: ['../yang-show-node.component.scss']
})
export class YangShowNodeModalComponent extends YangShowNodeComponent {

  uriPath: string;
  constructor(
    protected route: ActivatedRoute,
    protected dataService: YangSearchService,
    protected location: Location,
    protected modal: NgbActiveModal) {
    super(route, dataService, location);
  }

  isModal(): boolean {
    return true;
  }

  onCancelClick() {
    this.modal.close();
  }
}
