const express = require('express'); // load express module
const nedb = require("nedb-promises"); // load nedb module

const app = express(); // init app
const db = nedb.create('myfile.json'); // init db


app.use(express.static('public')); // enable static routing
app.use(express.json());

//Create
app.post('/data', (req, res) => {
    try {
        const doc = req.body; // Validate JSON
        db.insertOne(doc)
            .then((doc) => res.send({ _id: doc._id }))
            .catch((err) => res.status(500).send('Database error: ' + err.message));
    } catch (error) {
        res.status(400).send('Invalid JSON format: ' + error.message);
    }
});

// Read
app.get('/data/', (req, res) => {
    try {
        db.find({})
            .then((docs) => {
                res.send(docs);
                // const results = docs.map(doc => JSON.stringify(doc, null, 2)).join('<br>');
                // res.send('Results:<br>' + results);
            })
            .catch((err) => res.status(500).send('Database error: ' + err.message));
    } catch (error) {
        res.status(400).send('Invalid JSON format: ' + error.message);
    }
});
app.get('/data/:id', (req, res) => {
    try {
        db.findOne({ _id: req.params.id })
            .then((doc) => {

                res.send(doc);
            })
            .catch((err) => res.status(500).send('Database error: ' + err.message));
    } catch (error) {
        res.status(400).send('Invalid JSON format: ' + error.message);
    }
});

// Update
app.patch('/data/:id', (req, res) => { // PATCH (edit) doc by :id
    db.updateOne(
        { _id: req.params.id }, // find doc with given :id
        { $set: req.body } // update it with new data
    ).then(result => res.send({ result }))
        .catch(error => res.send({ error }));
});

// Delete
app.delete('/data/:id', (req, res) => { // DELETE doc for given :id
    db.deleteOne({ _id: req.params.id }) // remove matching doc
        .then(result => res.send({ result }))
        .catch(error => res.send({ error }));
});

// default route
app.all('*', (req, res) => { res.status(404).send({ error: 'Invalid URL.' }) });
// start server
app.listen(3000, () => console.log('server started: http://localhost:3000'));
