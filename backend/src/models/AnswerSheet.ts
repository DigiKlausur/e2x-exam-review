import {Exam} from "./Exam";
import {Student} from "./Student";

export interface AnswerSheet {
    exam: Exam;
    submitter: Student;
    filePath: string;
}
