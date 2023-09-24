import {useCallback, useMemo} from "react";
import {useCookies} from "react-cookie";
import MainPage from "./MainPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SettingsPage from "./SettingsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {getTimetable} from "../api/bakalariScraper.ts";

function App() {
    const [cookies, setCookies] = useCookies(["selectedClassId", "selectedGroups"]);
    const selectedGroups: string[] = cookies.selectedGroups;
    if (selectedGroups === undefined) {
        setCookies("selectedGroups", []);
    }
    const selectedClassId: string = cookies.selectedClassId;
    if (selectedClassId === undefined) {
        setCookies("selectedClassId", null);
    }

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
            setCookies("selectedClassId", classId);
        }, [setCookies]
    );

    const handleSelectedGroupsChange = useCallback((groups: string[]) => {
            setCookies("selectedGroups", groups);
        }, [setCookies]
    );

    const timetableQuery = useQuery({
        queryKey: ["timetable", selectedClassId, selectedGroups],
        queryFn: () => {
            if (selectedClassId === null) {
                return null;
            }

            return getTimetable(selectedClassId, selectedGroups)
        }
    });

    const timetable = timetableQuery.data === undefined ? null : timetableQuery.data;

    const childrenProps = useMemo(() => {
        return {
            isQueryLoading: timetableQuery.isLoading,
            isQueryError: timetableQuery.isError,
            timetable: timetable,
            selectedClassId: selectedClassId,
            selectedGroups: selectedGroups,
            setSelectedClassIdCallback: handleSelectedClassIdChange,
            setSelectedGroupsCallback: handleSelectedGroupsChange
        };
    }, [timetableQuery.isLoading, timetableQuery.isError, timetable, selectedClassId, selectedGroups,
        handleSelectedClassIdChange, handleSelectedGroupsChange]);

    const router = useMemo(() => createBrowserRouter([
        {
            path: "/",
            element: <MainPage {...childrenProps}/>,
        },
        {
            path: "/nastaveni",
            element: <SettingsPage {...childrenProps}/>,
        },
    ]), [childrenProps]);

    return (
        <div className="h-100">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App
