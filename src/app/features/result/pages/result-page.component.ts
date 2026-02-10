import { Component  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CmsApiService } from '../../../core/services/cms-api.service';
import {CmsDocument, ProcessResult} from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { CmsDocumentCardComponent} from "../../../shared/components/app-cms-document-card";

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CmsDocumentCardComponent],
  template: `
    <app-page-header title="Result" subtitle="Écran résultat"></app-page-header>

    <div class="card" *ngIf="doc">
      <app-cms-document-card *ngIf="doc" [doc]="doc"></app-cms-document-card>

      <div class="row" style="margin-top: 12px;">
        <button class="danger" (click)="delete()">DELETE (mock)</button>
        <button class="ghost" (click)="back()">Back</button>
        <span class="muted" *ngIf="status">{{ status }}</span>
      </div>
    </div>

    <p class="muted" *ngIf="!doc">Loading...</p>
  `
})
export class ResultPageComponent  {
  doc?: CmsDocument;
  status = '';
  constructor(private route: ActivatedRoute, private api: CmsApiService, private router: Router) {
    const nav = router.getCurrentNavigation();
    this.doc = nav?.extras.state?.['document'];
    if (!this.doc) this.router.navigate(['/documents']);
  }
  delete(): void {
    if (!this.doc) return;
    if (!confirm(`Delete ${this.doc.id} ?`)) return;
    this.status = 'Deleted (mock).';
    setTimeout(() => this.router.navigate(['/documents']), 400);
  }
  back(): void { history.back(); }
}
