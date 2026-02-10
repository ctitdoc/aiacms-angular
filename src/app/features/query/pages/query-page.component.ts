import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Document query (XQuery)" subtitle="Exécution XQuery (mock)."></app-page-header>

    <div class="grid cols-2">
      <div class="card">
        <div class="row" style="margin-bottom: 10px;">
          <label class="muted">Result format :</label>
          <select [(ngModel)]="format" style="max-width: 180px;">
            <option>HTML</option>
            <option>XML</option>
          </select>
          <div class="spacer"></div>
          <button (click)="run()">Submit</button>
        </div>

        <textarea [(ngModel)]="query"></textarea>
      </div>

      <div class="card">
        <h2>Result</h2>
        <p class="muted" *ngIf="!result">No result yet.</p>
        <pre *ngIf="result" style="white-space: pre-wrap;">{{ result }}</pre>
      </div>
    </div>
  `
})
export class QueryPageComponent {
  format: 'HTML' | 'XML' = 'HTML';
  query = `for $x in collection('dictionary')/dictionary/data_definition[ . contains text 'email']\nreturn $x`;
  result = '';
  constructor(private api: CmsApiService) {}
  run(): void { this.result = ''; this.api.runXQuery(this.query, this.format).subscribe(r => this.result = r.content); }
}
