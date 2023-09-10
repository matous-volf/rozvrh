import Lesson from "../models/Lesson.ts";

interface Props {
    lesson: Lesson | null;
    isBreak: boolean;
}

function LessonInfo(props: Props) {
    if (props.lesson === null) {
        return (
            <span className="fw-bold">volno</span>
        );
    }

    if (props.isBreak) {
        return (
            <span className="fw-bold">přestávka</span>
        );
    }

    return (
        <>
            <span className="fw-bold">{props.lesson.subject}</span> {props.lesson.room}
        </>
    );
}

export default LessonInfo
