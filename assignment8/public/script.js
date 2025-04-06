'use strict'

const $ = document.querySelector.bind(document);
let currentAuthToken = null;

// login link action
$('#loginLink')?.addEventListener('click', openLoginScreen);

// register link action
$('#registerLink').addEventListener('click', openRegisterScreen);

// logout link action
$('#logoutLink').addEventListener('click', () => {
    if (!$('#username').innerText || !currentAuthToken) {
        showError('You are not logged in.');
        return;
    }
    const data = {
        username: $('#username').innerText,
        authenticationToken: currentAuthToken
    };
    fetch('/users/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else {
                currentAuthToken = null;
                openLoginScreen();
            }
        })
        .catch(err => showError('ERROR: ' + err));
});

// Sign In button action
$('#loginBtn').addEventListener('click', () => {
    // check to make sure username/password aren't blank
    if (!$('#loginUsername').value || !$('#loginPassword').value)
        return;
    const data = {
        username: $('#loginUsername').value,
        password: $('#loginPassword').value
    };
    fetch('/users/auth', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else {
                currentAuthToken = doc.authenticationToken;
                openHomeScreen(doc);
            }
        })
        .catch(err => showError('ERROR: ' + err));
});

// Register button action
$('#registerBtn').addEventListener('click', () => {
    // check to make sure no fields aren't blank
    if (!$('#registerUsername').value ||
        !$('#registerPassword').value ||
        !$('#registerName').value ||
        !$('#registerEmail').value) {
        showError('All fields are required.');
        return;
    }
    // grab all user info from input fields, and POST it to /users
    const data = {
        username: $('#registerUsername').value,
        password: $('#registerPassword').value,
        name: $('#registerName').value,
        email: $('#registerEmail').value
    };
    //   POST /users
    fetch('/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else {
                currentAuthToken = doc.authenticationToken;
                openHomeScreen(doc);
            }
        })
        .catch(err => showError('ERROR: ' + err));
});

// Update button action
$('#updateBtn').addEventListener('click', () => {
    // check to make sure no fields aren't blank
    if (!$('#updateName').value || !$('#updateEmail').value) {
        showError('Fields cannot be blank.');
        return;
    }
    // grab all user info from input fields
    const data = {
        name: $('#updateName').value,
        email: $('#updateEmail').value
    };
    const url = '/users/' + $('#username').innerText + '/' + currentAuthToken;
    fetch(url, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else if (doc.ok) alert("Your name and email have been updated.");
        })
        .catch(err => showError('ERROR: ' + err));
});

// Delete button action
$('#deleteBtn').addEventListener('click', () => {
    // confirm that the user wants to delete
    if (!confirm("Are you sure you want to delete your profile?"))
        return;
    const url = '/users/' + $('#username').innerText + '/' + currentAuthToken;
    fetch(url, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(doc => {
            if (doc.error) showError(doc.error);
            else {
                currentAuthToken = null;
                openLoginScreen()
            }
        })
        .catch(err => showError('ERROR: ' + err));
});

function showListOfUsers() {
    //   GET /users
    fetch('/users')
        .then(response => response.json())
        .then(docs => {
            docs.forEach(showUserInList);
        })
        .catch(err => showError('Could not get user list: ' + err));
}

function showUserInList(doc) {
    // add doc.username to #userlist
    const item = document.createElement('li');
    $('#userlist').appendChild(item);
    item.innerText = doc.username;
}

function showError(err) {
    // show error in dedicated error div
    $('#error').innerText = err;
}

function resetInputs() {
    // clear all input values
    var inputs = document.getElementsByTagName("input");
    for (var input of inputs) {
        input.value = '';
    }
}

function openHomeScreen(doc) {
    // hide other screens, clear inputs, clear error
    $('#loginScreen').classList.add('hidden');
    $('#registerScreen').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal home screen
    $('#homeScreen').classList.remove('hidden');
    // display name, username
    $('#name').innerText = doc.name;
    $('#username').innerText = doc.username;
    // display updatable user info in input fields
    $('#updateName').value = doc.name;
    $('#updateEmail').value = doc.email;
    // clear prior userlist
    $('#userlist').innerHTML = '';
    // show new list of users
    showListOfUsers();
}

function openLoginScreen() {
    // hide other screens, clear inputs, clear error
    $('#registerScreen').classList.add('hidden');
    $('#homeScreen').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal login screen
    $('#loginScreen').classList.remove('hidden');
}

function openRegisterScreen() {
    // hide other screens, clear inputs, clear error
    $('#loginScreen').classList.add('hidden');
    $('#homeScreen').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal register screen
    $('#registerScreen').classList.remove('hidden');
}