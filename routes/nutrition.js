const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    // Render the page without search results initially
    res.render('nutrition', { nutrients: null, photo: null });
  });
  
  router.post('/', async (req, res) => {
    const query = req.body.query;
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const unsplashUrl = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&client_id=${process.env.unsplash_api}`;

    try {
      const response = await axios.post(url, { query }, {
        headers: {
          'x-app-id': process.env.x_app_id_secret,
          'x-app-key': process.env.x_app_key_secret,
          'Content-Type': 'application/json',
        },
      });
      const unsplashResponse = await axios.get(unsplashUrl);
        const photos = unsplashResponse.data.results;
        const photo = photos.length > 0 ? photos[0].urls.regular : null;
  
      const nutrients = response.data.foods;
      // Render the same page but this time pass the nutrients data
      res.render('nutrition', { nutrients, photo: photo });
    } catch (error) {
      console.error('API request failed:', error);
      res.render('nutrition', { nutrients: null });
    }
  });
  
module.exports = router;
