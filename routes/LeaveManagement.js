import fs from 'fs';

const path = `./datas/LeaveManagementDB.json`;

let DB = {};
let tmp;
/**
 * file.json을 불러온 뒤 객체 배열을 data에 반환하는 method
 */
async function loadFile() {
    const content = await new Promise((res, rej) => {
        fs.readFile(path, 'utf-8', function (err, data) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });

    DB = JSON.parse(content);
}

/**
 * data 배열을 file.json에 저장하는 method
 */
async function saveFile() {
    await new Promise((res, rej) => {
        fs.writeFile(path,
            JSON.stringify(DB, null, 2), 'utf-8', function (err) {
                if (err) {
                    rej(err);
                } else {
                    res(DB);
                }
            });
    });
}

async function withinFile(action) {
    await loadFile();
    const result = await action();
    await saveFile();

    return result;
}

/*
만들어야 할 것
1. 획득 휴가 분야별로 카운트하기(성과제,연가 / 위로,포상,청원)
2. 사용 휴가 분야별로 카운트하기(성과제,연가 / 위로,포상,청원)
3. 위로, 포상, 청원 휴가 DB에 추가하기
4. 사용한 휴가 DB에 저장하기
5. 받은 위로, 포상, 청원 휴가 삭제하기
6. 분아별 잔여 휴가 반환하기
*/

// 획득 휴가를 반환하는 methods
/**
 * 성과제 외박을 현재 날짜로부터 몇일을 받았는지 반환하는 method
 * @returns {number}
 */
function getScheduledLeaveDays(){
    const scheduledLeaves = DB.aboutAccruedLeaveDays.find(e => e.classification === "scheduledLeave");
    const today = new Date();
    let totalLeaveDays = 0;

    for(const leave of scheduledLeaves.details){
        //console.log(leave)
        if(new Date(leave.DateOfIssuance) <= today){
            totalLeaveDays += leave.days;
        }
    }

    return totalLeaveDays;
}

/**
 * 연가를 현재 날짜로부터 몇일을 받았는지 반환하는 method
 * @returns {number}
 */
function getAnnualLeaveDays(){
    const annualLeaves = DB.aboutAccruedLeaveDays.find(e => e.classification === "annualLeave");
    const today = new Date();
    let totalLeaveDays = 0;

    for(const leave of annualLeaves.details){
        if(new Date(leave.DateOfIssuance) <= today){
            totalLeaveDays += leave.days;
        }
    }

    return totalLeaveDays;
}

/**
 * 위로 휴가를 현재 날짜로부터 몇일을 받았는지 반환하는 method
 * @returns {number}
 */
function getStressManagementLeaveDays(){
    const stressManagementLeaves = DB.aboutAccruedLeaveDays.find(e => e.classification === "stressManagementLeave");
    let totalLeaveDays = 0;

    for(const leave of stressManagementLeaves.details){
        totalLeaveDays += leave.days;
    }

    tmp = totalLeaveDays;

    return totalLeaveDays;
}

/**
 *
 * @returns {number}
 */
function getIncentiveLeaveDays(){
    const incentiveLeaves = DB.aboutAccruedLeaveDays.find(e => e.classification === "incentiveLeave");
    let totalLeaveDays = 0;

    for(const leave of incentiveLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

function getPetitionLeaveDays(){
    const petitionLeaves = DB.aboutAccruedLeaveDays.find(e => e.classification === "petitionLeave");
    let totalLeaveDays = 0;

    for(const leave of petitionLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

function getTotalAccruedLeaveDays(){
    let totalLeaveDays = 0;

    totalLeaveDays += getAnnualLeaveDays();
    totalLeaveDays += getIncentiveLeaveDays();
    totalLeaveDays += getScheduledLeaveDays();
    totalLeaveDays += getPetitionLeaveDays();
    totalLeaveDays += getStressManagementLeaveDays();

    return totalLeaveDays;
}

async function getAccruedLeaveDays(classification){

    switch(classification){
        case "scheduledLeave":
            return getScheduledLeaveDays();
        case "annualLeave":
            return getAnnualLeaveDays();
        case "stressManagementLeave":
            return getStressManagementLeaveDays();
        case "incentiveLeave":
            return getIncentiveLeaveDays();
        case "petitionLeave":
            return getPetitionLeaveDays();
    }

    console.warn("입력하신 구분이 없습니다.");
    return false;
}


// 사용 휴가를 반환하는 methods
function getTakenLeaveDays(classification){
    const takenLeaves = DB.aboutTakenLeaveDays.find(e => e.classification === classification);
    return takenLeaves.days;
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


// 위로, 포상, 청원 휴가 DB에 추가하는 methods

function createLeaveObject(classification, name, days){
    return {
        classification,
        name,
        days
    };
}

function insertLeaveDaysToDB(classification, leaveName, leaveDays){
    if(classification === "scheduledLeave" || classification === "annualLeave"){
        console.warn("이 구분에는 휴가를 추가 할 수 없습니다.");
        return false;
    }
    const leaveObject = createLeaveObject(classification, leaveName, leaveDays);
    let theLeaves = DB.aboutaccruedLeaveDays.find(e => e.classification === classification);
    theLeaves.details.push(leaveObject);
    return true;
}

// 휴가 차감 method
function deductTakenLeaveDaysToDB(classification){
    let takenLeaves = DB.aboutTakenLeaveDays.find(e => e.classification === classification);
    takenLeaves.days += 1;
    return true;
}

// 위로, 포상, 청원 휴가 삭제 method
function removeAccruedLeaveDaysToDB(classification, leaveName){
    if(classification === "scheduledLeave" || classification === "annualLeave"){
        console.warn("이 구분은 휴가를 삭제 할 수 없습니다.");
        return false;
    }
    let accruedLeaves = DB.aboutAccruedLeaveDays.find(e => e.classification === classification);
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

export {

    loadFile,
    saveFile,
    withinFile,

    getAccruedLeaveDays,
    getTotalAccruedLeaveDays,

    getTakenLeaveDays,
    getTotalTakenLeaveDays,

    insertLeaveDaysToDB,

    deductTakenLeaveDaysToDB,
    removeAccruedLeaveDaysToDB,

    getRemainingLeaveDays
}