import express from 'express';
import cors from 'cors';
import { auth } from './middlewares/auth.js';
import fakeDb from './database/database.js';

// routes
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

const app = express();
const PORT = 4444;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/games', auth, (req, res) => {
  const HATEOAS = [
    [
      {
        href: `http://localhost:${PORT}/game/0`,
        method: 'DELETE',
        rel: 'delete_game',
      },
      {
        href: `http://localhost:${PORT}/games`,
        method: 'GET',
        rel: 'get_game',
      },
      {
        href: `http://localhost:${PORT}/auth`,
        method: 'POST',
        rel: 'login',
      },
    ],
  ];
  res.status(200).json({ games: fakeDb.games, _links: HATEOAS });
});

app.use('/', gameRoutes); // GET
app.use('/', gameRoutes); // POST
app.use('/', gameRoutes); // DELETE
app.use('/', gameRoutes); // PUT

// login
app.use('/auth', authRoutes);

app.listen(PORT, () =>
  console.log(`API started at http://localhost:${PORT} 🚀`)
);
