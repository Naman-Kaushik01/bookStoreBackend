import express from "express";
import Book from "../Models/BookModel.js";

const router=express.Router();

router.post('/add', async (req, res) => {
  try {
    const { title, author, genre, publishedDate } = req.body;
    
    // Create a new book instance with the request data
    const newBook = new Book({
      title,
      author,
      genre,
      publishedDate,
    });

    // Attempt to save the new book to the database
    await newBook.save();

    // Send success response
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    // If there's a validation error, send a detailed error message
    res.status(400).json({ message: 'Error adding book', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // Get the page and limit query parameters, default to page 1 and limit 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of books to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Fetch books with pagination
    const books = await Book.find().skip(skip).limit(limit);

    // Count the total number of books in the database
    const totalBooks = await Book.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalBooks / limit);

    // Send response with books and pagination data
    res.status(200).json({
      books,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalBooks: totalBooks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// booksRoute.js (GET route to fetch a single book by ID)
router.get('/:id', async (req, res) => {
  try {
    // Extract the ID from the route parameter
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    // Fetch the book by ID from the database
    const book = await Book.findById(id);

    // If book is not found, return a 404 response
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Return the book in the response
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

// booksRoute.js (PUT route to update a book)
router.put('/:id', async (req, res) => {
  try {
    // Extract the ID and updated data from the request
    const { id } = req.params;
    const updatedBookData = req.body;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    // Attempt to find and update the book in the database
    const updatedBook = await Book.findByIdAndUpdate(id, updatedBookData, { new: true });

    // If the book was not found, return a 404 error
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Return the updated book details
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
});

//Performing Delete Operation
router.delete('/:id', async (req, res) => {
  try {
    // Extract the ID from the URL parameter
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    // Attempt to find and delete the book by ID
    const deletedBook = await Book.findByIdAndDelete(id);

    // If the book was not found, return a 404 error
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Return a success message indicating the book has been deleted
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});





export default router;
