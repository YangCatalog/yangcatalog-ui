import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DataService } from '../../core/data.service';
import { TreeItemModel } from './models/tree-item-model';
import { TreeItemTableRowModel } from './models/tree-item-table-row-model';
import { TreeModel } from './models/tree-model';

@Injectable({
  providedIn: 'root'
})
export class YangTreeService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getTree(moduleName: string): Observable<TreeModel> {
    return this.httpClient.get(environment.REST_BASE_URL + 'api/yang-search/v2/tree/' + moduleName)
      .pipe(
        map(
          response => {
            return new TreeModel(response);
          }
        )
      );
  }

  transformTreeToTablerows(tree: TreeModel): TreeItemTableRowModel[] {
    let result: TreeItemTableRowModel[] = [];
    tree.data.forEach((treeItem: TreeItemModel) => {
      result = result.concat(this.transformTreeitemToRows(treeItem));
    });
    return result;
  }

  private transformTreeitemToRows(treeItem: TreeItemModel, level = 0, parent = null): TreeItemTableRowModel[] {
    const rowData = {
      text: treeItem['text'],
      title: treeItem['title'],
      data: treeItem,
    };
    const myTreeRow = new TreeItemTableRowModel(rowData, level, parent);
    let result: TreeItemTableRowModel[] = [myTreeRow];
    treeItem.children.forEach((treeChild: TreeItemModel) => {
      result = result.concat(this.transformTreeitemToRows(treeChild, level + 1, myTreeRow));
    });
    return result;

  }
}
