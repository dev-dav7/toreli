class DateStore {
    public readonly dayTotalMs: number = 24 * 60 * 60 * 1000

    public getDay(date: Date, startYear:number): number {
        const start = new Date(startYear, 0, 1)
        return Math.trunc(Math.round(date.getTime() - start.getTime()) / this.dayTotalMs)
    }

    public getDate(day: number, startYear:number): Date {
        const start = new Date(startYear, 0, 1)
        return new Date(start.getTime() + day * this.dayTotalMs)
    }
}

export const dateStore: DateStore = new DateStore();
