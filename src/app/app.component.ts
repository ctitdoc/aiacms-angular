import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">aiacms-angular</div>
      <nav class="nav">
        <a routerLink="/documents" routerLinkActive="active">Home / List documents</a>
        <a routerLink="/record-document" routerLinkActive="active">Record document</a>
        <a routerLink="/query" routerLinkActive="active">Document query (XQuery)</a>
        <a routerLink="/logs" routerLinkActive="active">Get logs</a>

        <div class="hint">AI</div>
        <a routerLink="/restructure" routerLinkActive="active">Restructure text CV</a>
        <a routerLink="/generate-cv" routerLinkActive="active">Generate CV for offer</a>
      </nav>
      <p class="muted" style="margin:14px 8px 0;font-size:12px;line-height:1.4;">
        UI mock. Remplacer progressivement les mocks par appels HTTP vers BaseX / RESTXQ.
      </p>
    </aside>

    <main class="content">
      <router-outlet />
    </main>
  </div>
  `
})
export class AppComponent {}
