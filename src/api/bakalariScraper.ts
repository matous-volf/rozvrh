import * as cheerio from "cheerio";
import Day from "../models/Day.ts";
import Hour from "../models/Hour.ts";
import Lesson from "../models/Lesson.ts";
import Timetable from "../models/Timetable.ts";
import ClassId from "../models/ClassId.ts";

const timetableBlankBaseUrl = "https://delta-skola.bakalari.cz/Timetable/Public";
const timetableClassBaseUrl = "https://delta-skola.bakalari.cz/Timetable/Public/Actual/Class/";

async function fetchHtml(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error();
    }
    return await response.text();
}

export async function getClassIds(): Promise<ClassId[]> {
    const html = await fetchHtml(timetableBlankBaseUrl);
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
    const url = timetableClassBaseUrl + classId;
    const html = await fetchHtml(url);
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

    return new Timetable(days);
}

