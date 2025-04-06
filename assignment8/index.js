const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module
const bcrypt = require('bcrypt');          // load bcrypt module
const crypto = require('crypto');          // load crypto module

const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

app.use(express.static('public'));        // enable static routing to "./public" folder
// automatically decode all requests from JSON and encode all responses into JSON
app.use(express.json());

// Helper function: remove sensitive info before sending a user record.
function sanitizeUser(user) {
    let { password, authenticationToken, ...rest } = user;
    return rest;
}

// create route to get all user records (GET /users)
app.get('/users', (req, res) => {
    db.find({})
        .then(docs => res.json(docs.map(sanitizeUser)))
        .catch(error => res.json({ error }));
});

// create route to register user (POST /users)
app.post('/users', async (req, res) => {
    const { username, password, email, name } = req.body;
    if (!username || !password || !email || !name) {
        return res.json({ error: 'Missing fields.' });
    }
    try{
        const existingUser = await db.findOne({ username });
        if (existingUser) {
            return res.json({ error: 'Username already exists.' });
        }
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const authenticationToken = crypto.randomBytes(16).toString('hex');
        const newUser = { username, password: hashedPassword, email, name, authenticationToken };
        const doc = await db.insert(newUser);
        const userToSend = sanitizeUser(doc);
        userToSend.authenticationToken = authenticationToken;
        res.json(userToSend);
    }
    catch (error) {
        res.json({ error });
    }
});

// POST /users/auth: log in a user
app.post('/users/auth', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ error: 'Missing username or password.' });
    }
    try {
        const user = await db.findOne({ username });
        if (!user) {
            return res.json({ error: 'Username not found.' });
        }
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
            return res.json({ error: 'Invalid password.' });
        }
        // Generate new authentication token on login.
        const authenticationToken = crypto.randomBytes(16).toString('hex');
        await db.update({ username }, { $set: { authenticationToken } });
        const updatedUser = await db.findOne({ username });
        const userToSend = sanitizeUser(updatedUser);
        userToSend.authenticationToken = authenticationToken;
        res.json(userToSend);
    } catch (err) {
        res.json({ error: err });
    }
});

// PATCH /users/:username/:authenticationToken: update user info
app.patch('/users/:username/:authenticationToken', async (req, res) => {
    const { username, authenticationToken } = req.params;
    try {
        const user = await db.findOne({ username });
        if (!user || user.authenticationToken !== authenticationToken) {
            return res.json({ error: 'Authentication failed.' });
        }
        const { name, email } = req.body;
        if (!name || !email) {
            return res.json({ error: 'Fields cannot be blank.' });
        }
        const updatedCount = await db.update({ username }, { $set: { name, email } });
        if (updatedCount === 0) {
            return res.json({ error: 'Something went wrong.' });
        }
        res.json({ ok: true });
    } catch (err) {
        res.json({ error: err });
    }
});

// DELETE /users/:username/:authenticationToken: delete user profile
app.delete('/users/:username/:authenticationToken', async (req, res) => {
    const { username, authenticationToken } = req.params;
    try {
        const user = await db.findOne({ username });
        if (!user || user.authenticationToken !== authenticationToken) {
            return res.json({ error: 'Authentication failed.' });
        }
        const deletedCount = await db.remove({ username });
        if (deletedCount === 0) {
            return res.json({ error: 'Something went wrong.' });
        }
        res.json({ ok: true });
    } catch (err) {
        res.json({ error: err });
    }
});

// POST /users/logout: log out a user by deleting their auth token
app.post('/users/logout', async (req, res) => {
    const { username, authenticationToken } = req.body;
    try {
        const user = await db.findOne({ username });
        if (!user || user.authenticationToken !== authenticationToken) {
            return res.json({ error: 'Authentication failed.' });
        }
        await db.update({ username }, { $unset: { authenticationToken: true } });
        res.json({ ok: true });
    } catch (err) {
        res.json({ error: err });
    }
});

// default route
app.all('*', (req, res) => { res.status(404).send('Invalid URL.') });

// start server
app.listen(3000, () => console.log("Server started on http://localhost:3000"));
