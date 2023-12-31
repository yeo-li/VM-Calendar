import bodyParser from "body-parser"
import * as template from './Routes/template.js'
import express, {query} from 'express'
import * as ls from './Routes/DBLoaderSaver.js'
import * as data from './Routes/CalendarAccessor.js'
import * as ml from './Routes/ManagementLeaveDB.js'
import {mainForEdit} from "./Routes/template.js";

const app = express();
const port = 3000;

/*
  기본 pathname에 들어왔을 때 로직
  현재 날짜를 받고 오늘시달력을 표시 함
  나머지는 달력과 관계 없으므로 그냥 다 표시가기
  필수적으로 표시해야 할 정보: 달력, 휴가관리표(성과제 외박 발급 표, 획득/사용/잔여 휴가 표시 표)
  달력과 휴가관리표는 어떻게 수정할 것인지?

  페이지에서 수정 버튼을 눌러 수정 페이지로 간다 -> 수정한다 -> 저장한다 ->  저장된다. >> 채택

  항상 같은 것: 휴가 사용표 및 성과제 외박 발급표 -> 미들웨어
  추가적으로 필요한 것: express.js 사용법, npm 사용법
*/

// main.js: server(not service)

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('./Publics'))

app.get('/whenisyourleave', async (req, res) => {
  // 현재 날짜를 구한 뒤 현재 날짜의 달력을 출력함 or year과 month, day를 보냄
  const today = new Date();
  const nowDate = data.getDateComponents(today);

  res.redirect(`/whenisyourleave/${nowDate.year}/${nowDate.month}/${nowDate.day}`);
});


app.get('/whenisyourleave/:year/:month/:day', async (req, res) => {
  const year = Number.parseInt(req.params.year);
  const month = Number.parseInt(req.params.month);

  res.send(await template.html(year, month, req.url, await template.main(year, month, req.url)));
});


app.get('/whenisyourleave/:year/:month/:day/EDIT', async (req, res) => {
  const year = Number.parseInt(req.params.year);
  const month = Number.parseInt(req.params.month);

  res.send(await template.html(year, month, req.url, await template.mainForEdit(year, month)));
});


app.post('/whenisyourleave/update_calendar', async (req, res) => {
  const workSchedule = req.body;

  for(let key in workSchedule){
    const date = await new Date(key);
    await ls.withinFile(()=> {
      return data.insertWorkSchedule(date, workSchedule[key]);
    });
  }

  res.redirect('/whenisyourleave');
});


app.get('/whenisyourleave/:year/:month/:day/next_process', (req, res) => {
  let newMonth = Number(req.params.month) + 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth > 12){
    newYear = Number.parseInt(newYear) + 1;
    newMonth -= 12;
  }

  res.redirect(`/whenisyourleave/${newYear}/${newMonth}/${newDay}`);
});

app.get('/1234', (req, res) => {
  return render('calendar.ejs')
}) 

app.get('/whenisyourleave/:year/:month/:day/prev_process', (req, res) => {
  let newMonth = req.params.month - 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth < 1){
    newYear = Number.parseInt(newYear) - 1;
    newMonth += 12;
  }

  res.redirect(`/whenisyourleave/${newYear}/${newMonth}/${newDay}`);
});


app.get('/whenisyourleave/:year/:month/:day/EDIT/next_process', (req, res) => {
  let newMonth = Number(req.params.month) + 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth > 12){
    newYear = Number.parseInt(newYear) + 1;
    newMonth -= 12;
  }

  res.redirect(`/whenisyourleave/${newYear}/${newMonth}/${newDay}/EDIT`);
});


app.get('/whenisyourleave/:year/:month/:day/EDIT/prev_process', (req, res) => {
  let newMonth = req.params.month - 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth < 1){
    newYear = Number.parseInt(newYear) - 1;
    newMonth += 12;
  }

  res.redirect(`/whenisyourleave/${newYear}/${newMonth}/${newDay}/EDIT`);
});

app.post('/whenisyourleave/NewLeave/add', async (req, res) => {
  const data = req.body;

  await ml.insertLeaveToLeaveDB(data.classification, data.dateOfIssuance, data.name, parseInt(data.days));

  res.redirect('/whenisyourleave');
});

app.get('/whenisyourleave/NewLeave', async (req, res) => {

  res.send(await template.clearHTML(await template.addNewVacation()));

});


app.get('/whenisyourleave/leave/:method', async (req, res) => {
  const method = req.params.method;
  const date = req.query.date;

  if(method === 'release'){
    res.redirect(`/whenisyourleave/leave/release/process/start/${date}`);
  } else if(method === 'memo'){
    let html = `
    <form action="/whenisyourleave/leave/memo/process/start" method="post">
    <textarea name="memo">${data.getMemo(new Date(date))}</textarea>
    <input type="hidden" name="date" value="${date}">
    <input class="btn btn-primary" type="submit">
</form>`;

    res.send(await template.clearHTML(html));
  } else if(method === 'remove'){
    let html = ``;

    html += await template.searchVacation(`/whenisyourleave/leave/${req.params.method}`, date);
    if(req.query.classification != null){
      html += await template.searchLeaveTable(`/whenisyourleave/leave/${method}/process/start`, req.query.classification, req.query.date, "checkbox");
      html += await template.submitBtn(method);
    }

    res.send(await template.clearHTML(html));
  } else{
    let html = ``;

    html += await template.searchVacation(`/whenisyourleave/leave/${req.params.method}`, date);
    if(req.query.classification != null){
      html += await template.searchLeaveTable(`/whenisyourleave/leave/${method}/process/start`, req.query.classification, req.query.date, "radio");
      html += await template.submitBtn(method);
    }

    res.send(await template.clearHTML(html));
  }
});

app.get('/whenisyourleave/leave/release/process/start/:date', async (req, res) => {
  const datas = req.params.date;

  await ls.withinFile(async () => {
    let leave = await ml.searchLeaveByName(data.getVacation(new Date(datas)));
    let DATE = new Date(leave.dateOfUse);
    if(leave){
      leave.isUsed = false;
      leave.dateOfUse = "2024-10-08";

      for(let i = 0; i < leave.days; i++){
        if(data.getVacation(DATE) === leave.name){
          data.insertVacation(DATE, '');
          DATE = data.getNextDay(DATE);
        }

      }
    } else{
      console.log("release: empty data");
    }


  });

  res.redirect('/whenisyourleave/');
});

app.post('/whenisyourleave/leave/:method/process/start', async (req, res) => {
  const datas = req.body;
  console.log(datas);

  if(req.params.method === "remove"){
    console.log("remove", datas)

    for(const key of Object.keys(datas)){
      if(key === 'date') continue;
      if(typeof datas[key] === 'string'){
        await ml.removeLeaveToLeaveDB(datas[key]);
      } else{
        for(const value of datas[key]){
          await ml.removeLeaveToLeaveDB(value);
        }
      }
    }
  } else if(req.params.method === "memo"){
    data.insertMemo(new Date(datas.date), datas.memo);

  } else if(req.params.method === "apply"){
    for(const key of Object.keys(datas)){
      if(key === 'date') continue;
      await ls.withinFile(async () => {
        let leave = await ml.searchLeaveByName(datas[key]);
        let DATE = new Date(datas.date);
        let isOkay = true;

        for(let i = 0; i < leave.days; i++){
          if(data.getVacation(DATE) !== ''){
            console.log("apply: collision!");
            isOkay = false;
            break;
          }
          DATE = data.getNextDay(DATE);
        }

        DATE = new Date(datas.date);
        if(isOkay){
          for(let i = 0; i < leave.days;i++){
            data.insertVacation(DATE, datas[key]);
            DATE = data.getNextDay(DATE);
          }

          leave.isUsed = true;
          leave.dateOfUse = datas.date;
        }

      });
    }
  }


  res.redirect('/whenisyourleave/');
});




app.listen(port, () => {
  console.log(`서버가 실행됩니다.(port: ${port})`);
});