import http  from 'http' // 아직 잘 모르겠음
import fs from 'fs' // 파일 시스템 모듈을 사용할때 필요함
import * as url from 'url' // url 모듈을 가져옴
import bodyParser from "body-parser";
import * as template from './routes/template.js'
import * as data from './routes/dataCRUD.js'
import renderCalendar from './publics/calendar.js'
import * as LM from './routes/LeaveManagement.js'
import express, {response} from 'express'
import * as calendar from './routes/allNewCalendar.js';
import * as ls from './routes/loadAndSaveData.js';
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

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  // 현재 날짜를 구한 뒤 현재 날짜의 달력을 출력함 or year과 month, day를 보냄
  const today = new Date();
  const nowYear = today.getFullYear();
  const nowMonth = today.getMonth() + 1;
  const nowDay = today.getDate();

  //res.send('/: Completed');
  res.redirect(`/VMC/${nowYear}/${nowMonth}/${nowDay}`);
});
app.get('/VMC/:year/:month/:day', async (req, res) => {
  const year = Number.parseInt(req.params.year);
  const month = Number.parseInt(req.params.month);

  res.send(await template.main(year, month, req.url));
});

// todo 원하는 날짜에 근무표 저장 한 뒤 메인 페이지로 이동하는 로직 짜기
app.post('/update_calendar', async (req, res) => {
  const workSchedule = req.body;

  for(let key in workSchedule){
    const date = await new Date(key);
    const year = await date.getFullYear();
    const month = await date.getMonth()+1;
    const day = await date.getDate();

    await ls.withinFile(()=> {
      return calendar.insertWorkSchedule(year, month, day, workSchedule[key]);
    });
  }

  res.redirect('/');
});

app.get('/VMC/:year/:month/:day/next_process', (req, res) => {
  let newMonth = Number(req.params.month) + 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth > 12){
    newYear = Number(newYear) + 1;
    newMonth -= 12;
  }

  res.redirect(`/VMC/${newYear}/${newMonth}/${newDay}`);
});
app.get('/VMC/:year/:month/:day/prev_process', (req, res) => {
  let newMonth = req.params.month - 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth < 1){
    newYear = Number(newYear) - 1;
    newMonth += 12;
  }

  res.redirect(`/VMC/${newYear}/${newMonth}/${newDay}`);
});


app.post('/update_takenLeaves', async (req, res) =>
{
  const leaves = req.body;
  console.log(leaves)
  for(let key in leaves){
    const value = leaves[key];
    await ls.withinFile(() =>{
      return LM.updateTakenLeaveDaysToDB(key, Number.parseInt(value));
    });
  }

  res.redirect(`/`);
});




app.listen(port, () => {
  console.log('서버가 실행됩니다.(port: 3000)');
})