import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Restructure text CV" subtitle="Textarea + bouton (mock)."></app-page-header>

    <div class="card">
      <textarea [(ngModel)]="rawText"></textarea>
      <div class="row" style="margin-top: 12px;">
        <button (click)="restructure()">Restructure</button>
        <span class="muted" *ngIf="status">{{ status }}</span>
      </div>
    </div>
  `
})
export class RestructurePageComponent {
  rawText = `Contact\nFranck Delahaye\nemail: ...\n\nKey skills\n...`;
  status = '';
  constructor(private api: CmsApiService, private router: Router) {}
  restructure(): void {
    this.status = 'Processing...';
    this.api.restructureTextCv({ rawText: this.rawText }).subscribe(r => {
      this.status = '';
      this.router.navigate(['/result', r.id]);
    });
  }
}
