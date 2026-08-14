import {ISemester} from "../interfaces/ISemester";
import {SeasonShorthand} from "../enums";
import {IUserBase} from "../interfaces/IUser";

const fsIllegalCharacterRegex: RegExp = /[^a-z0-9\-\_]/gi;
const substitutions: [string|RegExp, string][] = [
    [/[äæ]/g, 'ae'],
    [/[öőøœ]/g, 'oe'],
    [/[üű]/g, 'ue'],
    ['Å', 'Aa'],
    [/[ÄÆ]/g, 'Ae'],
    [/[ÖŐØŒ]/g, 'Oe'],
    [/[ÜŰ]/g, 'Ue'],
    ['ß', 'ss'],
    [/[ .]/g, '_']
];

export function semesterToShorthand(semester: ISemester): string{
    return SeasonShorthand[semester.season] + semester.year;
}

export function replaceCommonSpecialCharacters(str: string): string{
    substitutions.forEach((substitution) => str = str.replaceAll(substitution[0], substitution[1]));
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function removeUnsafeCharacters(str: string): string {
    return str.replaceAll(fsIllegalCharacterRegex, '');
}

export function toFsSafeString(str: string): string {
    return removeUnsafeCharacters(replaceCommonSpecialCharacters(str));
}

export function userToDisplayName(user: IUserBase | undefined): string | undefined {
    if(!user) return undefined;
    return user.firstname + " " + user.lastname;
}
