import Day from "./Day.ts";
import HourTime from "./HourTime.ts";
import Group from "./Group.ts";

class Timetable {
    days: Day[];
    groupGroups: Group[][];
    hourTimes: HourTime[];

    constructor(days: Day[], groups: Group[][], hourTimes: HourTime[]) {
        this.days = days;
        this.groupGroups = groups;
        this.hourTimes = hourTimes;
    }
}

export default Timetable;