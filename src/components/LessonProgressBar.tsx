import {DateTime, Duration} from "luxon";
import {ProgressBar} from "react-bootstrap";

interface Props {
    currentTime: DateTime;
    previousAwaitedTime: DateTime;
    timeRemaining: Duration | null;
}

function LessonProgressBar({currentTime, previousAwaitedTime, timeRemaining}: Props) {
    return timeRemaining === null
        ? <ProgressBar max={1} now={1}/>
        : <ProgressBar max={currentTime.plus(timeRemaining).diff(previousAwaitedTime).toMillis()}
                       now={currentTime.diff(previousAwaitedTime).toMillis()}/>
}

export default LessonProgressBar;