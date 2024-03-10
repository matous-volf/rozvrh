import {useCallback, useMemo} from "react";
import MainPage from "./MainPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SettingsPage from "./SettingsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {getTimetable} from "../api/timetable.ts";
import School from "../models/School.ts";
import {useLocalStorage} from "usehooks-ts";

function App() {
    const [selectedSchool, setSelectedSchool] = useLocalStorage<School | null>("selectedSchool", null);
    const [selectedClassId, setSelectedClassId] = useLocalStorage<string | null>("selectedClassId", null);
    const [selectedGroupIds, setSelectedGroupIds] = useLocalStorage<string[]>("selectedGroupIds", []);

    const handleSelectedSchoolChange = useCallback((school: School | null) => {
            if (school?.id !== selectedSchool?.id) {
                setSelectedClassId(null);
                setSelectedGroupIds([]);
                setSelectedSchool(school);
            }
        }, [selectedSchool?.id, setSelectedClassId, setSelectedGroupIds, setSelectedSchool]
    );

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
            if (classId !== selectedClassId) {
                setSelectedGroupIds([]);
                setSelectedClassId(classId);
            }
        }, [selectedClassId, setSelectedClassId, setSelectedGroupIds]
    );

    const handleSelectedGroupIdsChange = useCallback((groupIds: string[]) => {
            setSelectedGroupIds(groupIds);
        }, [setSelectedGroupIds]
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
