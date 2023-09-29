import fs from "fs";

let data = {};
const path = `./data/file.json`;
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

    data = JSON.parse(content);
}

async function saveFile() {
    await new Promise((res, rej) => {
        fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8', function (err) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });
}

async function withinFile(action) {
    await loadFile();
    const result = await action();
    //console.log('withinFile: ' + typeof(resultPromise));
    await saveFile();

    return result;
}
function getYear(year) {
    const years = data;
    const thatYear = years.find(e => e.year === year);

    if (thatYear == null) {
        years.push({
            year: year,
            months: []
        });
        return getYear(year);
    }

    return thatYear;
}

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

function getDay2DB(year, month, day) {
    const thatMonth = getMonth(year, month);

    const days = thatMonth.days;
    const thatDay = days.find(e => e.day === day);
    if (thatDay == null) {
        days.push({
            day,
            work: 'null',
            schedule: []
        });
        return getDay2DB(year, month, day);
    }

    return thatDay;
}

function calendarTitle(year, month){

    return `${year}년 ${month}월`;
}


function getWorkSchedule(date){
    const year = date.getFullYear();
    const month = date.getMonth()+1; // 0~11
    const day = date.getDate(); // 1~31
    const theDay = getDay2DB(year, month, day);

    return theDay.work;
}

function rendOneDay(date){ // YYYY-MM-DD
    //console.log(date)
    if(!date){
        return `
        <td></td>`;
    }
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();

    return `
            <td>
                <a href="#"><div>${date.getDate()}</div></a>
                <hr>
                <div><input type="text" value="${getWorkSchedule(date)}" name="${year}-${month}-${day}"></div>
            </td>
    `
}

async function rendOneWeek(startDate){ // startDate: Date Object

    // 만약 문자열이라면 date객체로 변환해준 후 함수 진행
    
    const startDay = startDate.getDay();
    let _date = startDate;
    const date = new Date();
    let html = `<tr>`;

    for(let day = 0; day < 7; day++){
        if(day < startDay) {
            html += rendOneDay(false);
            continue;
        }

        const thisDate = new Date(_date);
        //console.log(thisDate);
        html += rendOneDay(thisDate);
        _date = new Date(_date.setDate(_date.getDate() + 1));

    }

    html += `</tr>`;

    return html;
}

export default async function rendCalendar(year, month, date){
    let html =
        `<form action="/update_calendar" method="post">
<table border="1">
        <thead>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
            <th>일</th>
        </thead>
        <tbody>
`;
    const lastDate = await new Date(year, month, 0).getDate();
    for(let day = 1; day<=lastDate;){
        html += await rendOneWeek(new Date(`${year}-${month}-${day}`));
        //console.log(html);
        day += await (7 - new Date(`${year}-${month}-${day}`).getDay());
    }

    html += `</tbody>
<input type="submit">
</form>`;

    return html;
}





//////////////////////////////////////////////// 가상 실행 공간

//const today = await new Date('2023-9-24');
//console.log(today);


const result = await withinFile(() => {
    return rendCalendar(2023, 10, 13);
});

//const result = convertDateObject(2010, 4, 0);
console.log(result);
//console.log("cho: "+data);
//console.log("result: "+ result);