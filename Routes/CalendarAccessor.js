import * as ls from './DBLoaderSaver.js'
import {withinFile} from "./DBLoaderSaver.js";

export function getDateComponents(dateObject){
    const result = {
        year: dateObject.getFullYear(),
        month: dateObject.getMonth()+1,
        day: dateObject.getDate()
    };

    //console.log(result);

    return result;
}

export function getNextDay(dateObject){
    const nextDay = new Date(dateObject);
    nextDay.setDate(dateObject.getDate() + 1);

    return nextDay;

}

export function getYearData(year) {
    const years = ls.calendarDB;
const thatYear = years.find(e => e.year === year);

    if (thatYear == null) {
        years.push({
            year,
            months: []
        });
        return getYearData(year);
    }

    return thatYear;
}

export function getMonthData(year, month) {
    const thatYear = getYearData(year);

    const months = thatYear.months;
    const thatMonth = months.find(e => e.month === month);
    if (thatMonth == null) {
        months.push({
            month,
            days: []
        });
        return getMonthData(year, month);
    }

    return thatMonth;
}

export function getDayData(date) {
    const _date = getDateComponents(date);
    const thatMonth = getMonthData(_date.year, _date.month);

    const days = thatMonth.days;
    const thatDay = days.find(e => e.day === _date.day);
    if (thatDay == null) {
        days.push({
            day: _date.day,
            work: 'null',
            vacation: '',
            memo: ''
        });
        return getDayData(date);
    }

    return thatDay;
}

export function insertWorkSchedule(date, work) {

    const thatDay = getDayData(date);
    thatDay.work = work;

}

export function getWorkSchedule(date){
    const theDay = getDayData(date);

    return theDay.work;
}

export function getVacation(date){
    const theDay = getDayData(date);

    return theDay.vacation;
}

export function getMemo(date){
    const theDay = getDayData(date);

    return theDay.memo;
}

export function insertVacation(date, name){
    const theDay = getDayData(date);

    theDay.vacation = name;
}

export function insertMemo(date, memo){
    withinFile(() => {
        const theDay = getDayData(date);

        theDay.memo = memo;
    });
}