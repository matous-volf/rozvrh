import * as cheerio from "cheerio";
import Day from "../models/Day.ts";
import Hour from "../models/Hour.ts";
import Lesson from "../models/Lesson.ts";
import Timetable from "../models/Timetable.ts";
import ClassId from "../models/ClassId.ts";
import HourTime from "../models/HourTime.ts";
import {DateTime} from "luxon";

const timetableBlankPermanentUrl = "https://delta-skola.bakalari.cz/Timetable/Public";

const timetableClassPermanentBaseUrl = "https://delta-skola.bakalari.cz/Timetable/Public/Permanent/Class/";
const timetableClassCurrentBaseUrl = "https://delta-skola.bakalari.cz/Timetable/Public/Actual/Class/";

async function fetchHtml(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error();
    }
    return await response.text();
}

export async function getClassIds(): Promise<ClassId[]> {
    const html = await fetchHtml(timetableBlankPermanentUrl);
    const $ = cheerio.load(html);

    const classIds: ClassId[] = [];
    const classSelect = $("#selectedClass")[0];
    for (const option of classSelect.children) {
        const id = $(option).attr("value");
        const name = $(option).text();

        if (id === undefined || name.trim() === "") {
            continue;
        }

        classIds.push(new ClassId(id, name));
    }

    return classIds;
}

export async function getTimetable(classId: string, selectedGroups: string[]): Promise<Timetable> {
    const permanentUrl = timetableClassPermanentBaseUrl + classId;
    const currentUrl = timetableClassCurrentBaseUrl + classId;

    const permanentHtml = await fetchHtml(permanentUrl);
    const currentHtml = await fetchHtml(currentUrl);

    const daysPermanent = createDays(permanentHtml, selectedGroups);
    const daysCurrent = createDays(currentHtml, selectedGroups);

    const groups: string[][] = [];
    for (const day of daysPermanent) {
        hoursLoop:
        for (const hour of day.hours.sort((a,b) => b.lessons.length - a.lessons.length)) {
            const groupsGroup: string[] = [];
            for (const lesson of hour.lessons) {
                if (lesson.group === null || lesson.group.trim() === "") {
                    continue hoursLoop;
                }

                if (groups.some(row => row.includes(lesson.group))) {
                    continue;
                }

                groupsGroup.push(lesson.group);
            }
            
            if (groupsGroup.length > 0) {
                groupsGroup.push(`blank-${groupsGroup}`);
                groups.push(groupsGroup);
            }
        }
    }

    const hourTimes = createHourTimes(currentHtml);

    return new Timetable(daysCurrent, groups, hourTimes);
}

function createDays(html: string, selectedGroups: string[]): Day[] {
    const $ = cheerio.load(html);

    const days: Day[] = [];
    const cellWrappers = $(".bk-timetable-row > .bk-cell-wrapper");
    for (const cellWrapper of cellWrappers) {
        const hours: Hour[] = [];

        const cells = $(cellWrapper).find(".bk-timetable-cell");
        for (const cell of cells) {
            const lessons: Lesson[] = [];

            const dayItems = $(cell).find(".day-item > .day-item-hover > .day-flex");
            for (const dayItem of dayItems) {
                const subject = $(dayItem).find(".middle").text();
                const group = $(dayItem).find(".top > .left > div").text();
                const room = $(dayItem).find(".top > .right > div").text();
                const teacher = $(dayItem).find(".bottom > span").text();

                if (subject.trim() === "") {
                    continue;
                }

                lessons.push(new Lesson(subject, group, room, teacher));
            }

            const selectedLesson = lessons.find((lesson) =>
                lesson.group === null || selectedGroups.includes(lesson.group));

            hours.push(new Hour(lessons, selectedLesson !== undefined ? selectedLesson : null));
        }

        days.push(new Day(hours));
    }

    return days;
}

function createHourTimes(html: string): HourTime[] {
    const $ = cheerio.load(html);

    const hourTimes = [];

    const hours = $(".bk-timetable-hours > .bk-hour-wrapper > .hour");
    for (const hour of hours) {
        const from = $(hour).children().first().text();
        const to = $(hour).children().last().text();

        hourTimes.push(new HourTime(DateTime.fromFormat(from, "H:mm"), DateTime.fromFormat(to, "H:mm")));
    }

    return hourTimes;
}
