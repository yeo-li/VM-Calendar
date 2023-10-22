import {LeaveDB, withinFile, loadFile} from "./DBLoaderSaver.js";
await loadFile();

/*
필요한 것
1. 획득 휴가 반환(배열) -> 완
2. 전체 휴가 반환(배열) -> 완
3. 사용 휴가 반환(배열) -> 완
4. 반환한 배열의 총 휴가 개수 반환
5. 휴가 정렬 함수(DateOfIssuance 로 정렬)
6. 획득 날짜가 현재보다 이전인지 반환 -> 사용가능 한지
7. 휴가 생성
 */

export function isAcquiredLeaveAvailable(leave){
    //console.log(leave);
    const today = new Date();
    const DateOfIssuance = new Date(leave.dateOfIssuance);
    //console.log(today > DateOfIssuance);
    return today >= DateOfIssuance;
}

export async function getTotalAcquiredLeaveArray(){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave => isAcquiredLeaveAvailable(leave));

    return leaveArray;
}
export async function getTotalLeaveArray(){
    return LeaveDB;
}
export async function getTotalUnUsedLeaveArray(){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave => !leave.isUsed);

    return leaveArray;
}
export async function getTotalUnusedAndAcquiredLeaveArray(){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave =>
        isAcquiredLeaveAvailable(leave) && !leave.isUsed);

    return leaveArray;
}


export async function getAcquiredLeaveArray(classification){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave =>
        leave.classification === classification && isAcquiredLeaveAvailable(leave));
    //console.log(leaveArray)
    return leaveArray;
}
export async function getLeaveArray(classification){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave =>
        leave.classification === classification);

    return leaveArray;
}
export async function getUnusedLeaveArray(classification){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave =>
        leave.classification === classification && !leave.isUsed);

    return leaveArray;
}

export async function getUsedLeaveArray(classification){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave =>
        leave.classification === classification && leave.isUsed);

    return leaveArray;
}
export async function getUnusedAndAcquiredLeaveArray(classification){
    let leaveArray;

    leaveArray = LeaveDB.filter(leave =>
        leave.classification === classification && isAcquiredLeaveAvailable(leave) && !leave.isUsed);

    return leaveArray;
}



function searchLeaveByName(name){
    let leave;

    leave = LeaveDB.find(leave => leave.name === name);

    return leave;
}
async function createLeave(classification, dateOfIssuance, name, days, isUsed, dateOfUse){
    return {
        classification,
        dateOfIssuance,
        name,
        days,
        isUsed,
        dateOfUse
    }
}
async function sortLeavesByDateAscending(){
    LeaveDB.sort(function(a, b){
        const A = new Date(a.dateOfIssuance);
        const B = new Date(b.dateOfIssuance);

        if(A > B) return 1;
        if(A === B) return 0;
        if(A < B) return -1;
    });
}
async function insertLeaveToLeaveDB(classification, dateOfIssuance, name, days, isUsed=false, dateOfUse="2024-10-08"){
    const leave = await createLeave(classification, dateOfIssuance, name, days, isUsed, dateOfUse);

    await withinFile(async () => {
        if(searchLeaveByName(name)){
            console.warn("같은 이름의 휴가가 있습니다.");
            return false;
        }

        await LeaveDB.push(leave);
        await sortLeavesByDateAscending();
    });

    return true;
}



export async function removeLeaveToLeaveDB(name){
    await withinFile(async () => {
        const idx = LeaveDB.indexOf(searchLeaveByName(name));
        let tmp;
        tmp = LeaveDB[0];
        LeaveDB[0] = LeaveDB[idx];
        LeaveDB[idx] = tmp;

        LeaveDB.shift();

        await sortLeavesByDateAscending();
    });

    return true;
}



export async function editLeaveToLeaveDB(oldName, classification, dateOfIssuance, name, days, isUsed=false, dateOfUse="2024-10-08"){
    if(!searchLeaveByName(oldName)){
        console.warn("수정하시려는 휴가가 존재하지 않습니다.");
        return false;
    }

    await removeLeaveToLeaveDB(oldName);
    await insertLeaveToLeaveDB(classification, dateOfIssuance, name, days, isUsed=false, dateOfUse="2024-10-08")

    return true;
}



export function countLeaveDays(leaveArray){
    let totalDays = 0;
    for(const leave of leaveArray){
        totalDays += leave.days;
    }

    return totalDays;
}

///////////////////////////////////
