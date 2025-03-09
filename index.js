const express = require('express');
const nedb = require('nedb-promises'); 

const app = express(); // Initialize app
const db = nedb.create({ filename: 'hits.db', autoload: true }); // Initialize database

app.use(express.static('public')); 

// Route to get the number of hits for a page and increment it
app.get('/hits/:pageId', async (req, res) => {
    const pageId = req.params.pageId;
    try {
        let page = await db.findOne({ pageId });
        if (!page) {
            page = { pageId, count: 1 };
            await db.insert(page);
        } else {
            page.count += 1;
            await db.update({ pageId }, { $set: { count: page.count } });
        }
        res.send(page.count.toString());
    } catch (err) {
        res.status(500).send('Database error');
    }
});

// Default route for invalid URLs
app.all('*', (req, res) => {
    res.status(404).send('Invalid URL.');
});

// Start server
app.listen(3000, () => console.log('Server started on http://localhost:3000'));