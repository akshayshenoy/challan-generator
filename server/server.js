const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/challan/generate', (req, res) => {
  const d = req.body;
  const fine = parseFloat(d.fineAmount);

  if (!d.driverName || isNaN(fine)) {
    return res.status(400).json({ message: 'Driver name and a valid fine amount are required.' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="challan.pdf"');

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text('CHALLAN (SAMPLE / DEMO)', { align: 'center' });
  doc.fontSize(9).fillColor('gray').text('Not an official government document', { align: 'center' });
  doc.fillColor('black').moveDown();

  doc.fontSize(12).text(`Challan ID: CH${Date.now()}`);
  doc.text(`Date Issued: ${d.issueDate || 'N/A'}`);
  doc.moveDown();

  doc.fontSize(14).text('Offense Details', { underline: true });
  doc.fontSize(12);
  doc.text(`Offense: ${d.offenseDescription || 'N/A'}`, { indent: 20 });
  doc.text(`Location: ${d.location || 'N/A'}`, { indent: 20 });
  doc.text(`Fine Amount: Rs. ${fine.toFixed(2)}`, { indent: 20 });
  doc.moveDown();

  doc.fontSize(14).text('Violator Details', { underline: true });
  doc.fontSize(12);
  doc.text(`Driver Name: ${d.driverName}`, { indent: 20 });
  doc.text(`Vehicle Number: ${d.vehicleNumber || 'N/A'}`, { indent: 20 });

  doc.end();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
