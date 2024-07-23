export interface UserModel {
    name: string;
    birthdayYear: number;
}

export interface GroupModel {
    id: number,
    name: string,
}

export interface dateBlockParams {
    key: number,
    color: string,
    border: string,
    onClick:()=>void
}