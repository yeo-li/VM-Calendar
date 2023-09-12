const fs = require('fs'); // 파일 시스템 모듈을 사용할때 필요함


const data = [];


/**
 * file.json을 불러온 뒤 객체 배열을 data에 반환하는 method
 */
async function loadFile() {
  const content = await new Promise((res, rej) => {
      fs.readFile(`./data/file.json`, 'utf-8', function (err, data) {
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
 * 필요한 년도의 json 데이터를 읽기 및 생성하는 method
 * @param {number} year 
 * @returns
 */
function getYear(year) {
  const years = data;
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
function getDate(year, month, day) {
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
 * 
 * @param {*} year 
 * @param {*} month 
 * @returns 
 */
function calendarTitle(year, month){

    return `${year}년 ${month}월`;
}

/**
 * 
 * @param {*} year 
 * @returns 
 */
function isLeapYear(year){
  if(year%4 === 0){
    if(year%100 === 0){
      if(year%400 === 0){
        return true;
      }
      return false;
    }
    return true;
  }

  return false;
}

/**
 * 
 * @param {*} year 
 * @param {*} month 
 * @returns 
 */
function periodOfMonth(year, month){
  const thirty = [4, 6, 9, 11];
  let result = 0;

  if(month === 2){
    if(isLeapYear(year, month)){
      result =  29;
    } else{
      result = 28;
    }
  } else {
    thirty.forEach(function(value){
      if(month === value){
        result = 30;
      }
    });
  }
  if(result === 0){
    result = 31;
  }

  return result;
}

// 해당 주차의 day를 출력해 가공한 뒤 반환
/**
 * 
 * @param {*} ord 
 * @param {*} days 
 * @returns 
 */
function printOneWeekDay(ord, days){
  let html = ``;

  for(let i = 0; i < 7 ; i++){
    let day = `<div class="col d${i}">`;
    if(days[ord][i] === 0){
      day += `&nbsp;</div>`;
    } else{
      day += `${days[ord][i]}</div>`;
    }

    html += day;
  }

  return html;
}

/**
 * 
 * @param {number} ord 
 * @param {number} year 
 * @param {number} month 
 * @param {Array} days 
 * @returns 
 */
function printOneWeekWork(ord, year, month, days){
  let html = ``;
  loadFile();

  const theMonth = getMonth(year, month);

  for(let i = 0; i < 7 ; i++){
    const theDay = theMonth.find(e => e.day === days[ord][i]);
    let day = `<div class="col d${i}">`;

    if(days[ord][i] === 0){
      day += `&nbsp;</div>`;
    } else{

      if(theDay){
        day += `${theDay.work}</div>`;
      } else{
        day += `NULL</div>`;
      }
    }
    html += day;
  }

  return html;
}

/**
 * 
 * @param {*} ord 
 * @param {*} year 
 * @param {*} month 
 * @param {*} days 
 * @returns 
 */
function printOneWeekSchedule(ord, year, month, days){
  let html = ``;

  loadFile();

  const theMonth = getMonth(year, month);

  for(let i = 0; i < 7 ; i++){
    let day = `<div class="col d${i} schedule">`;

    if(days[ord][i] === 0){
      //console.log("왜 이게 실행됨?");
      day += `&nbsp;</div>`;
    } else{
      if(datas[days[ord][i]-1] != undefined){
        //console.log("오 이번엔 얘야?");
        if(datas[days[ord][i]-1].schedule.length > 0){
          for(let j = 0; j < datas[days[ord][i]-1].schedule.length; j++){
            day += `<div class="btn"><font size=2>${datas[days[ord][i]-1].schedule[j].title}</font></div>`;
          }
        } else{
          day += `<div class="null">&nbsp;</div><div class="null">&nbsp;</div>`;
        }

        day += `</div>`;
      } else{
        //console.log("엥???")
        day += `NULL</div>`;
      }
    }

    html += day;
  }

  return html;
}

/**
 * 
 * @param {*} ord 
 * @param {*} days 
 * @param {*} work 
 * @param {*} schedule 
 * @returns 
 */
function printWeek(ord, days, work, schedule){
  return `
  <div class="week-${ord}" style="border: 0px;">

  <div class="row days">
    ${days}
  </div>
    
  <div class="row work">
    ${work}
  </div>

  <div class="row shcedule">
    ${schedule}
  </div>
  `;
}

// 해당 월의 총 달력을 반환?
/**
 * 
 * @param {*} year 
 * @param {*} month 
 * @returns 
 */
function printWeeks(year, month){
  const date = new Date();
  date.setFullYear(year, month-1, 1);

  const startDay = date.getDay(); //0~6
  const period = periodOfMonth(year, month);
  let day = 1;
  let days = [];

  // save 
  for(let i = 0; i < 6; i++){
    let week = [];
    for(let j = 0; j < 7; j++){
      if((j < startDay && i === 0) || (day > period)){
        week.push(0);
      } else if(day <= period){
        week.push(day);
        day++;
      }
    }
    days.push(week);
  }


  let html = ``;

  for(let i = 0; i < 6; i++){
    html += (printWeek(i, printOneWeekDay(i, days), 
                         printOneWeekWork(i, year, month, days),
                         printOneWeekSchedule(i, year, month, days)) + '</div>');
  }


  return html;
  
}

/**
 * 입력한 년도와 월의 달력을 출력함
 * @param {number} year 
 * @param {number} month 
 * @returns 달력 html을 반환
 */
function calendar(year, month){
    // 1,3,5,7,8,10,12: 31일 2,4,6,9,11: 30일 2:28일or29일

    const date = new Date();
    const period = periodOfMonth(year, month);
    
    date.setFullYear(year, month-1, 1);



    const html = `
    <div class="container-xl text-center calender">
    <div class="row">
        <div class="col">
            <div class="row header">
                <a class="btn col prevDay">prev</a>
                <div class="col dataTitle">${calendarTitle(year, month)}</div>
                <a class="btn col nextDay">next</a>
            </div>
    
            <div class="row">
                <div class="col">일</div>
                <div class="col">월</div>
                <div class="col">화</div>
                <div class="col">수</div>
                <div class="col">목</div>
                <div class="col">금</div>
                <div class="col">토</div>
            </div>

            ${printWeeks(year, month)}
            
        </div>
    </div>
</div>

    `;


    return html; // 시작을 인덱스 5번부터 하면됨!!! 그럼 배열로 구현하면 되려남...
}

export {
    calendar
}