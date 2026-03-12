import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {IAnswerSheet} from 'e2xgrader-review-backend';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http: HttpClient = inject(HttpClient);

  listAnswerSheets(): Observable<HttpResponse<IAnswerSheet[]>>{
    return this.http.get<IAnswerSheet[]>(environment.apiUrl + '/api/v1/review/answer-sheets', {observe: 'response'});
  }

  getAnswerSheet(id: string): Observable<HttpResponse<IAnswerSheet>>{
    return this.http.get<IAnswerSheet>(environment.apiUrl + '/api/v1/review/answer-sheets/' + id, {observe: 'response'});
  }
}
