import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { CmsDocument } from '../../../core/models';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { CmsDocumentCardComponent } from "../../../shared/components/app-cms-document-card";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, CmsDocumentCardComponent],
  template: `
    <app-page-header title="Documents" subtitle="Listing des documents + actions.">
      <div class="row">
        <button class="ghost" (click)="reload()" [disabled]="loading">Reload</button>
        <button class="ghost" (click)="toggleSort()">
          Sort: {{ sortDir === 'desc' ? 'Last modified ↓' : 'Last modified ↑' }}
        </button>
      </div>
    </app-page-header>

    <div class="card" style="margin-bottom: 12px;">
      <div class="row filters-row">
        <div style="min-width: 260px; max-width: 420px;">
          <div class="muted" style="font-size: 12px; margin-bottom: 4px;">Features (OR)</div>
          <select multiple [(ngModel)]="selectedFeatures" (ngModelChange)="onFiltersChanged()">
            <option value="All">All</option>
            <option *ngFor="let f of availableFeatures" [value]="f">{{ f }}</option>
          </select>
          <div class="muted" style="font-size: 12px; margin-top: 6px;">
            Tip: Ctrl/Cmd+click pour multi-sélection
          </div>
        </div>

        <div style="min-width: 170px;">
          <div class="muted" style="font-size: 12px; margin-bottom: 4px;">Date filter</div>
          <select [(ngModel)]="dateOp" (ngModelChange)="onFiltersChanged()">
            <option value="any">Any</option>
            <option value="after">Modified &ge;</option>
            <option value="before">Modified &le;</option>
          </select>
        </div>

        <div style="min-width: 190px;">
          <div class="muted" style="font-size: 12px; margin-bottom: 4px;">Date</div>
          <input type="date" [(ngModel)]="dateValue" (ngModelChange)="onFiltersChanged()" [disabled]="dateOp === 'any'" />
        </div>

        <div class="spacer"></div>

        <div class="muted" style="font-size: 12px;">
          {{ filteredCount }} / {{ docs.length }} docs
        </div>
      </div>
    </div>

    <div style="margin-top: 8px;">
      <div *ngIf="loading">Loading…</div>
      <div *ngIf="err" style="color: var(--danger);">{{ err }}</div>
    </div>

    <div class="card">
      <app-cms-document-card
        *ngFor="let d of pageDocs"
        [doc]="d"
        [showDelete]="true"
        (delete)="onDelete($event)">
      </app-cms-document-card>

      <div *ngIf="!loading && pageDocs.length === 0" class="muted">No documents</div>
    </div>

    <div class="row" style="margin-top: 12px;">
      <button class="ghost" (click)="prevPage()" [disabled]="page <= 1">Prev</button>
      <span class="muted">Page {{ page }} / {{ totalPages }}</span>
      <button class="ghost" (click)="nextPage()" [disabled]="page >= totalPages">Next</button>
    </div>
  `
})
export class DocumentsListPageComponent implements OnInit {
  docs: CmsDocument[] = [];
  loading = false;
  err = '';

  // tri + filtres
  sortDir: 'desc' | 'asc' = 'desc';
  selectedFeatures: string[] = ['All'];
  availableFeatures: string[] = [];
  dateOp: 'any' | 'after' | 'before' = 'any';
  dateValue = ''; // yyyy-mm-dd

  // pagination
  page = 1;
  readonly pageSize = 12;
  totalPages = 1;

  // vue dérivée (après filtres + tri + pagination)
  filteredCount = 0;
  pageDocs: CmsDocument[] = [];

  constructor(private api: CmsApiService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.err = '';
    this.api.listDocuments()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (d) => {
          this.docs = Array.isArray(d) ? d : [];
          this.page = 1;
          this.refreshAvailableFeatures();
          this.recompute();
        },
        error: (e) => {
          this.err = String(e?.message ?? e);
          this.docs = [];
          this.refreshAvailableFeatures();
          this.recompute();
        }
      });
  }

  onDelete(id: string): void {
    if (!confirm(`Delete ${id} ?`)) return;
    this.api.deleteDocument(id).subscribe(() => this.docs = this.docs.filter(x => x.id !== id));
    // Note: deleteDocument est mocké côté service. On met à jour la vue locale également.
    this.docs = this.docs.filter(x => x.id !== id);
    this.page = 1;
    this.refreshAvailableFeatures();
    this.recompute();
  }

  toggleSort(): void {
    this.sortDir = this.sortDir === 'desc' ? 'asc' : 'desc';
    this.page = 1;
    this.recompute();
  }

  onFiltersChanged(): void {
    // logique "All"
    if (!this.selectedFeatures || this.selectedFeatures.length === 0) {
      this.selectedFeatures = ['All'];
    }
    // si l'utilisateur sélectionne un ou plusieurs features, on désactive "All"
    if (this.selectedFeatures.includes('All') && this.selectedFeatures.length > 1) {
      this.selectedFeatures = this.selectedFeatures.filter(x => x !== 'All');
    }

    this.page = 1;
    this.recompute();
  }

  prevPage(): void {
    this.page = Math.max(1, this.page - 1);
    this.recompute();
  }
  nextPage(): void {
    this.page = Math.min(this.totalPages, this.page + 1);
    this.recompute();
  }

  private recompute(): void {
    const sel = (this.selectedFeatures ?? []).includes('All')
      ? []
      : (this.selectedFeatures ?? []).filter(x => x !== 'All');

    const hasDate = this.dateOp !== 'any' && !!this.dateValue;
    const dateStart = hasDate ? new Date(this.dateValue).getTime() : 0;
    const dateEnd = hasDate ? (dateStart + 24 * 60 * 60 * 1000 - 1) : 0;

    const filtered = (this.docs ?? []).filter(d => {
      // features (OR)
      const matchFeatures = sel.length === 0 || (d.features ?? []).some(f => sel.includes(String(f)));
      if (!matchFeatures) return false;

      // date (AND avec le filtre features)
      if (!hasDate) return true;
      const t = Date.parse(d.lastModifiedIso ?? '');
      if (Number.isNaN(t)) return false;
      if (this.dateOp === 'after') return t >= dateStart;
      if (this.dateOp === 'before') return t <= dateEnd;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const ta = Date.parse(a.lastModifiedIso ?? '') || 0;
      const tb = Date.parse(b.lastModifiedIso ?? '') || 0;
      return this.sortDir === 'desc' ? (tb - ta) : (ta - tb);
    });

    this.filteredCount = sorted.length;
    this.totalPages = Math.max(1, Math.ceil(sorted.length / this.pageSize));
    this.page = Math.min(Math.max(1, this.page), this.totalPages);

    const start = (this.page - 1) * this.pageSize;
    this.pageDocs = sorted.slice(start, start + this.pageSize);
  }

  private refreshAvailableFeatures(): void {
    const set = new Set<string>();
    for (const d of (this.docs ?? [])) {
      for (const f of (d.features ?? [])) set.add(String(f));
    }

    const preferred = [
      'RESUME', 'MARKDOWN', 'PDF',
      'ARTURIA', 'SKATELECTRIQUE', 'TEXTILE',
      'VIEW', 'EDIT', 'XML'
    ];
    const rank = new Map(preferred.map((k, i) => [k, i]));

    this.availableFeatures = Array.from(set)
      .filter(f => f && f !== 'All')
      .sort((a, b) => {
        const ra = rank.has(a) ? (rank.get(a) as number) : 999;
        const rb = rank.has(b) ? (rank.get(b) as number) : 999;
        return ra !== rb ? (ra - rb) : a.localeCompare(b);
      });
  }
}
