import ClassIdSettings from "./ClassIdSettings.tsx";
import Timetable from "../models/Timetable.ts";
import GroupSettings from "./GroupSettings.tsx";
import {Button} from "react-bootstrap";
import {useState} from "react";
import {Link} from "react-router-dom";

interface Props {
    timetable: Timetable | null;
    selectedClassId: string | null;
    selectedGroups: string[];
    setSelectedClassIdCallback: (classId: string | null) => void;
    setSelectedGroupsCallback: (groups: string[]) => void;
}

function SettingsPage(props: Props) {
    const [selectedGroups, setSelectedGroups] = useState<string[]>(props.selectedGroups);

    const handleSave = () => {
        props.setSelectedGroupsCallback(selectedGroups);
    }

    let groupsContent = null;
    if (props.timetable !== null) {
        groupsContent = <GroupSettings {...props} timetable={props.timetable}
                                       setSelectedGroupsCallback={setSelectedGroups}/>;
    }

    document.title = "Nastavení";

    return (
        <div className="container d-flex flex-column align-items-start gap-3 p-4" style={{maxWidth: "576px"}}>
            <h1>Nastavení</h1>
            <div>
                <ClassIdSettings {...props}/>
            </div>
            <div>
                {groupsContent}
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
