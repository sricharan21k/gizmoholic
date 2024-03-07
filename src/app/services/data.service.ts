import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private components = new BehaviorSubject<string[]>([]);
  components$ = this.components.asObservable();
  constructor() {}

  notifyParent(component: string) {
    const current = this.components.getValue();
    current.push(component);
    this.components.next(current);
  }
}
