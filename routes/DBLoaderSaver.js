import fs from "fs";
export let calendarDB, LeaveDB;

const calendarDB_path = '../datas/calendarDB.json';
const LeaveManagementDB_path = '../datas/LeaveDB.json';

export async function loadFile() {
    const content = await new Promise((res, rej) => {
        fs.readFile(calendarDB_path, 'utf-8', function (err, data) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });

    const content2 = await new Promise((res, rej) => {
        fs.readFile(LeaveManagementDB_path, 'utf-8', function (err, data) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });

    //console.log(content2)

    calendarDB = JSON.parse(content);
    LeaveDB = JSON.parse(content2);
}

export async function saveFile() {
    await new Promise((res, rej) => {
        fs.writeFile(calendarDB_path, JSON.stringify(calendarDB, null, 2), 'utf-8', function (err) {
            if (err) {
                rej(err);
            } else {
                res(calendarDB);
            }
        });
    });

    await new Promise((res, rej) => {
        fs.writeFile(LeaveManagementDB_path, JSON.stringify(LeaveDB, null, 2), 'utf-8', function (err) {
            if (err) {
                rej(err);
            } else {
                res(LeaveDB);
            }
        });
    });
}

export async function withinFile(action) {
    await loadFile();
    let result = await action();
    //console.log('withinFile: ' + typeof(resultPromise));
    await saveFile();

    return result;
}
