import School from "../models/School.ts";

export async function getSchools(): Promise<School[]> {
    const response = await fetch("https://vitskalicky.gitlab.io/bakalari-schools-list/schoolsList.json");
    if (!response.ok) {
        throw new Error();
    }

    return await response.json();
}
