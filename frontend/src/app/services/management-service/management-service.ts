import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IExam} from 'e2xgrader-review-backend';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  private http: HttpClient = inject(HttpClient);

  listExams(): Observable<HttpResponse<IExam[]>>{
    return this.http.get<IExam[]>(environment.apiUrl + '/api/v1/manage/exams', {observe: 'response'});
  }

  getExamById(id: string): Observable<HttpResponse<IExam>> {
    return this.http.get<IExam>(environment.apiUrl + '/api/v1/manage/exams/' + id, {observe: 'response'});
  }
}
