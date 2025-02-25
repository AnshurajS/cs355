// load express, initiate app
const express = require('express')
const app = express();

const PORT = 3000;

// static files
app.use(express.static('public'));

// dynamic content routes
var hits = {};
app.get('/hits/:pageId', (req, res) => {
    const pageHits = (hits[req.params.pageId]||0)+1;
    hits[req.params.pageId] = pageHits;
    res.send((pageHits).toString());
});

// default route
app.all('*',(req,res)=>{res.status(404).send('Invalid URL.')});

// start server
app.listen(PORT, () => console.log(
    "Server started on http://localhost:"+PORT));
