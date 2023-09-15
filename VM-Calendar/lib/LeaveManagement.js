let leaveDB = {};

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
3. 현재 시점에서 획득한 성과제 외박/연가 카운트하기
4. 
*/

const getPerformanceLeaveCountToDate = function(){
    const scheduledLeaves = leaveDB.aboutaccruedLeaveDays.find(e => e.classification === "scheduledLeave");
    const today = new Date();
    let totalLeaveDays = 0;

    for(const leave of scheduledLeaves.details){
        if(leave.DateOfIssuance <= today){
            totalLeaveDays += leave.days;
        }
    }

    return totalLeaveDays;
}

const getAnnaulLeaveCountToDate = function(){
    const annaulLeaves = leaveDB.aboutaccruedLeaveDays.find(e => e.classification === "annaulLeave");
    const today = new Date();
    let totalLeaveDays = 0;

    for(const leave of annaulLeave.details){
        if(leave.DateOfIssuance <= today){
            totalLeaveDays += leave.days;
        }
    }

    return totalLeaveDays;
}

const getStressManagementLeaveCountToDate = function(){
    const stressManagementLeaves = leaveDB.aboutaccruedLeaveDays.find(e => e.classification === "stressManagementLeave");
    let totalLeaveDays = 0;

    for(const leave of stressManagementLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

const getIncentiveLeaveCountToDate = function(){
    const incentiveLeaves = leaveDB.aboutaccruedLeaveDays.find(e => e.classification === "incentiveLeave");
    let totalLeaveDays = 0;

    for(const leave of incentiveLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

const getPetitionLeaveCountToDate = function(){
    const petitionLeaves = leaveDB.aboutaccruedLeaveDays.find(e => e.classification === "petitionLeave");
    let totalLeaveDays = 0;

    for(const leave of petitionLeaves.details){
        totalLeaveDays += leave.days;
    }

    return totalLeaveDays;
}

const getTotalLeaveCountToDate = function(){
    let totalLeaveDays = 0;

    totalLeaveDays += getAnnaulLeaveCountToDate();
    totalLeaveDays += getIncentiveLeaveCountToDate();
    totalLeaveDays += getPerformanceLeaveCountToDate();
    totalLeaveDays += getPetitionLeaveCountToDate();
    totalLeaveDays += getStressManagementLeaveCountToDate();

    return totalLeaveDays;
}

