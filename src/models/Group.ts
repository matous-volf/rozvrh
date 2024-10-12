export default class Group {
    id: string;
    name: string | null;
    isBlank: boolean;

    constructor(id: string, name: string | null, isBlank: boolean) {
        this.id = id;
        this.name = name;
        this.isBlank = isBlank;
    }
}
