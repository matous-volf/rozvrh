import {Button, InputGroup} from "react-bootstrap";
import TimetableInfo from "./TimetableInfo.tsx";
import Timetable from "../models/Timetable.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import WholeTimetableLink from "./WholeTimetableLink.tsx";
import School from "../models/School.ts";
import NoSleep from "nosleep.js";

interface Props {
    teacherModeEnabled: boolean;
    timetable: Timetable | null;
    selectedSchool: School | null;
    isQueryLoading: boolean;
    isQueryError: boolean;
}

function MainPage(props: Props) {
    const navigate = useNavigate();

    document.title = "Rozvrh";

    useEffect(() => {
        const noSleep = new NoSleep();
        document.addEventListener("click", function enableNoSleep() {
            document.removeEventListener("click", enableNoSleep, false);
            void noSleep.enable();
        }, false);
    }, []);

    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center py-5">
            <InputGroup className="w-auto">
                <Button variant="outline-secondary" onClick={() => navigate("/nastaveni")}>
                    <i className="bi bi-gear-fill"></i> nastavení
                </Button>
                <Button variant="outline-secondary" href="https://github.com/matous-volf/rozvrh" target="_blank">
                    <i className="bi bi-github"></i> GitHub
                </Button>
            </InputGroup>

            <div className="flex-fill d-flex justify-content-center align-items-center">
                {
                    props.isQueryLoading ? (<p>Načítání...</p>
                    ) : props.isQueryError ? (<p>Rozvrh se nepodařilo načíst.</p>
                    ) : props.timetable === null ? (<p>Zvolte školu, třídu a skupiny nebo učitele v nastavení.</p>
                    ) : <TimetableInfo {...props} timetable={props.timetable}/>
                }
            </div>

            {props.timetable !== null &&
                <WholeTimetableLink timetable={props.timetable} selectedSchool={props.selectedSchool!}/>}
        </div>
    );
}

export default MainPage
