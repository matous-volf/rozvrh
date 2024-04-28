import Day from "./Day.ts";
import HourTime from "./HourTime.ts";
import Group from "./Group.ts";

class Timetable {
    days: Day[];
    groupGroups: Group[][];
    hourTimes: HourTime[];
    urlCurrent: string;

    constructor(days: Day[], groups: Group[][], hourTimes: HourTime[], urlCurrent: string) {
        this.days = days;
        this.groupGroups = groups;
        this.hourTimes = hourTimes;
        this.urlCurrent = urlCurrent;
    }
}

export default Timetable;