const axiosConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

function login() {
  const emailField = document.querySelector('#email');
  const pwdField = document.querySelector('#pwd');

  const email = emailField.value;
  const password = pwdField.value;

  axios
    .post('http://localhost:4444/auth', {
      email,
      password,
    })
    .then(res => {
      const token = res.data.token;
      localStorage.setItem('token', token);
      axiosConfig.headers.Authorization = `Bearer ${localStorage.getItem(
        'token'
      )}`;
    })
    .catch(err => alert(`Dados Incorretos`));
}

const addGame = () => {
  const titleInput = document.querySelector('#title');
  const priceInput = document.querySelector('#price');
  const yearInput = document.querySelector('#year');

  const game = {
    title: titleInput.value,
    price: parseFloat(priceInput.value),
    year: Number(yearInput.value),
  };

  // adicionando dados para a API
  axios
    .post('http://localhost:4444/game', game, axiosConfig)
    .then(res => {
      if (res.status === 200) {
        alert('Jogo Cadastrado');
        location.reload();
      }
    })
    .catch(err => console.log(err));
};

function deleteGame(listItem) {
  const id = listItem.getAttribute('data-id');
  axios
    .delete(`http://localhost:4444/game/${id}`, axiosConfig)
    .then(() => {
      alert('Jogo Deletado com sucesso');
    })
    .catch(err => console.log(err));
}

function loadForm(listItem) {
  const id = listItem.getAttribute('data-id');
  const title = listItem.getAttribute('data-title');
  const year = listItem.getAttribute('data-year');
  const price = listItem.getAttribute('data-price');
  document.querySelector('#idEdit').value = id;
  document.querySelector('#titleEdit').value = title;
  document.querySelector('#yearEdit').value = year;
  document.querySelector('#priceEdit').value = price;
}

function updateGame() {
  const idInput = document.querySelector('#idEdit');
  const titleInput = document.querySelector('#titleEdit');
  const priceInput = document.querySelector('#priceEdit');
  const yearInput = document.querySelector('#yearEdit');

  const game = {
    title: titleInput.value,
    price: parseFloat(priceInput.value),
    year: Number(yearInput.value),
  };

  const id = idInput.value;

  axios
    .put(`http://localhost:4444/game/${id}`, game, axiosConfig)
    .then(res => {
      if (res.status === 200) {
        alert('Game Atualizado');
        location.reload();
      }
    })
    .catch(err => console.log(err));
}

axios
  .get('http://localhost:4444/games', axiosConfig)
  .then(res => {
    const games = res.data.games;
    const list = document.querySelector('#games');
    games.forEach(game => {
      const item = document.createElement('li');

      item.setAttribute('data-id', game.id);
      item.setAttribute('data-title', game.title);
      item.setAttribute('data-year', game.year);
      item.setAttribute('data-price', game.price);

      item.innerHTML = `
      Id: ${game.id} <br />
      Nome: ${game.title}
      <br /> 
      Ano de lançamento: ${game.year}
      <br /> 
      Preço: R$${game.price}
      <br />
      `;

      // button dinâmico para delete
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = 'Deletar';
      deleteBtn.addEventListener('click', () => deleteGame(item));

      // button dinâmico para edit

      const editBtn = document.createElement('button');
      editBtn.innerHTML = 'Editar';
      editBtn.addEventListener('click', () => loadForm(item));

      item.appendChild(deleteBtn);
      item.appendChild(editBtn);

      list.appendChild(item);
    });
  })
  .catch(error => console.log(error));
