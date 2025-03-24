 
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book'); 

const app = express();
app.use(express.json());


app.post('/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/books/:id?', async (req, res) => {
    try {
        if (req.params.id) {
            const book = await Book.findById(req.params.id);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        } else {
            const books = await Book.find();
            res.json(books);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(4000, () => console.log('Server running on port 4000'));
    })
    .catch(error => console.error('Database connection error:', error));
