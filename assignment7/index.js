const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module

const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

app.use(express.static('public'));        // enable static routing to "./public" folder
// automatically decode all requests from JSON and encode all responses into JSON
app.use(express.json());

// create route to get all user records (GET /users)
app.get('/users', (req, res) => {
    db.find({})
        .then(docs => res.json(docs))
        .catch(error => res.json({ error }));
});

// create route to get user record (GET /users/:username)
app.get('/users/:username', (req, res) => {
    db.findOne({ username: req.params.username })
        .then(doc => {
            if (doc) res.json(doc);
            else res.json({ error: 'Username not found.' });
        })
        .catch(error => res.json({ error }));
});

// create route to register user (POST /users)
app.post('/users', (req, res) => {
    const { username, password, email, name } = req.body;
    if (!username || !password || !email || !name) {
        return res.json({ error: 'Missing fields.' });
    }
    db.findOne({ username })
        .then(existingUser => {
            if (existingUser) {
                return res.json({ error: 'Username already exists.' });
            }
            // username does not exist, so insert new user
            db.insert({ username, password, email, name })
                .then(doc => res.json(doc))
                .catch(error => res.json({ error }));
        })
        .catch(error => res.json({ error }));
});

// create route to update user doc (PATCH /users/:username)
app.patch('/users/:username', (req, res) => {
    db.update({ username: req.params.username }, { $set: req.body })
        .then(updatedCount => {
            if (updatedCount === 0) {
                return res.json({ error: 'Something went wrong.' });
            }
            res.json({ ok: true });
        })
        .catch(error => res.json({ error }));
});

// create route to delete user doc (DELETE /users/:username)
app.delete('/users/:username', (req, res) => {
    db.remove({ username: req.params.username })
        .then(deletedCount => {
            if (deletedCount === 0) {
                return res.json({ error: 'Something went wrong.' });
            }
            res.json({ ok: true });
        })
        .catch(error => res.json({ error }));
});

// default route
app.all('*', (req, res) => { res.status(404).send('Invalid URL.') });

// start server
app.listen(3000, () => console.log("Server started on http://localhost:3000"));
