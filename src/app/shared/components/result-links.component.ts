import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row" style="gap: 12px; flex-wrap: wrap;">
      <a *ngFor="let l of links" [href]="l.href" target="_blank" rel="noreferrer">{{ l.label }}</a>
    </div>
  `
})
export class ResultLinksComponent {
  @Input() links: Array<{ label: string; href: string }> = [];
}
