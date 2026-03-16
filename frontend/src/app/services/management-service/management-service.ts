import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {IExam, IUser} from 'e2xgrader-exam-review-backend';
import {environment} from '../../../environments/environment';
import {prepareExam} from '../../utils/ExamUtil';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  private http: HttpClient = inject(HttpClient);

  listExams(): Observable<IExam[]>{
    return this.http.get<IExam[]>(environment.apiUrl + '/api/v1/manage/exams')
      .pipe(map((response: IExam[]) => response.map(prepareExam)));
  }

  getExamById(id: string): Observable<IExam> {
    return this.http.get<IExam>(environment.apiUrl + '/api/v1/manage/exams/' + id)
      .pipe(map((response: IExam) => prepareExam(response)));
  }

  createExam(exam: IExam): Observable<IExam> {
    return this.http.post<IExam>(environment.apiUrl + '/api/v1/manage/exams', exam);
  }

  updateExam(exam: IExam) {
    return this.http.put(environment.apiUrl + '/api/v1/manage/exams', exam);
  }

  searchUsers(query: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(environment.apiUrl + '/api/v1/manage/users/search?query=' + query);
  }
}
