import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModuleImplementationModel } from '../models/module-implementation-model';

@Component({
  selector: 'yc-yang-implementations-modal',
  templateUrl: './yang-implementations-modal.component.html',
  styleUrls: ['./yang-implementations-modal.component.scss']
})
export class YangImplementationsModalComponent implements OnInit {

  @ViewChild('plainTextTemplate') public plainTextTemplate: TemplateRef<any>;
  @ViewChild('deviationTemplate') public deviationTemplate: TemplateRef<any>;
  @ViewChild('linkTemplate') public linkTemplate: TemplateRef<any>;

  myBaseUrl = environment.WEBROOT_BASE_URL;

  name: string;
  revision: string;
  implementations: ModuleImplementationModel[];
  metadata: string[];

  constructor(
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getPropTemplate(property: string): TemplateRef<any> {
    const templatesMapping = {
      deviation: 'deviationTemplate',
      platform: 'linkTemplate'
    };

    if (templatesMapping.hasOwnProperty(property)) {
      return this[templatesMapping[property]];
    } else {
      return this.plainTextTemplate;
    }
  }

  getImplementationsHref(property: string, implementation: ModuleImplementationModel) {
    const vendorPath = 'vendor=' + implementation['vendor']
    const platformPath = 'platform=' + implementation['platform']
    const path = [vendorPath, platformPath].join('&')

    return this.myBaseUrl + '/yang-search/implementations?' + path
  }
}
