import Group from "./Group.ts";

class Lesson {
    subject: string;
    group: Group | null;
    room: string;
    teacher: string;
    isNotEveryWeek: boolean;
    weekId: string | null;

    constructor(subject: string, group: Group | null, room: string, teacher: string, isNotEveryWeek: boolean, weekId: string | null) {
        this.subject = subject;
        this.group = group;
        this.room = room;
        this.teacher = teacher;
        this.isNotEveryWeek = isNotEveryWeek;
        this.weekId = weekId;
    }
}

export default Lesson;