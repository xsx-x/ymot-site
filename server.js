const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; // Vercel מגדיר את הפורט

app.use(bodyParser.json());
app.use(cors());

// קובץ JSON לשמירת הטקסטים
const DATA_FILE = 'texts.json';
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// API לשליפת טקסט לפי id
app.get('/api/getText', (req, res) => {
    const id = req.query.id;
    const texts = JSON.parse(fs.readFileSync(DATA_FILE));
    const text = texts.find(t => t.id === id);
    if (text) {
        res.json({ id: text.id, content: text.content });
    } else {
        res.json({ error: "Text not found" });
    }
});

// API להוספת טקסט חדש
app.post('/api/addText', (req, res) => {
    const { id, content } = req.body;
    if (!id || !content) return res.status(400).json({ error: "Missing id or content" });

    const texts = JSON.parse(fs.readFileSync(DATA_FILE));
    texts.push({ id, content });
    fs.writeFileSync(DATA_FILE, JSON.stringify(texts));
    res.json({ success: true });
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
