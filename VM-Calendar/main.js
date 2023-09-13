const http = require('http'); // 아직 잘 모르겠음
const fs = require('fs'); // 파일 시스템 모듈을 사용할때 필요함
const url = require('url'); // url 모듈을 가져옴
const qs = require('querystring');
const template = require('./lib/template.js');
const data = require('./lib/dataCRUD.js');
const cd = require('./lib/calendar.js');


/*
import http from 'http';
import fs from 'fs';
import url from 'url';
import * as qs from 'querystring';

//import * as temaplate from './lib/template';
import * as cd from './lib/calendar';
import * as data from './lib/dataCRUD';
*/


const server = http.createServer(async function(request, response){
    const URL = request.url;
    const queryData = url.parse(URL, true).query; // url의 queryString을 분석하여 연관배열로 반환해줌
    const pathname = url.parse(URL, true).pathname; // url의 pathname을 가져옴

    if(pathname === '/'){

      await data.withinFile(async () => {
        data.insertWorkSchedule(2023, 11, 4, "주야비");
      });

      let html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Calender</title>

          <style>
          div {
              border: 1px solid rgb(39, 131, 39);
              align-content: center;
          }
          
          div.calender {
              background-color: rgba(111, 228, 111, 0.356);
              border: 1px solid rgb(39, 131, 39);
              align-content: center;
          }

          div.null {
            border: 0px;
          }
      </style>
  
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
              ${cd.calendar(2023,11)}
          </div>
  
        
          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
        </body>
      </html>
      `;

      response.end(html); // template 출력
      response.writeHead(200); // 성공적으로 끝나면 200 보내기
    } else{
      response.end('Not Fount'); // template 출력
    response.writeHead(404); // 성공적으로 끝나면 200 보내기
    }
});

server.listen(3000);