const {v4: uuid} = require('uuid');

class Book {
  constructor(id = uuid(), title = '', description = '', authors = '', favorite = Boolean, fileCover = '', fileName = '',fileBook = '') {
    this.id = id,
    this.title = title,
    this.description = description,
    this.authors = authors,
    this.favorite = favorite,
    this.fileCover = fileCover,
    this.fileName = fileName,
    this.fileBook = fileBook
  }
}

module.exports = Book