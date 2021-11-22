import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import fakeDb from '../database/database.js';

function validate(object, schema) {
  return Object.keys(schema)
    .filter(key => !schema[key](object[key]))
    .map(key => new Error(`${key} is invalid.`));
}

const gameSchema = {
  title: value => typeof value === 'string',
  price: n => n === +n && parseFloat(n) === n, // is number and float,
  year: n => `${n}`.length === 4, // check if has 4 characters
};

const gameRoutes = Router();

// show data
gameRoutes.get('/game/:id', auth, (req, res) => {
  if (!Number.isNaN(Number(req.params.id))) {
    const id = parseInt(req.params.id, 10);

    const HATEOAS = [
      [
        {
          href: `http://localhost:4444/game/${id}`,
          method: 'DELETE',
          rel: 'delete_game',
        },
        {
          href: `http://localhost:4444/game/${id}`,
          method: 'PUT',
          rel: 'edit_game',
        },
        {
          href: `http://localhost:4444/game/${id}`,
          method: 'GET',
          rel: 'get_game',
        },
        {
          href: `http://localhost:4444/games`,
          method: 'GET',
          rel: 'get_all_games',
        },
      ],
    ];

    const game = fakeDb.games.find(g => g.id === id);

    if (!game) return res.status(404);

    return res.status(200).json({ game, _links: HATEOAS });
  }
  return res.status(400);
});

// create data
gameRoutes.post('/game', auth, (req, res) => {
  const { title, price, year } = req.body;
  const errors = validate({ title, price, year }, gameSchema);

  if (errors.length !== 0) {
    const invalidFields = errors.map(error => error.message).join(', ');
    const message = `Os seguintes campos estão no formato errado: ${invalidFields}`;
    return res.status(400).send({ message });
  }
  // tudo certo
  fakeDb.games.push({
    id: fakeDb.games.length + 1,
    title,
    price,
    year,
  });

  return res.sendStatus(200);
});

// Delete Data
gameRoutes.delete('/game/:id', auth, (req, res) => {
  if (!Number.isNaN(Number(req.params.id))) {
    const id = parseInt(req.params.id, 10);
    const index = fakeDb.games.findIndex(g => g.id === id);

    if (index !== -1) {
      fakeDb.games.splice(index, 1);
      res.status(200);
    }
    return res.status(404);
  }
  return res.status(400);
});
// Edit data
gameRoutes.put('/game/:id', auth, (req, res) => {
  if (!Number.isNaN(Number(req.params.id))) {
    const id = parseInt(req?.params?.id, 10);

    const game = fakeDb.games.find(g => g.id === id);

    if (!game) return res.status(404);

    const { title, price, year } = req?.body;

    if ({ title, price, year } !== undefined) {
      game.title = title;
      game.price = price;
      game.year = year;
    }

    return res.status(200);
  }
  return res.status(400);
});
export default gameRoutes;
