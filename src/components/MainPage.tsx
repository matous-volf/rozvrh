import {Button} from "react-bootstrap";
import TimetableInfo from "./TimetableInfo.tsx";
import Timetable from "../models/Timetable.ts";
import {Link} from "react-router-dom";

interface Props {
    isQueryLoading: boolean;
    isQueryError: boolean;
    timetable: Timetable | null;
    selectedClassId: string | null;
    selectedGroups: string[];
    setSelectedClassIdCallback: (classId: string | null) => void;
    setSelectedGroupsCallback: (groups: string[]) => void;
}

function MainPage(props: Props) {
    let content = null;
    if (props.isQueryLoading ) {
        content = <p>Načítání...</p>;
    } else if (props.isQueryError) {
        content = <p>Rozvrh se nepodařilo načíst.</p>;
    }
    else if (props.timetable === null) {
        content = <p>Zvolte třídu a skupiny v nastavení.</p>;
    } else {
        content = <TimetableInfo {...props} timetable={props.timetable}/>;
    }

    return (
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center p-5">
            <Link to="/nastaveni">
                <Button variant="outline-secondary">
                    <i className="bi bi-gear-fill"></i> nastavení
                </Button>
            </Link>
            <div className="flex-fill d-flex justify-content-center align-items-center">
                {content}
            </div>
            <Button variant="outline-secondary" href="https://github.com/matous-volf/rozvrh" target="_blank">
                <i className="bi bi-github"></i> GitHub
            </Button>
        </div>
    );
}

export default MainPage
