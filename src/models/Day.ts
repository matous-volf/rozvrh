import Hour from "./Hour.ts";

export default class Day {
    hours: Hour[];

    constructor(hours: Hour[]) {
        this.hours = hours;
    }
}
