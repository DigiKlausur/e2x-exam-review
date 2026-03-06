import {Semester} from "./Semester";
import {User} from "./User";

export interface Exam {
    title: string;
    semester: Semester;
    primaryExaminer: User;
    secondaryExaminer: User;
    date: Date;
    reviewParameters: {
        startDate: Date | null;
        endDate: Date | null;
    }
}
