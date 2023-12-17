import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import School from "../models/School.ts";
import {getSchools} from "../api/schools.ts";
import {Typeahead} from "react-bootstrap-typeahead";
import {Option} from "react-bootstrap-typeahead/types/types";

interface Props {
    selectedSchool: School | null;
    setSelectedSchoolCallback: (school: School | null) => void;
}

function SchoolSettings(props: Props) {
    const [selectedSchool, setSelectedSchool] = useState<School | null>(props.selectedSchool);

    const setSelectedSchoolCallback = props.setSelectedSchoolCallback;
    useEffect(() => {
        setSelectedSchoolCallback(selectedSchool);
    }, [setSelectedSchoolCallback, selectedSchool]);

    const {data, isLoading} = useQuery({
        queryKey: ["schools"],
        queryFn: getSchools
    });

    const schools: School[] = useMemo(() => data === undefined ? [] : data, [data])

    useEffect(() => {
        if (!isLoading && schools.length < 1) {
            setSelectedSchool(null);
        }
    }, [schools, isLoading]);

    return (
        <>
            <h2>Škola</h2>
            <Typeahead style={{maxWidth: "100%"}} options={schools} labelKey="name"
                       onChange={(selected) => setSelectedSchool(selected.length < 1 ? null : selected[0] as School)}
                       selected={selectedSchool === null ? [] : [selectedSchool as Option]}
                       id="input-school"/>
        </>
    );
}

export default SchoolSettings;
