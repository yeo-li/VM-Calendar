import * as ls from './DBLoaderSaver.js'

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

export function insertDaySchedule(date, schedule) {
    /*
        1. year년 month월 day일의 데이터에 접근한다.
        3. 새로운 daySchedule 객체를 생성한다.
        4. schedule에 push 후 return
    */

     // 해당 날짜에 접근하기
     const thatDay = getDayData(date);
     const schedulesAtThatDay = thatDay.schedule;
 
    console.log(schedulesAtThatDay);

    schedulesAtThatDay.push(createDaySchedule(schedule));
}

export function editDaySchedule(date, schedule, newSchedule) {
    // 해당 날짜에 접근하기
    const thatDay = getDayData(date);
    const schedulesAtThatDay = thatDay.schedule;

    for(const s of schedulesAtThatDay){
        if (s.title === schedule) {
            s.title = newSchedule;
            return;
        }
    }

    console.warn("editDaySchedule: 수정 할 데이터가 없습니다.");
}

export function editTimeSchedule(date, schedule, title, newTitle, time, price, add) {
    const thatDay = getDayData(date);
    const schedulesAtThatDay = thatDay.schedule;

    for(const s of schedulesAtThatDay){
        if (s.title === schedule) {
            for(let t of s.timeTable){
                if(t.title === title){
                    t = createTimeSchedule(newTitle, time, price, add);
                    return;
                }
            }
        }
    }

    console.warn("editTimeSchedule:  저장된 일정이 없습니다.");
}

export function removeDaySchedule(date, schedule) {
    // 해당 날짜에 접근하기
    const thatDay = getDayData(date);
    let schedulesAtThatDay = thatDay.schedule;

    const daySchedule = schedulesAtThatDay.filter((element) => element.title !== schedule);

    if(daySchedule === schedulesAtThatDay){
        console.warn("removeDaySchedule: 삭제할 일정이 없습니다.");
    } else{
        schedulesAtThatDay = daySchedule;
    }
}

export function removeTimeSchedule(date, schedule, title) {
    const thatDay = getDayData(date);
    const schedulesAtThatDay = thatDay.schedule;

    for(const s of schedulesAtThatDay){
        if (s.title === schedule) {
            const timeTable = s.timeTable.filter((element) => element.title !== title);

            if(timeTable === s.timeTable){
                console.warn("removeTimeSchedule: 삭제할 일정이 없습니다.");
            } else{
                s.timeTable = timeTable;
            }

            return;
        }
    }
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

export function insertVacation(date, name){
    const theDay = getDayData(date);

    theDay.vacation = name;
}

export function insertMemo(date, memo){
    const theDay = getDayData(date);

    theDay.memo = memo;
}