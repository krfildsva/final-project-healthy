const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    // Render the page without search results initially
    res.render('nutrition', { nutrients: null });
  });
  
  router.post('/', async (req, res) => {
    const query = req.body.query;
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
  
    try {
      const response = await axios.post(url, { query }, {
        headers: {
          'x-app-id': "54c01ba4",
          'x-app-key': "66362453c280c03203ce650b76981b7a",
          'Content-Type': 'application/json',
        },
      });
  
      const nutrients = response.data.foods;
      // Render the same page but this time pass the nutrients data
      res.render('nutrition', { nutrients });
    } catch (error) {
      console.error('API request failed:', error);
      res.render('nutrition', { nutrients: null });
    }
  });
  
module.exports = router;
