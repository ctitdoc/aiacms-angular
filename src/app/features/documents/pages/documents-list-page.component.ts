import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { CmsDocument } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { CmsDocumentCardComponent} from "../../../shared/components/app-cms-document-card";

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CmsDocumentCardComponent],
  template: `
    <app-page-header title="Documents" subtitle="Listing des documents + actions."></app-page-header>

    <div class="card">
      <app-cms-document-card
        *ngFor="let d of docs"
        [doc]="d"
        [showDelete]="true"
        (delete)="onDelete($event)">
      </app-cms-document-card>
    </div>
  `
})
export class DocumentsListPageComponent implements OnInit {
  docs: CmsDocument[] = [];
  constructor(private api: CmsApiService) {}

  ngOnInit(): void {
    this.api.listDocuments().subscribe(d => this.docs = d);
  }

  onDelete(id: string): void {
    if (!confirm(`Delete ${id} ?`)) return;
    this.api.deleteDocument(id).subscribe(() => this.docs = this.docs.filter(x => x.id !== id));
  }

  // ordre “démo” lisible (obligatoires d’abord, puis le reste)
  orderedActions(actions: CmsDocument['actions']): Array<{ label: string; href: string }> {
    const order = [
      'VIEW','EDIT','XML',
      'MARKDOWN',
      'RESUME','RESUME/PDF',
      'PDF',
      'ARTURIA PAGE','SKATELECTRIQUE PAGE',
      'TEXTILE'
    ];

    const entries = Object.entries(actions ?? {})
      .filter(([, href]) => !!href)
      .map(([label, href]) => ({ label, href: href as string }));

    const rank = new Map(order.map((k, i) => [k, i]));
    return entries.sort((a, b) => (rank.get(a.label) ?? 999) - (rank.get(b.label) ?? 999));
  }

  onActionSelect(ev: Event, d: CmsDocument): void {
    const sel = ev.target as HTMLSelectElement;
    const href = sel.value;
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
    sel.value = ''; // reset
  }

}
