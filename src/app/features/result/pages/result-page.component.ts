import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { ProcessResult } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { ResultLinksComponent } from '../../../shared/components/result-links.component';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ResultLinksComponent],
  template: `
    <app-page-header title="Result" subtitle="Écran résultat (PJ5 / PJ6)."></app-page-header>

    <div class="card" *ngIf="result">
      <h2 style="margin-top:0">{{ result.title }}</h2>
      <app-result-links [links]="result.links"></app-result-links>

      <div class="grid cols-2" style="margin-top: 12px;">
        <div class="card" style="background: rgba(0,0,0,0.15);">
          <h2>XML (mock)</h2>
          <pre style="white-space: pre-wrap;">{{ result.xml }}</pre>
        </div>
        <div class="card" style="background: rgba(0,0,0,0.15);">
          <h2>HTML (mock)</h2>
          <pre style="white-space: pre-wrap;">{{ result.html }}</pre>
        </div>
      </div>

      <div class="row" style="margin-top: 12px;">
        <button class="danger" (click)="delete()">DELETE (mock)</button>
        <button class="ghost" (click)="back()">Back</button>
        <span class="muted" *ngIf="status">{{ status }}</span>
      </div>
    </div>

    <p class="muted" *ngIf="!result">Loading...</p>
  `
})
export class ResultPageComponent implements OnInit {
  result?: ProcessResult;
  status = '';
  constructor(private route: ActivatedRoute, private api: CmsApiService, private router: Router) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.api.getResultById(id).subscribe(r => this.result = r);
  }
  delete(): void {
    if (!this.result) return;
    if (!confirm(`Delete ${this.result.id} ?`)) return;
    this.status = 'Deleted (mock).';
    setTimeout(() => this.router.navigate(['/documents']), 400);
  }
  back(): void { history.back(); }
}
