import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PreloaderService {

	private loadingTasks = 0;

	isLoading = signal(false);

	show() {
		this.loadingTasks++;
		this.isLoading.set(true);
	}

	hide() {
		if (this.loadingTasks > 0) {
			this.loadingTasks--;
		}

		if (this.loadingTasks === 0) {
			this.isLoading.set(false);
		}
	}

	reset() {
		this.loadingTasks = 0;
		this.isLoading.set(false);
	}

}
