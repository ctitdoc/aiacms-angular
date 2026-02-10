import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsApiService } from '../../../core/services/cms-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Get logs" subtitle="Affiche un XML de logs (mock)."></app-page-header>
    <div class="card">
      <p class="muted" *ngIf="!xml">Loading...</p>
      <pre *ngIf="xml" style="white-space: pre-wrap;">{{ xml }}</pre>
    </div>
  `
})
export class LogsPageComponent implements OnInit {
  xml = '';
  constructor(private api: CmsApiService) {}
  ngOnInit(): void { this.api.getLogsXml().subscribe(x => this.xml = x); }
}
