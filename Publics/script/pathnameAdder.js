console.log("pathnameAdder: START!!");

const currentURL = window.location.href;

document.getElementById('add-pathname').addEventListener('click', ()=>{
    const newPathname = '/EDIT';
    window.location.href = currentURL + newPathname;
})


let isLeaveTableDisplay = false;
document.getElementById('leaveTableToggle').addEventListener('click', () => {
    const leaveTable = document.getElementById('leaveTable');

    if(isLeaveTableDisplay === false){
        leaveTable.style.display = 'block';
        isLeaveTableDisplay = true;
        document.getElementById('leaveTableToggle').innerHTML = "▲ Leave Table";
    } else{
        leaveTable.style.display = 'none';
        isLeaveTableDisplay = false;
        document.getElementById('leaveTableToggle').innerHTML = "▼ Leave Table";
    }

});

let isLeaveStatusTableDisplay = false;
document.getElementById('leaveStatusTableToggle').addEventListener('click', () => {
    const leaveStatusTable = document.getElementById('leaveStatusTable');

    if(isLeaveStatusTableDisplay === false){
        leaveStatusTable.style.display = 'block';
        isLeaveStatusTableDisplay = true;
        document.getElementById('leaveStatusTableToggle').innerHTML = "▲ 휴가 현황 표";
    } else{
        leaveStatusTable.style.display = 'none';
        isLeaveStatusTableDisplay = false;
        document.getElementById('leaveStatusTableToggle').innerHTML = "▼ 휴가 현황 표";
    }

});

function modal(date){

}