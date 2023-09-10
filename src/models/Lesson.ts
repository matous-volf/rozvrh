class Lesson {
    subject: string;
    group: string | null;
    room: string;
    teacher: string;

    constructor(subject: string, group: string | null, room: string, teacher: string) {
        this.subject = subject;
        this.group = group === "" ? null : group;
        this.room = room;
        this.teacher = teacher;
    }
}

export default Lesson;