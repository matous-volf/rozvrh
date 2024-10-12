import Lesson from "./Lesson.ts";

export default class Hour {
    lessons: Lesson[];
    selectedLesson: Lesson | null;
    isSelected: boolean;

    constructor(lessons: Lesson[], selectedLesson: Lesson | null) {
        this.lessons = lessons;
        this.selectedLesson = selectedLesson;
        this.isSelected = selectedLesson !== null;
    }
}
