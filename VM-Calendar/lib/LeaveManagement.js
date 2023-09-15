let DB = {};

/**
 * file.json을 불러온 뒤 객체 배열을 data에 반환하는 method
 */
async function loadFile() {
    const content = await new Promise((res, rej) => {
        fs.readFile(`./data/Leave_Management_DB.json`, 'utf-8', function (err, data) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });

    data = JSON.parse(content);
}

/**
 * data 배열을 file.json에 저장하는 method
 */
async function saveFile() {
    await new Promise((res, rej) => {
        fs.writeFile(`./data/Leave_Management_DB.json`, JSON.stringify(data), 'utf-8', function (err) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });
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
const getScheduledLeaveDays = function(){
    const scheduledLeaves = DB.aboutaccruedLeaveDays.find(e => e.classification === "scheduledLeave");
    const today = new Date();
    let totalLeaveDays = 0;

    for(const leave of scheduledLeaves.details){
        if(leave.DateOfIssuance <= today){
            totalLeaveDays += leave.days;
        }
    }

    return totalLeaveDays;
}

const getAnnaulLeaveDays = function(){
    const annaulLeaves = DB.aboutaccruedLeaveDays.find(e => e.classification === "annaulLeave");
    const today = new Date();
    let totalLeaveDays = 0;

    for(const leave of annaulLeave.details){
        if(leave.DateOfIssuance <= today){
            totalLeaveDays += leave.days;
        }
    }

    return totalLeaveDays;
}

const getStressManagementLeaveDays = function(){
    const stressManagementLeaves = DB.aboutaccruedLeaveDays.find(e => e.classification === "stressManagementLeave");
    let totalLeaveDays = 0;

    for(const leave of stressManagementLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

const getIncentiveLeaveDays = function(){
    const incentiveLeaves = DB.aboutaccruedLeaveDays.find(e => e.classification === "incentiveLeave");
    let totalLeaveDays = 0;

    for(const leave of incentiveLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

const getPetitionLeaveDays = function(){
    const petitionLeaves = DB.aboutaccruedLeaveDays.find(e => e.classification === "petitionLeave");
    let totalLeaveDays = 0;

    for(const leave of petitionLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

const getTotalLeaveDays = function(){
    let totalLeaveDays = 0;

    totalLeaveDays += getAnnaulLeaveDays();
    totalLeaveDays += getIncentiveLeaveDays();
    totalLeaveDays += getScheduledLeaveDays();
    totalLeaveDays += getPetitionLeaveDays();
    totalLeaveDays += getStressManagementLeaveDays();

    return totalLeaveDays;
}

const getAccruedLeaveDays = function(classification){

    switch(classification){
        case "scheduledLeave":
            return getScheduledLeaveDays();
        case "annaulLeave":
            return getAnnaulLeaveDays();
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
const getTakenLeaveDays = function(classification){
    const takenLeaves = DB.aboutTakenLeaveDays.find(e => e.classification === classification);
    
    return takenLeaves.days;
}

const getTotalTakenLeaveDays = function(){
    let totalTakenLeaves = 0;

    totalTakenLeaves += getTakenLeaveDays("scheduledLeave");
    totalTakenLeaves += getTakenLeaveDays("annaulLeave");
    totalTakenLeaves += getTakenLeaveDays("stressManagementLeave");
    totalTakenLeaves += getTakenLeaveDays("incentiveLeave");
    totalTakenLeaves += getTakenLeaveDays("petitionLeave");

    return totalTakenLeaves;
}


// 위로, 포상, 청원 휴가 DB에 추가하는 methods

const createLeaveObject = function(classification, name, days){
    return {
        classification,
        name,
        days
    };
}

const insertLeaveDaysToDB = function(classification, leaveName, leaveDays){
    if(classification === "scheduledLeave" || classification === "annaulLeave"){
        console.warn("이 구분에는 휴가를 추가 할 수 없습니다.");
        return false;
    }
    const leaveObject = createLeaveObject(classification, leaveName, leaveDays);
    let theLeaves = DB.aboutaccruedLeaveDays.find(e => e.classification === classification);
    theLeaves.details.push(leaveObject);
    return true;
}

// 휴가 차감 method
const deductTakenLeaveDaysToDB = function(classification){
    let takenLeaves = DB.aboutTakenLeaveDays.find(e => e.classification === classification);
    takenLeaves.days += 1;
    return true;
}

// 위로, 포상, 청원 휴가 삭제 method
const removeAccruedLeaveDaysToDB = function(classification, leaveName){
    if(classification === "scheduledLeave" || classification === "annaulLeave"){
        console.warn("이 구분에는 휴가를 삭제 할 수 없습니다.");
        return false;
    }
    let accruedLeaves = DB.aboutAccruedLeaveDays.find(e => e.classification === classification);
    let thatLeaves = accruedLeaves.details;
    thatLeaves = thatLeaves.filter(item => item.name !== leaveName);
    return true;
}

// 잔여 휴가를 반환 하는 metnod
const getRamainingLeaveDays = function(classification){
    const accruedLeaveDays = getAccruedLeaveCountToDate(classification);
    const takenLeaveDays = getTakenLeaveDays(classification);
    const remainingLeaveDays = accruedLeaveDays - takenLeaveDays;

    return remainingLeaveDays;
}

module.exports = {
    loadFile,
    saveFile,
    getAccruedLeaveDays,
    getTakenLeaveDays,
    insertLeaveDaysToDB,
    deductTakenLeaveDaysToDB,
    removeAccruedLeaveDaysToDB,
    getRamainingLeaveDays
}