const idField = document.getElementById('docIdField');
const dataField = document.getElementById('dataField');
const readAllBtn = document.getElementById('getallBtn');
const readBtn = document.getElementById('readBtn');
const createBtn = document.getElementById('createBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');


const resultsDiv = document.getElementById('results');

createBtn.addEventListener('click', () => {
    fetch('/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataField.value
    })
        .then(r => r.json())
        .then(doc => {
            resultsDiv.innerHTML = '';
            resultsDiv.innerHTML = JSON.stringify(doc, null, 2);
        })
});

updateBtn.addEventListener("click", () => {
    const id = idField.value.trim();
    const updatedData = JSON.parse(dataField.value);


    fetch(`/data/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
        .then(res => res.json())
        .then(data => {
            resultsDiv.innerHTML = ` Updated: ${JSON.stringify(data, null, 2)}`;
        })
        .catch(error => console.error("Error:", error));
});

readAllBtn.addEventListener('click', () => {
    fetch('/data')
        .then(r => r.json())
        .then(doc => {
            resultsDiv.innerHTML = '';
            resultsDiv.innerHTML = JSON.stringify(doc, null, 2);
        })
});

readBtn.addEventListener('click', () => {
    fetch('/data/' + idField.value)
        .then(r => r.json())
        .then(doc => {
            resultsDiv.innerHTML = '';
            resultsDiv.innerHTML = JSON.stringify(doc, null, 2);
        })
});

deleteBtn.addEventListener('click', () => {
    fetch('/data/' + idField.value, {
        method
            : 'DELETE'
    })
        .then(r => r.json())
        .then(doc => {
            resultsDiv.innerHTML = '';
            resultsDiv.innerHTML = JSON.stringify(doc, null, 2);
        })
});