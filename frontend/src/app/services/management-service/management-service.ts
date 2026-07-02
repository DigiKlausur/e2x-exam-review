import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {IAnswerSheet, IExam, IUser} from 'e2x-exam-review-backend';
import {environment} from '../../../environments/environment';
import {prepareExam} from '../../utils/ExamUtil';
import {IAnswerSheetProto} from '../../models/IAnswerSheetProto';
import {IFileProto} from '../../models/IFileProto';

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

  createExam(exam: Omit<IExam, '_id'>): Observable<IExam> {
    return this.http.post<IExam>(environment.apiUrl + '/api/v1/manage/exams', exam);
  }

  updateExam(exam: IExam) {
    return this.http.put(environment.apiUrl + '/api/v1/manage/exams', exam);
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + '/api/v1/manage/exams/' + id);
  }

  listAnswerSheets(examId: string): Observable<IAnswerSheet[]> {
    return this.http.get<IAnswerSheet[]>(`${environment.apiUrl}/api/v1/manage/exams/${examId}/answer-sheets`);
  }

  addAnswerSheet(answerSheetProto: Required<IAnswerSheetProto>, enableFileOverwrite: boolean = false): Observable<IAnswerSheet> {
    const body: FormData = new FormData();
    answerSheetProto.files.forEach((fileProto: IFileProto) => body.append('files', fileProto.file));
    body.append('studentId', answerSheetProto.studentId);
    body.append('fileOverwrite', enableFileOverwrite.toString());
    return this.http.post<IAnswerSheet>(`${environment.apiUrl}/api/v1/manage/exams/${answerSheetProto.examId}/answer-sheets`, body);
  }

  deleteAnswerSheet(answerSheetId: string): Observable<void>{
    return this.http.delete<void>(environment.apiUrl + '/api/v1/manage/answer-sheets/' + answerSheetId);
  }

  deleteAnswerSheetFile(answerSheetId: string, fileId: string): Observable<void>{
    return this.http.delete<void>(`${environment.apiUrl}/api/v1/manage/answer-sheets/${answerSheetId}/${fileId}`);
  }

  searchUsers(query: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(environment.apiUrl + '/api/v1/manage/users/search?query=' + query);
  }

  updateUserData(): Observable<IUser> {
    return this.http.post<IUser>(environment.apiUrl + '/api/v1/manage/users', {});
  }
}
