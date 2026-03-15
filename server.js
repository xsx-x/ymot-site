const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// הכנס כאן את מזהה הגיליון שלך
const SHEET_ID = '1IGtJOl3Rzpv6mSphefHIVC3Sgxke9Qek9BsdvMVffCc';
const doc = new GoogleSpreadsheet(SHEET_ID);

// בשביל גישה פשוטה, השתמש ב-API key או Service Account JSON
// כאן נניח שימוש ב-API key פתוח
doc.useApiKey('<YOUR_API_KEY>');

async function getSheet() {
    await doc.loadInfo();
    return doc.sheetsByIndex[0];
}

// הוספת טקסט חדש
app.post('/api/addText', async (req, res) => {
    const { id, content } = req.body;
    if (!id || !content) return res.status(400).json({ error: "Missing id or content" });

    const sheet = await getSheet();
    await sheet.addRow({ ID: id, Content: content });
    res.json({ success: true });
});

// קבלת טקסט לפי id
app.get('/api/getText', async (req, res) => {
    const id = req.query.id;
    const sheet = await getSheet();
    await sheet.loadCells();
    const rows = await sheet.getRows();
    const row = rows.find(r => r.ID === id);
    if (row) {
        res.json({ id: row.ID, content: row.Content });
    } else {
        res.json({ error: "Text not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
