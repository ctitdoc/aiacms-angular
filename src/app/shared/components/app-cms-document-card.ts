import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsDocument } from '../../core/models';

@Component({
  selector: 'app-cms-document-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="row" style="justify-content: space-between; align-items: baseline;">
        <div>
          <div style="font-weight: 700">{{ doc.id }}</div>
          <div class="muted">{{ doc.lastModifiedIso }}</div>
          <!-- span class="badge">{{ doc.kind }}</span -->
        </div>

        <div class="row" style="gap: 10px; align-items: center;">
          <select (change)="onActionSelect($event)" style="width: 220px; max-width: 220px;">
            <option value="">Actions…</option>
            <option *ngFor="let a of orderedActions(doc.actions)" [value]="a.href">{{ a.label }}</option>
          </select>

          <a *ngIf="showDelete" href="" (click)="onDelete($event)" style="color: var(--danger);">DELETE</a>
        </div>
      </div>
    </div>
  `
})
export class CmsDocumentCardComponent {
  @Input({ required: true }) doc!: CmsDocument;
  @Input() showDelete = false;
  @Output() delete = new EventEmitter<string>();

  onActionSelect(ev: Event): void {
    const sel = ev.target as HTMLSelectElement;
    const href = sel.value;
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
    sel.value = '';
  }

  onDelete(ev: Event): void {
    ev.preventDefault();
    this.delete.emit(this.doc.id);
  }

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
}
