const express = require('express')
const path = require('path');
const app = express();
const PORT = 3000;

// Helper functions for random selection
const randInt = n => Math.floor(n * Math.random());
const getRandomItemFromArray = arr => arr[randInt(arr.length)];

// Object mapping breeds to arrays of image filenames from the /public/img folder
const breedsImages = {
  labrador: ['labrador1.jpg', 'labrador2.jpg'],
  pug: ['pug1.jpg', 'pug2.jpg'],
  beagle: ['beagle1.jpg']
};

// Endpoint to return a list of breeds
app.get('/breeds', (req, res) => {
  res.json({
    status: 'success',
    message: Object.keys(breedsImages)
  });
});

// Endpoint to return a local link to a random image for the specified breed
app.get('/image/:breed', (req, res) => {
  const breed = req.params.breed.toLowerCase();
  if (!breedsImages[breed]) {
    return res.status(404).json({ status: 'error', message: 'Breed not found' });
  }
  const randomImage = getRandomItemFromArray(breedsImages[breed]);
  res.json({ status: 'success', message: `/img/${randomImage}` });
});

// Serve all other GET requests from the public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dogs.html'));
});


app.listen(PORT, () => console.log(
    "Server started on http://localhost:"+PORT));
