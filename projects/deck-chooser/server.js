const fs = require('fs');
const csv = require('csv-parser');
const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

app.use(express.static('public'));

// Replace with the actual raw GitHub URL where your images are located:
const coverBaseURL = 'https://raw.githubusercontent.com/OmarJAH/magic-ma3/refs/heads/main/resources/images/deck-cover/';
const filePath = path.join(__dirname, 'data', 'MagicDecksUpdt.csv');
app.get('/data', (req, res) => {
  const data = [];
  const invalidRows = [];

  fs.createReadStream(filePath)
    .pipe(csv({
      mapHeaders: ({ header }) => header.trim(),
      skipLinesWithError: true,
      strict: true
    }))
    .on('data', (row) => {
      // Trim all values
      Object.keys(row).forEach((key) => {
        if (row[key]) {
          row[key] = row[key].trim();
        }
      });

      // Validate row
      const isValid = Object.values(row).some(value => value && value !== '');
      if (!isValid) {
        invalidRows.push(row);
        return; // skip this invalid row
      }

      // Now use the new column (e.g., "ImageNumber") to set the Cover URL
      // Make sure the column name matches your CSV header exactly.
      if (row.ImageNumber) {
        row.Cover = `${coverBaseURL}${row.ImageNumber}.png`; 
        console.log(row.Cover);
      } else {
        // If no image number, set a default or skip
        row.Cover = `${coverBaseURL}default.jpg`;
      }

      data.push(row);
    })
    .on('end', () => {
      console.log(`Gesamt geladene Daten: ${data.length}`);
      console.log(`Übersprungene ungültige Zeilen: ${invalidRows.length}`);
      fs.writeFileSync('invalidRows.json', JSON.stringify(invalidRows, null, 2));
      res.json(data);
    })
    .on('error', (err) => {
      console.error('Fehler beim Lesen der CSV-Datei:', err);
      res.status(500).send('Fehler beim Laden der Daten');
    });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
