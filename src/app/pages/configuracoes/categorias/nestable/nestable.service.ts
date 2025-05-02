import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemNode } from './item-node.model';

@Injectable({ providedIn: 'root' })
export class NestableService {
  private _data = new BehaviorSubject<ItemNode[]>([]);
  readonly data$ = this._data.asObservable();

  setData(data: ItemNode[]) {
    this._data.next(data);
  }

  getData(): ItemNode[] {
    return this._data.getValue();
  }

  updateData(data: ItemNode[]) {
    this._data.next([...data]);
  }
}
