import express from "express";
import Book from "../Models/BookModel.js";
import { getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} from "../controller/bookController.js";

const router = express.Router();

router.get('/allBooks', getBooks);
router.get('/:id', getBookById);
router.post('/add', addBook);
router.put('/edit/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;

