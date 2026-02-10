import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { CmsDocument } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Documents" subtitle="Listing des documents + actions (mock)."></app-page-header>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Document</th>
            <th>Last modified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of docs">
            <td>
              <div style="font-weight:600">{{ d.id }}</div>
              <span class="badge">{{ d.kind }}</span>
            </td>
            <td>{{ d.lastModifiedIso }}</td>
            <td class="actions">
              <a [href]="d.links['VIEW']" target="_blank" rel="noreferrer">VIEW</a>
              <a [href]="d.links['EDIT']" target="_blank" rel="noreferrer">EDIT</a>
              <a href="" (click)="onDelete($event, d.id)" style="color: var(--danger);">DELETE</a>
              <a [href]="d.links['XML']" target="_blank" rel="noreferrer">XML</a>
              <a [href]="'/mock/html/'+encode(d.id)" target="_blank" rel="noreferrer">HTML</a>
              <a [href]="'/mock/pdf/'+encode(d.id)" target="_blank" rel="noreferrer">PDF</a>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="muted" style="margin-top: 12px;">
        À brancher : routes backend (VIEW/EDIT/DELETE/XML/HTML/PDF).
      </p>
    </div>
  `
})
export class DocumentsListPageComponent implements OnInit {
  docs: CmsDocument[] = [];
  constructor(private api: CmsApiService) {}
  ngOnInit(): void { this.api.listDocuments().subscribe(d => this.docs = d); }
  encode(s: string): string { return encodeURIComponent(s); }
  onDelete(ev: Event, id: string): void {
    ev.preventDefault();
    if (!confirm(`Delete ${id} ?`)) return;
    this.api.deleteDocument(id).subscribe(() => this.docs = this.docs.filter(x => x.id !== id));
  }
}
