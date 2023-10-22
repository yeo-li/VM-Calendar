console.log("pathnameAdder: START!!");

const currentURL = window.location.href;

document.getElementById('add-pathname').addEventListener('click', ()=>{
    const newPathname = '/EDIT';
    window.location.href = currentURL + newPathname;
})