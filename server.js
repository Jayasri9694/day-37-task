const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILES_DIR = path.join(__dirname, 'files');

// Ensure the files directory exists
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);
}

// 1. API endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const timestamp = new Date().toISOString();
    const filename = `${new Date().toISOString().replace(/[:]/g, '-')}.txt`; // Replace colons to avoid issues in filenames

    fs.writeFile(path.join(FILES_DIR, filename), timestamp, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating file', error: err });
        }
        res.status(201).json({ message: 'File created successfully', filename });
    });
});

// 2. API endpoint to retrieve all text files in the folder
app.get('/files', (req, res) => {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving files', error: err });
        }
        // Filter to only include .txt files
        const txtFiles = files.filter(file => file.endsWith('.txt'));
        res.status(200).json(txtFiles);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
