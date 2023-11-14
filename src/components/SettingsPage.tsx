import ClassIdSettings from "./ClassIdSettings.tsx";
import Timetable from "../models/Timetable.ts";
import GroupSettings from "./GroupSettings.tsx";
import {Button} from "react-bootstrap";
import {useState} from "react";
import {Link} from "react-router-dom";

interface Props {
    timetable: Timetable | null;
    selectedClassId: string | null;
    selectedGroupIds: string[];
    setSelectedClassIdCallback: (classId: string | null) => void;
    setSelectedGroupIdsCallback: (groupIds: string[]) => void;
}

function SettingsPage(props: Props) {
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(props.selectedGroupIds);

    const handleSave = () => {
        props.setSelectedGroupIdsCallback(selectedGroupIds);
    }

    document.title = "Nastavení";

    return (
        <div className="container d-flex flex-column align-items-start gap-3 p-4" style={{maxWidth: "576px"}}>
            <h1>Nastavení</h1>
            <div>
                <ClassIdSettings {...props}/>
            </div>
            <div>
                {props.timetable !== null &&
                    <GroupSettings {...props} timetable={props.timetable}
                                   setSelectedGroupIdsCallback={setSelectedGroupIds}/>}
            </div>
            <Link to="/">
                <Button onClick={handleSave} variant="outline-secondary">
                    <i className="bi bi-check-lg"></i> uložit
                </Button>
            </Link>
        </div>
    );
}

export default SettingsPage
