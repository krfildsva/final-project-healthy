const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('recipes', { recipes: null, error: null });
});

router.post('/search', async (req, res) => {
  const query = req.body.query;
  const url = `https://api.edamam.com/search?q=${query}&app_id=9debe90c&app_key=e0c7d002b71c6abd78fac962a0dee667`;

  try {
      const response = await axios.get(url);
      const recipes = response.data.hits;
      res.render('recipes', { recipes: recipes, error: null });
  } catch (error) {
      res.render('recipes', { recipes: null, error: 'Error, could not fetch data' });
  }
});


module.exports = router;
