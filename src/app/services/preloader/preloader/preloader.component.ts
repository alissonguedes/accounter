import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  AfterContentInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../preloader.service';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.component.html',
})
export class PreloaderComponent implements AfterContentInit, OnDestroy {
  @Input() id: string = 'default';
  isVisible = signal(false);

  constructor(private service: PreloaderService) {}

  ngAfterContentInit() {
    this.service.register(this.id, this.isVisible);
  }

  ngOnDestroy(): void {
    this.service.unregister(this.id);
  }

  visible() {
    return this.isVisible();
  }
}
