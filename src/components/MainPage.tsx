import {Button} from "react-bootstrap";
import TimetableInfo from "./TimetableInfo.tsx";
import Timetable from "../models/Timetable.ts";

interface Props {
    isLoading: boolean;
    timetable: Timetable | null;
    selectedClassId: string | null;
    selectedGroups: string[];
    setSelectedClassIdCallback: (classId: string | null) => void;
    setSelectedGroupsCallback: (groups: string[]) => void;
}

function MainPage(props: Props) {
    let content = null;
    if (props.isLoading) {
        content = <p>Načítání...</p>;
    }
    else if (props.timetable === null) {
        content = <p>Zvolte třídu a skupiny v nastavení.</p>;
    } else {
        content = <TimetableInfo {...props} timetable={props.timetable}/>;
    }

    return (
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center p-5">
            <Button variant="outline-secondary" href="/nastaveni">
                <i className="bi bi-gear-fill"></i> nastavení
            </Button>
            <div className="flex-fill d-flex justify-content-center align-items-center">
                {content}
            </div>
            <Button variant="outline-secondary" href="https://github.com/matous-volf/rozvrh">
                <i className="bi bi-github"></i> GitHub
            </Button>
        </div>
    );
}

export default MainPage
