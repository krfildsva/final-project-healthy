const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('recipes', { recipes: null, error: null });
});

router.post('/search', async (req, res) => {
  const query = req.body.query;
  const url = `https://api.edamam.com/search?q=${query}&app_id=${process.env.recipes_id}&app_key=${process.env.recipes_key}`;

  try {
      const response = await axios.get(url);
      const recipes = response.data.hits;
      res.render('recipes', { recipes: recipes, error: null });
  } catch (error) {
      res.render('recipes', { recipes: null, error: 'Error, could not fetch data' });
  }
});


module.exports = router;
