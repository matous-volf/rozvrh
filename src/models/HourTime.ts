import {DateTime} from "luxon";


export default class HourTime {
    start: DateTime;
    end: DateTime;

    constructor(start: DateTime, end: DateTime) {
        this.start = start;
        this.end = end;
    }
}
