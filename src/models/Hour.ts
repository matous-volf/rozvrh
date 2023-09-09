import Lesson from "./Lesson.ts";

class Hour {
    lessons: Lesson[];
    selectedLesson: Lesson | null;
    isSelected: boolean;

    constructor(lessons: Lesson[], selectedLesson: Lesson | null) {
        this.lessons = lessons;
        this.selectedLesson = selectedLesson;
        this.isSelected = selectedLesson !== null;
    }
}

export default Hour;