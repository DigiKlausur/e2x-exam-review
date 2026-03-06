import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AnswerSheet} from 'e2xgrader-review-backend';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http: HttpClient = inject(HttpClient);

  listAnswerSheets(): Observable<HttpResponse<AnswerSheet[]>>{
    return this.http.get<AnswerSheet[]>(environment.apiUrl + '/api/v1/review/answer-sheets', {observe: 'response'});
  }
}
