import fs from 'fs' // 파일 시스템 모듈을 사용할때 필요함
import * as ls from './loadAndSaveData.js';

/**
 * 필요한 년도의 json 데이터를 읽기 및 생성하는 method
 * @param {number} year 
 * @returns
 */
function getYear(year) {
    const years = ls.calendarDB;
const thatYear = years.find(e => e.year === year);

    if (thatYear == null) {
        years.push({
            year,
            months: []
        });
        return getYear(year);
    }

    return thatYear;
}

/**
 * 필요한 년도와 월의 json 데이터를 읽기 및 생성하는 method
 * @param {number} year 
 * @param {number} month 
 * @returns
 */
function getMonth(year, month) {
    const thatYear = getYear(year);

    const months = thatYear.months;
    const thatMonth = months.find(e => e.month === month);
    if (thatMonth == null) {
        months.push({
            month,
            days: []
        });
        return getMonth(year, month);
    }

    return thatMonth;
}

/**
 * 필요한 년도와 월, 일의 json 데이터를 읽기 및 생성하는 method
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @returns 
 */
function getDay(year, month, day) {
    const thatMonth = getMonth(year, month);

    const days = thatMonth.days;
    const thatDay = days.find(e => e.day === day);
    if (thatDay == null) {
        days.push({
            day,
            work: 'null',
            schedule: []
        });
        return getDay(year, month, day);
    }

    return thatDay;
}

/**
 * 소일정(time schedule)을 생성한 뒤 반환하는 method
 * @param {number} title 
 * @param {number} time 
 * @param {number} price 
 * @param {number} add 
 * @returns 
 */
function createTimeSchedule(title, time, price, add) {
    return {
        title,
        time,
        price,
        add
    };
}

/**
 * 대일정(dya schedule)을 생성한 뒤 반환하는 method
 * @param {string} schedule 
 * @returns
 */
function createDaySchedule(schedule) {
    return {
        "title": schedule,
        "timeTable": []
    }
}

/**
 * 사용자가 원하는 day의 day schedule에 time schedule을 추가하도록 하는 method
 * @param {number} year 접근하려는 데이터의 년도
 * @param {number} month 접근하려는 데이터의 월
 * @param {number} day 접근하려는 데이터의 일
 * @param {string} schedule 접근하려는 데이터의 이름
 * @param {string} title 추가하려는 일정의 이름
 * @param {string} time 추가하려는 일정의 시간
 * @param {number} price 추가하려는 일정에서의 사용 금액
 * @param {string} add 추가하려는 일정에서의 메모
 */
function insertTimeSchedule(year, month, day, schedule, title, time, price, add) {
    /*
        1. year년 month월 day일의 데이터에 접근한다.
        2. schedule과 이름이 같은 daySchedule을 찾는다.
        3. 새로운 timeSchedule 객체를 생성한다.
        4. daySchedule에 push 후 return
        5. 없다면 경고문 출력 후 함수 종료
    */

    // 해당 날짜에 접근하기
    const thatDay = getDay(year, month, day);
    const schedulesAtThatDay = thatDay.schedule;

    console.log(schedulesAtThatDay);

    // 해당 날짜의 대일정 순회
    for (const s of schedulesAtThatDay) {
        // 지정한 대일정과 같은 이름을 가진 스케줄을 찾으면 
        if (s.title === schedule/*new schedule name*/) {
            // 새로운 timeSchedule 생성
            const timeSchedule = createTimeSchedule(title, time, price, add);

            // 지정한 대일정 배열에 push 후 종료
            s.timeTable.push(timeSchedule);
            return;
        } 
    }

    // 지정한 대일정이 없다면 경고문 출력 후 함수 종료
    console.warn("저장된 일정이 없습니다.");
}

/**
 * 사용자가 원하는 day의 day schedule을 추가하도록 하는 method
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {string} schedule 
 */
function insertDaySchedule(year, month, day, schedule) {
    /*
        1. year년 month월 day일의 데이터에 접근한다.
        3. 새로운 daySchedule 객체를 생성한다.
        4. schedule에 push 후 return
    */

     // 해당 날짜에 접근하기
     const thatDay = getDay(year, month, day);
     const schedulesAtThatDay = thatDay.schedule;
 
    console.log(schedulesAtThatDay);

    schedulesAtThatDay.push(createDaySchedule(schedule));
}

/**
 * 사용자가 원하는 day의 day schedule의 title을 수정하는 method
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {string} schedule 
 * @param {string} newSchedule 
 */
function editDaySchedule(year, month, day, schedule, newSchedule) {
    // 해당 날짜에 접근하기
    const thatDay = getDay(year, month, day);
    const schedulesAtThatDay = thatDay.schedule;

    for(const s of schedulesAtThatDay){
        if (s.title === schedule) {
            s.title = newSchedule;
            return;
        }
    }

    console.warn("editDaySchedule: 수정 할 데이터가 없습니다.");
}

/**
 * 사용자가 원하는 day의 day schedule의 time schedule의 title을 수정하는 method
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {string} schedule 
 * @param {string} title 
 * @param {string} newTitle 
 * @param {string} time 
 * @param {number} price 
 * @param {string} add 
 */
function editTimeSchedule(year, month, day, schedule, title, newTitle, time, price, add) {

    const thatDay = getDay(year, month, day);
    const schedulesAtThatDay = thatDay.schedule;

    for(const s of schedulesAtThatDay){
        if (s.title === schedule) {
            for(const t of s.timeTable){
                if(t.title === title){
                    const timeSchedule = createTimeSchedule(newTitle, time, price, add);

                    t = timeSchedule;
                    return;
                }
            }
        }
    }


    console.warn("editTimeSchedule:  저장된 일정이 없습니다.");
}

/**
 * 사용자가 원하는 day의 day schedule을 삭제하는 method
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {string} schedule 
 */
function removeDaySchedule(year, month, day, schedule) {
    // 해당 날짜에 접근하기
    const thatDay = getDay(year, month, day);
    const schedulesAtThatDay = thatDay.schedule;

    const daySchedule = schedulesAtThatDay.filter((element) => element.title !== schedule);

    if(daySchedule === schedulesAtThatDay){
        console.warn("removeDaySchedule: 삭제할 일정이 없습니다.");
    } else{
        schedulesAtThatDay = daySchedule;
    }

    return;
}

/**
 * 사용자가 원하는 day의 day schedule의 time schedule을 삭제하는 method
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {string} schedule 
 * @param {string} title 
 */
function removeTimeSchedule(year, month, day, schedule, title) {
    const thatDay = getDay(year, month, day);
    const schedulesAtThatDay = thatDay.schedule;

    for(const s of schedulesAtThatDay){
        if (s.title === schedule) {
            timeTable = s.timeTable.filter((element) => element.title !== title);

            if(timeTable === s.timeTable){
                console.warn("removeTimeSchedule: 삭제할 일정이 없습니다.");
            } else{
                s.timeTable = timeTable;
            }

            return;
        }
    }
}

/**
 * 사용자가 원하는 day의 work를 삽입하는 method
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {string} work 
 * @returns
 */
function insertWorkSchedule(year, month, day, work) {

    const thatDay = getDay(year, month, day);
    thatDay.work = work;

    return;
}

export {
    insertTimeSchedule,
    insertDaySchedule,
    editDaySchedule,
    editTimeSchedule,
    removeDaySchedule,
    removeTimeSchedule,
    insertWorkSchedule
};