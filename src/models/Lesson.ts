import Group from "./Group.ts";

class Lesson {
    subject: string;
    group: Group | null;
    room: string;
    teacher: string;

    constructor(subject: string, group: Group | null, room: string, teacher: string) {
        this.subject = subject;
        this.group = group;
        this.room = room;
        this.teacher = teacher;
    }
}

export default Lesson;