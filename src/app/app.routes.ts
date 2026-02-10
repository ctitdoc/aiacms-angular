import { Routes } from '@angular/router';

import { DocumentsListPageComponent } from './features/documents/pages/documents-list-page.component';
import { RecordDocumentPageComponent } from './features/documents/pages/record-document-page.component';
import { QueryPageComponent } from './features/query/pages/query-page.component';
import { LogsPageComponent } from './features/logs/pages/logs-page.component';
import { RestructurePageComponent } from './features/restructure/pages/restructure-page.component';
import { GenerateCvPageComponent } from './features/generate/pages/generate-cv-page.component';
import { ResultPageComponent } from './features/result/pages/result-page.component';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'documents' },
  { path: 'documents', component: DocumentsListPageComponent },
  { path: 'record-document', component: RecordDocumentPageComponent },
  { path: 'query', component: QueryPageComponent },
  { path: 'logs', component: LogsPageComponent },
  { path: 'restructure', component: RestructurePageComponent },
  { path: 'generate-cv', component: GenerateCvPageComponent },
  { path: 'result/:id', component: ResultPageComponent },
  { path: '**', redirectTo: 'documents' }
];
