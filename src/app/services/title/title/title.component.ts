import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from '../../../app.component';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-title',
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
})
export class TitleComponent {
  constructor(protected app: AppComponent, protected title: TitleService) {}
}
