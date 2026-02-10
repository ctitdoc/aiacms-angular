import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  CmsDocument, QueryResult, ProcessResult, GenerateCvRequest, RestructureRequest
} from '../models';

function nowIso(): string { return new Date().toISOString(); }

function makeId(prefix: string): string {
  const stamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .slice(0, 15);
  return `${prefix}_${stamp}`;
}

@Injectable({ providedIn: 'root' })
export class CmsApiService {
  constructor(private http: HttpClient) {}
  private documents: CmsDocument[] = [
    { id: 'content/dictionary_cv_courvant_v6.xml', lastModifiedIso: '2026-02-09T16:18:19+01:00', kind: 'resume',
      "features": ["VIEW","EDIT","XML"],
      "links":  {
        "VIEW": "/cms/get_dict_file_content_request?file=mock",
        "EDIT": "/static/editor/xopus/xopus.html#/cms/edit_dict_file_request?file=mock",
        "XML":  "/cms/get_dict_file_xml_content_request?file=mock"
      }

    },
    { id: 'content/dictionary_cv_courvant_v5.xml', lastModifiedIso: '2026-02-08T16:18:19+01:00', kind: 'resume',
      "features": ["VIEW","EDIT","XML"],
      "links":  {
        "VIEW": "/cms/get_dict_file_content_request?file=mock",
        "EDIT": "/static/editor/xopus/xopus.html#/cms/edit_dict_file_request?file=mock",
        "XML":  "/cms/get_dict_file_xml_content_request?file=mock"
      }

    },
  ];

  listDocuments(): Observable<CmsDocument[]> {
    // via proxy -> http://www.sitems.org:16386/cms/list_dictionary_request_json
    return this.http.get<CmsDocument[]>('/cms/list_dictionary_request_json');
  }

  createDocument(fileName: string): Observable<CmsDocument> {
    if (!fileName.trim()) return throwError(() => new Error('Nom de document requis.'));
    const doc: CmsDocument = {
      id: `content/${fileName.trim()}`,
      lastModifiedIso: nowIso(),
      kind: 'generic',
      "features": ["VIEW","EDIT","XML"],
      "links":  {
        "VIEW": "/cms/get_dict_file_content_request?file=mock",
        "EDIT": "/static/editor/xopus/xopus.html#/cms/edit_dict_file_request?file=mock",
        "XML":  "/cms/get_dict_file_xml_content_request?file=mock"
      }
    };
    this.documents = [doc, ...this.documents];
    return of(doc).pipe(delay(250));
  }

  deleteDocument(id: string): Observable<void> {
    this.documents = this.documents.filter(d => d.id !== id);
    return of(void 0).pipe(delay(200));
  }

  runXQuery(query: string, format: 'HTML' | 'XML'): Observable<QueryResult> {
    const content = format === 'HTML'
      ? `<document><h>Query results :</h><p>MOCK (no BaseX)</p><pre>${escapeHtml(query)}</pre></document>`
      : `<document><h>Query results :</h><p>MOCK</p><query>${xmlEscape(query)}</query></document>`;
    return of({ format, content }).pipe(delay(350));
  }

  getLogsXml(): Observable<string> {
    return of(`<document><h>Logs</h><p>MOCK logs from BaseX</p><p>${xmlEscape(nowIso())}</p></document>`)
      .pipe(delay(250));
  }

  restructureTextCv(req: RestructureRequest): Observable<ProcessResult> {
    const id = makeId('dictionary_retroconversion_demo');
    return of({
      id,
      title: `Text has been restructured as XML document content/${id}.xml`,
      links: [
        { label: 'EDIT', href: `/mock/edit/${id}` },
        { label: 'DELETE', href: `/mock/delete/${id}` },
        { label: 'RESUME', href: `/mock/resume/${id}` },
        { label: 'RESUME PDF', href: `/mock/resume_pdf/${id}` },
        { label: 'XML', href: `/mock/xml/${id}` }
      ],
      xml: `<document><h>Resume</h><p>MOCK generated from raw text</p></document>`,
      html: `<h1>Resume</h1><p>MOCK</p>`
    }).pipe(delay(800));
  }

  generateCvForOffer(req: GenerateCvRequest): Observable<ProcessResult> {
    const id = makeId('dictionary_cv_for_job_offer_demo');
    return of({
      id,
      title: `CV generated as XML document content/${id}.xml`,
      links: [
        { label: 'EDIT', href: `/mock/edit/${id}` },
        { label: 'DELETE', href: `/mock/delete/${id}` },
        { label: 'RESUME', href: `/mock/resume/${id}` },
        { label: 'RESUME PDF', href: `/mock/resume_pdf/${id}` },
        { label: 'XML', href: `/mock/xml/${id}` }
      ],
      xml: `<document><h>Resume</h><p>MOCK CV cible généré</p></document>`,
      html: `<h1>Resume</h1><p>MOCK</p>`
    }).pipe(delay(950));
  }

  getResultById(id: string): Observable<ProcessResult> {
    return of({
      id,
      title: `Result for ${id}`,
      links: [
        { label: 'EDIT', href: `/mock/edit/${id}` },
        { label: 'DELETE', href: `/mock/delete/${id}` },
        { label: 'RESUME', href: `/mock/resume/${id}` },
        { label: 'RESUME PDF', href: `/mock/resume_pdf/${id}` },
        { label: 'XML', href: `/mock/xml/${id}` }
      ],
      xml: `<document><h>Result</h><p>MOCK payload for ${xmlEscape(id)}</p></document>`,
      html: `<h1>Result</h1><p>MOCK</p>`
    }).pipe(delay(250));
  }
}

function xmlEscape(s: string): string {
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'","&apos;");
}
function escapeHtml(s: string): string {
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'","&#039;");
}
