const express = require('express');
const router = express.Router();

const fileMulter = require('../middleware/file');

const Book = require('../Book');
const {v4: uuid} = require('uuid');

const PORT = process.env.CNT_PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost";

const store = {
  books : [
    {
      id: '1',
      title: "Мифы Ктулху",
      description: "Описание",
      authors: "Говард Филлипс Лавкрафт",
      favorite: true,
      fileCover: "string",
      fileName: "CthulhuMythos",
      fileBook: "someFileBook"
    }
  ]
}

router.get('/', (req, res) => {
  const {books} = store;
  res.render("books/index", {
    title: "library",
    books: books
  })
})

router.get('/create', (req, res) => {
  res.render("books/create", {
    title: "library | create",
    books: {}
  })
})

router.post('/create', fileMulter.single('filebook'), (req, res) => {
  const {books} = store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  } = req.body;

  const newBook = new Book(
    uuid(),
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );
  books.push(newBook);

  res.redirect('/books')
})

router.get('/:id', async (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex((elem) => elem.id === id);
  
  if (index !== -1) {
    let cnt = 0;
    try {
      const response = await fetch(`${BASE_URL}:${PORT}/counter/${id}/incr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      cnt = data.cnt;
    } catch (error) {
      console.log(error);
    }

    res.render("books/view", {
      title: "book | view",
      books: books[index],
      count: cnt
    });
  } else {
    res.redirect('/404');
  }
});

router.get('/update/:id', fileMulter.single('filebook'), (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex(elem => elem.id === id);

  if (index === -1) {
    res.redirect('/404');
  }

  res.render("books/update", {
    title: "book | update",
    books: books
  })
});

router.post('/update/:id', fileMulter.single('filebook'), (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex(elem => elem.id === id);

  const {
    title,
    description,
    authors,
  } = req.body;

  if (index === -1) {
    res.redirect('/404');
  }

  books[index] = {
    id,
    title,
    description,
    authors,
    favorite: true,
    fileCover: "string",
    fileName: "CthulhuMythos",
    fileBook: "someFileBook"
  }
  res.redirect(`/books/${id}`);
});

router.post('/delete/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const index = books.findIndex(elem => elem.id === id);

  if (index === -1) {
    res.redirect('/404');
  }

  books.splice(index, 1);
  res.redirect('/books');
});

module.exports = router