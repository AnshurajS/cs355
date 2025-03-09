fetch('/hits'+location.pathname+'-page')
.then(r=>r.text())
.then(txt=>{
    document.getElementById('hits').innerText = 
    'Current hit for this page: ' + txt;
});