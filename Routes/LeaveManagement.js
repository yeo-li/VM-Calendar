import * as ls from './DBLoaderSaver.js';

/*
만들어야 할 것
1. 획득 휴가 분야별로 카운트하기(성과제,연가 / 위로,포상,청원)
2. 사용 휴가 분야별로 카운트하기(성과제,연가 / 위로,포상,청원)
3. 위로, 포상, 청원 휴가 DB에 추가하기
4. 사용한 휴가 DB에 저장하기
5. 받은 위로, 포상, 청원 휴가 삭제하기
6. 분아별 잔여 휴가 반환하기
*/

export function getAccruedLeaveDays(classification){
    const annualLeaves = ls.LeaveDB.filter(e => e.classification === classification);
    const today = new Date();
    let totalLeaveDays = 0;

    for(const leave of annualLeaves){
        if(new Date(leave.DateOfIssuance) <= today){
            totalLeaveDays += leave.days;
        }
    }

    return totalLeaveDays;
}

// 획득 휴가를 반환하는 methods
/**
 * 성과제 외박을 현재 날짜로부터 몇일을 받았는지 반환하는 method
 * @returns {number}
 */
export function getTotalAccruedLeaveDays(){
    let totalLeaveDays = 0;

    totalLeaveDays += getAccruedLeaveDays("scheduledLeave");
    totalLeaveDays += getAccruedLeaveDays("annualLeave");
    totalLeaveDays += getAccruedLeaveDays("stressManagementLeave");
    totalLeaveDays += getAccruedLeaveDays("incentiveLeave");
    totalLeaveDays += getAccruedLeaveDays("petitionLeave");

    return totalLeaveDays;
}

// 사용 휴가를 반환하는 methods
function getTakenLeaveDays(classification){
    const takenLeaves = ls.LeaveDB.filter(e => e.classification === classification);
    let takenLeaveDays = 0;
    for(const leave of takenLeaves){
        takenLeaveDays += leave.days;
    }

    return takenLeaveDays;
}

function getTotalTakenLeaveDays(){
    let totalTakenLeaves = 0;

    totalTakenLeaves += getTakenLeaveDays("scheduledLeave");
    totalTakenLeaves += getTakenLeaveDays("annualLeave");
    totalTakenLeaves += getTakenLeaveDays("stressManagementLeave");
    totalTakenLeaves += getTakenLeaveDays("incentiveLeave");
    totalTakenLeaves += getTakenLeaveDays("petitionLeave");

    return totalTakenLeaves;
}

async function getTotalRemainingLeaveDays() {
    let totalRemainingDays = 0;

    totalRemainingDays += await getRemainingLeaveDays("scheduledLeave");
    totalRemainingDays += await getRemainingLeaveDays("stressManagementLeave");
    totalRemainingDays += await getRemainingLeaveDays("annualLeave");
    totalRemainingDays += await getRemainingLeaveDays("petitionLeave");
    totalRemainingDays += await getRemainingLeaveDays("incentiveLeave");

    return totalRemainingDays;
}


// 위로, 포상, 청원 휴가 DB에 추가하는 methods

function createLeaveObject(DateOfIssuance, name, days){
    return {
        DateOfIssuance,
        name,
        days
    };
}

function insertLeaveDaysToDB(classification, leaveName, leaveDays, DateOfIssuance){
    if(classification === "scheduledLeave" || classification === "annualLeave"){
        console.warn("이 구분에는 휴가를 추가 할 수 없습니다.");
        return false;
    }
    const leaveObject = createLeaveObject(DateOfIssuance, leaveName, leaveDays);
    let theLeaves = ls.LeaveDB.aboutaccruedLeaveDays.find(e => e.classification === classification);
    theLeaves.details.push(leaveObject);
    return true;
}

// 휴가 차감 method
function updateTakenLeaveDaysToDB(classification, days){
    let takenLeaves = ls.LeaveDB.aboutTakenLeaveDays.find(e => e.classification === classification);
    takenLeaves.days = days;
    return true;
}

function detectOneTakenLeaveDaysToDB(classification){
    let takenLeaves = ls.LeaveDB.aboutTakenLeaveDays.find(e => e.classification === classification);
    takenLeaves.days += 1;
    return true;
}

// 위로, 포상, 청원 휴가 삭제 method
function removeAccruedLeaveDaysToDB(classification, leaveName){
    if(classification === "scheduledLeave" || classification === "annualLeave"){
        console.warn("이 구분은 휴가를 삭제 할 수 없습니다.");
        return false;
    }
    let accruedLeaves = ls.LeaveDB.aboutAccruedLeaveDays.find(e => e.classification === classification);
    let thatLeaves = accruedLeaves.details;
    thatLeaves = thatLeaves.filter(item => item.name !== leaveName);
    return true;
}

// 잔여 휴가를 반환 하는 metnod
async function getRemainingLeaveDays(classification){
    let accruedLeaveDays, takenLeaveDays, remainingLeaveDays;

    accruedLeaveDays = await getAccruedLeaveDays(classification);
    takenLeaveDays = await getTakenLeaveDays(classification);
    remainingLeaveDays = accruedLeaveDays - takenLeaveDays;

    return remainingLeaveDays;
}

export function isLeaveIssued(leave){
    const leaveDate = new Date(leave.DateOfIssuance);
    const today = new Date();

    if(leaveDate <= today){
        return true;
    }

    return false;
}

export function getIssuedLeaveDays(classification){
    const incentiveLeaves = ls.LeaveDB.filter(e => e.classification === classification);
    let totalLeaveDays = 0;

    for(const leave of incentiveLeaves){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

export function getTotalIssuedLeaveDays(){
    let totalLeaveDays = 0;

    totalLeaveDays += getIssuedLeaveDays("scheduledLeave");
    totalLeaveDays += getIssuedLeaveDays("annualLeave");
    totalLeaveDays += getIssuedLeaveDays("stressManagementLeave");
    totalLeaveDays += getIssuedLeaveDays("incentiveLeave");
    totalLeaveDays += getIssuedLeaveDays("petitionLeave");

    return totalLeaveDays;
}

export {
    getTakenLeaveDays,
    getTotalTakenLeaveDays,

    insertLeaveDaysToDB,

    updateTakenLeaveDaysToDB,
    detectOneTakenLeaveDaysToDB,
    removeAccruedLeaveDaysToDB,

    getRemainingLeaveDays,
    getTotalRemainingLeaveDays
}