const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
const baseUrl = 'https://receitas.globo.com';

app.use(express.json());
app.use(cors());

app.get('/get-recipe-thumbnail', async (req, res) => {
  try {
    const recipeName = req.query.name;

    if (!recipeName) {
      return res.status(400).json({ error: 'Nome da receita não fornecido.' });
    }

    const params = querystring.stringify({ q: recipeName });
    const searchUrl = `${baseUrl}/busca/?${params}`;
    const response = await axios.get(searchUrl);

    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const firstRecipeImage = $('.widget--info__media ').children('img').attr('src');

      if (!firstRecipeImage) {
        return res.status(404).json({ error: 'Nenhuma receita encontrada.' });
      }

      res.json({ thumbnailUrl: firstRecipeImage });
    } else {
      res.status(500).json({ error: 'Erro ao fazer a busca.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro na requisição.' });
  }
});

const port = 3000; // Você pode alterar a porta conforme necessário
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
