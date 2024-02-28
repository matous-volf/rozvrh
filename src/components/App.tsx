import {useCallback, useMemo, useState} from "react";
import MainPage from "./MainPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SettingsPage from "./SettingsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {getTimetable} from "../api/timetable.ts";
import School from "../models/School.ts";

function setLocalStorage<T extends T2, T2>(
    key: string,
    value: T,
    setState: React.Dispatch<React.SetStateAction<T2>>
) {
    localStorage.setItem(key, JSON.stringify(value));
    setState(value);
}

function App() {
    const [selectedSchool, setSelectedSchool] = useState<School | null>(
        JSON.parse(localStorage.getItem("selectedSchool")!)
    );

    const [selectedClassId, setSelectedClassId] = useState<string | null>(
        JSON.parse(localStorage.getItem("selectedClassId")!)
    );

    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
        JSON.parse(localStorage.getItem("selectedGroupIds")!) || []
    );

    const handleSelectedSchoolChange = useCallback((school: School | null) => {
            if (school?.id !== selectedSchool?.id) {
                setLocalStorage("selectedClassId", null, setSelectedClassId);
                setLocalStorage("selectedGroupIds", [], setSelectedGroupIds);
                setLocalStorage("selectedSchool", school, setSelectedSchool);
            }
        }, [selectedSchool]
    );

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
            if (classId !== selectedClassId) {
                setLocalStorage("selectedGroupIds", [], setSelectedGroupIds);
                setLocalStorage("selectedClassId", classId, setSelectedClassId);
            }
        }, [selectedClassId]
    );

    const handleSelectedGroupIdsChange = useCallback((groupIds: string[]) => {
            setLocalStorage("selectedGroupIds", groupIds, setSelectedGroupIds);
        }, []
    );

    const timetableQuery = useQuery({
        queryKey: ["timetable", selectedSchool?.id, selectedClassId, selectedGroupIds],
        queryFn: () => {
            if (selectedSchool === null || selectedClassId === null) {
                return null;
            }

            return getTimetable(selectedSchool, selectedClassId, selectedGroupIds);
        }
    });
    const timetable = timetableQuery.data === undefined ? null : timetableQuery.data;

    const router = useMemo(() => createBrowserRouter([
                {
                    path: "/",
                    element: <MainPage timetable={timetable} isQueryLoading={timetableQuery.isLoading}
                            isQueryError={timetableQuery.isError}/>,
                },
                {
                    path: "/nastaveni",
                    element: <SettingsPage isTimetableQueryLoading={timetableQuery.isLoading}
                            isTimetableQueryError={timetableQuery.isError}
                            timetable={timetable}
                            selectedSchool={selectedSchool}
                            setSelectedSchoolCallback={handleSelectedSchoolChange}
                            selectedClassId={selectedClassId}
                            selectedGroupIds={selectedGroupIds}
                            setSelectedClassIdCallback={handleSelectedClassIdChange}
                            setSelectedGroupIdsCallback={handleSelectedGroupIdsChange}/>,
                },
            ]), [timetable, timetableQuery, selectedSchool, handleSelectedSchoolChange, selectedClassId, selectedGroupIds,
            handleSelectedClassIdChange, handleSelectedGroupIdsChange]);

    return (
        <div className="h-100">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App
