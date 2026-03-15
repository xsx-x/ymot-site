const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// מזהה הגיליון (תכניס את מזהה ה‑Sheet שלך)
const SHEET_ID = '1IGtJOl3Rzpv6mSphefHIVC3Sgxke9Qek9BsdvMVffCc';
const doc = new GoogleSpreadsheet(SHEET_ID);

// נטען את ה‑Service Account מה‑Secret של Vercel
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

doc.useServiceAccountAuth(serviceAccount);

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
