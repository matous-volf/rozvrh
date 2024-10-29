import Day from "./Day.ts";
import HourTime from "./HourTime.ts";
import Group from "./Group.ts";

export default class Timetable {
    days: Day[];
    groupGroups: Group[][];
    hourTimes: HourTime[];
    hourTimesMinutesDivisibleByNumber: 1 | 5;
    urlCurrent: string;

    constructor(days: Day[], groups: Group[][], hourTimes: HourTime[], hourTimesMinutesDivisibleByNumber: 1 | 5, urlCurrent: string) {
        this.days = days;
        this.groupGroups = groups;
        this.hourTimes = hourTimes;
        this.hourTimesMinutesDivisibleByNumber = hourTimesMinutesDivisibleByNumber;
        this.urlCurrent = urlCurrent;
    }
}
