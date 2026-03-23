import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {IAnswerSheet, IExam, IStudent} from 'e2xgrader-exam-review-backend';
import {environment} from '../../../environments/environment';
import {prepareExam} from '../../utils/ExamUtil';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http: HttpClient = inject(HttpClient);

  listAnswerSheets(): Observable<IAnswerSheet[]>{
    return this.http.get<IAnswerSheet[]>(environment.apiUrl + '/api/v1/review/answer-sheets')
      .pipe(map((response: IAnswerSheet[]) => response.map(this.prepareAnswerSheet)));
  }

  getAnswerSheet(id: string): Observable<IAnswerSheet>{
    return this.http.get<IAnswerSheet>(environment.apiUrl + '/api/v1/review/answer-sheets/' + id)
      .pipe(map((response: IAnswerSheet) => this.prepareAnswerSheet(response)));
  }

  private prepareAnswerSheet(answerSheetProto: IAnswerSheet): IAnswerSheet{
    answerSheetProto.exam = prepareExam(answerSheetProto.exam);
    return answerSheetProto;
  }

  updateStudentData(): Observable<IStudent> {
    return this.http.post<IStudent>(environment.apiUrl + '/api/v1/review/students', {});
  }
}
