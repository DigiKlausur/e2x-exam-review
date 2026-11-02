import {inject, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IAnswerSheet, IStudent} from 'e2x-exam-review-backend';
import {environment} from '../../../environments/environment';
import {prepareExam} from '../../utils/ExamUtil';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http: HttpClient = inject(HttpClient);
  private _studentDataUpdatedSignal: WritableSignal<boolean> = signal<boolean>(false);

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
    return this.http.post<IStudent>(environment.apiUrl + '/api/v1/review/students', {}).pipe(map((response) => {
      if(response.studentId) this._studentDataUpdatedSignal.set(true);
      return response;
    }));
  }

  get studentDataUpdatedSignal(): Signal<boolean> {
    return this._studentDataUpdatedSignal.asReadonly();
  }
}
