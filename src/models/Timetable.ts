import Day from "./Day.ts";

class Timetable {
    days: Day[];
    groups: string[];

    constructor(days: Day[]) {
        this.days = days;

        const groups: string[] = [];
        for (const day of days) {
            for (const hour of day.hours) {
                for (const lesson of hour.lessons) {
                    if (lesson.group === null || lesson.group.trim() === "" || groups.includes(lesson.group)) {
                        continue;
                    }

                    groups.push(lesson.group);
                }
            }
        }
        this.groups = groups;
    }
}

export default Timetable;