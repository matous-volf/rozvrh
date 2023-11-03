import Day from "./Day.ts";
import HourTime from "./HourTime.ts";

class Timetable {
    days: Day[];
    groups: string[];
    hourTimes: HourTime[];

    constructor(days: Day[], groups: string[], hourTimes: HourTime[]) {
        this.days = days;
        this.groups = groups;
        this.hourTimes = hourTimes;
    }
}

export default Timetable;