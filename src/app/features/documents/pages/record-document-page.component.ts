import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Record document" subtitle="Créer un document (mock)."></app-page-header>

    <div class="grid cols-2">
      <div class="card">
        <h2>Author pseudo</h2>
        <p class="muted">Écran legacy : un champ texte + bouton.</p>

        <div class="grid">
          <input type="text" [(ngModel)]="fileName" placeholder="Ex: dictionary_new_doc.xml" />
          <div class="row">
            <button (click)="create()">Envoyer</button>
            <span class="muted" *ngIf="message">{{ message }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Notes</h2>
        <p class="muted">À brancher côté backend :</p>
        <ul>
          <li><p>POST /cms/record_document (payload: filename + author)</p></li>
          <li><p>Retour: identifiant du fichier + refresh list</p></li>
        </ul>
      </div>
    </div>
  `
})
export class RecordDocumentPageComponent {
  fileName = '';
  message = '';
  constructor(private api: CmsApiService) {}
  create(): void {
    this.message = '';
    this.api.createDocument(this.fileName).subscribe({
      next: d => { this.message = `Created: ${d.id}`; this.fileName = ''; },
      error: e => { this.message = `Error: ${String(e?.message ?? e)}`; }
    });
  }
}
