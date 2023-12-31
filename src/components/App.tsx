import {useCallback, useMemo} from "react";
import {useCookies} from "react-cookie";
import MainPage from "./MainPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SettingsPage from "./SettingsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {getTimetable} from "../api/timetable.ts";
import School from "../models/School.ts";

function App() {
    const [cookies, setCookies] = useCookies(["selectedSchool", "selectedClassId", "selectedGroupIds"]);
    const selectedSchool: School | null = cookies.selectedSchool;
    if (selectedSchool === undefined) {
        setCookies("selectedSchool", null);
    }
    const selectedClassId: string = cookies.selectedClassId;
    if (selectedClassId === undefined) {
        setCookies("selectedClassId", null);
    }
    const selectedGroupIds: string[] = cookies.selectedGroupIds;
    if (selectedGroupIds === undefined) {
        setCookies("selectedGroupIds", []);
    }

    const handleSelectedSchoolChange = useCallback((school: School | null) => {
            if (school?.id !== selectedSchool?.id) {
                setCookies("selectedClassId", null);
                setCookies("selectedGroupIds", []);
                setCookies("selectedSchool", school);
            }
        }, [selectedSchool, setCookies]
    );

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
            if (classId !== selectedClassId) {
                setCookies("selectedGroupIds", []);
                setCookies("selectedClassId", classId);
            }
        }, [selectedClassId, setCookies]
    );

    const handleSelectedGroupIdsChange = useCallback((groupIds: string[]) => {
            setCookies("selectedGroupIds", groupIds);
        }, [setCookies]
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
