import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row" style="margin-bottom: 12px;">
      <div>
        <h1>{{ title }}</h1>
        <p class="muted" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="spacer"></div>
      <ng-content />
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
}
