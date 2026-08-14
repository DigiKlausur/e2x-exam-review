export enum Season {
    SUMMER = 'summer',
    WINTER = 'winter'
}

export const SeasonShorthand: Record<Season, string> = {
    [Season.SUMMER]: 'SS',
    [Season.WINTER]: 'WS'
}
