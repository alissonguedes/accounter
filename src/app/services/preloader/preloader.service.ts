import { Injectable, Signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PreloaderService {
  private preloaders = new Map<string, WritableSignal<boolean>>();
  private tasks = new Map<string, number>();

  register(id: string, visibilitySignal: WritableSignal<boolean>) {
    this.preloaders.set(id, visibilitySignal);
    this.tasks.set(id, 0);
  }

  unregister(id: string) {
    this.preloaders.delete(id);
    this.tasks.delete(id);
  }

  show(id: string) {
    const signal = this.preloaders.get(id);
    if (signal && this.tasks.has(id)) {
      const count = this.tasks.get(id)! + 1;
      this.tasks.set(id, count);
      signal.set(true);
	  let skeleton = document.querySelectorAll('.skeleton');
      skeleton.forEach((s: any) => s.classList.add('skeleton-loading'));
    }
  }

  hide(id: string) {
    const signal = this.preloaders.get(id);
    if (signal && this.tasks.has(id)) {
      const count = Math.max(this.tasks.get(id)! - 1, 0);
      this.tasks.set(id, count);
      if (count === 0) signal.set(false);
      let skeleton = document.querySelectorAll('.skeleton');
      skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
    }
  }

  reset(id: string) {
    this.tasks.set(id, 0);
    const signal = this.preloaders.get(id);
    if (signal) signal.set(false);
  }
}
