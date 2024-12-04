const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateTicketPDF = (ticketDetails) => {
  return new Promise((resolve, reject) => {
    // Create a new PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set the file path to save the generated PDF
    const filePath = path.join(__dirname, '..', 'public', 'tickets', `${ticketDetails.ticketId}.pdf`);
    
    // Pipe the PDF to a file
    doc.pipe(fs.createWriteStream(filePath));

    // Set title and header
    doc.fontSize(20).text('Bus Ticket Confirmation', { align: 'center' });
    doc.moveDown(2);

    // Add ticket details
    doc.fontSize(12).text(`Ticket ID: ${ticketDetails.ticketId}`);
    doc.text(`User ID: ${ticketDetails.userId}`);
    doc.text(`Bus Number: ${ticketDetails.busNumber}`);
    doc.text(`Seat Number: ${ticketDetails.seat}`);
    doc.text(`Journey Date: ${ticketDetails.journeyDate}`);
    doc.text(`Ticket Price: $${ticketDetails.ticketPrice}`);
    doc.moveDown(2);

    // Footer or additional details
    doc.text('Thank you for choosing our service!', { align: 'center' });

    // Finalize the PDF file
    doc.end();

    // Resolve the promise with the file path once the PDF is generated
    doc.on('finish', () => resolve(filePath));
    doc.on('error', (err) => reject(err));
  });
};

module.exports = generateTicketPDF;
