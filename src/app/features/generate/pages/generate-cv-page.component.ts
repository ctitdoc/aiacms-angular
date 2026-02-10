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
    <app-page-header title="Generate CV for offer" subtitle="Offre + rules + bouton (mock)."></app-page-header>

    <div class="grid cols-2">
      <div class="card">
        <h2>Offre</h2>
        <textarea [(ngModel)]="offerText"></textarea>
      </div>
      <div class="card">
        <h2>Generation rules</h2>
        <textarea [(ngModel)]="rulesText"></textarea>
      </div>
    </div>

    <div class="card" style="margin-top: 14px;">
      <div class="row">
        <button (click)="generate()">Generate</button>
        <span class="muted" *ngIf="status">{{ status }}</span>
      </div>
    </div>
  `
})
export class GenerateCvPageComponent {
  offerText = `Offre ... (paste here)`;
  rulesText = `SchemedTalks/cvForOfferRulesFile_default.txt`;
  status = '';
  constructor(private api: CmsApiService, private router: Router) {}
  generate(): void {
    this.status = 'Processing...';

    this.api.generateCvForOffer({
      text_document: this.offerText,
      prePromptFile: this.rulesText
    }).subscribe({
      next: (doc) => {
        this.status = '';
        this.router.navigate(['/result'], {
          state: { document: doc }
        });
      },
      error: (e) => {
        this.status = `Error: ${e?.message ?? e}`;
      }
    });
  }
}
