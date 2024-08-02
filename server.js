const express = require('express');
const router = express.Router();
const Booking = require('./models/Booking'); // Adjust the path as needed
const Event = require('./models/Event'); // Adjust the path as needed
const PDFDocument = require('pdfkit'); // If using pdfkit

router.post('/print-ticket', async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).send('Booking ID is required.');
        }

        // Fetch booking details
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found." });
        }

        // Fetch event details
        const event = await Event.findById(booking.eventId);
        if (!event) {
            return res.status(404).json({ error: "Event associated with the booking not found." });
        }

        // Generate a printable ticket format (for simplicity, using plain text here)
        const ticketDetails = `
            Ticket Details
            --------------
            Event Name: ${event.eventName}
            Event Date: ${event.date.toDateString()}
            User ID: ${booking.userId}
            Quantity: ${booking.quantity}
            Booking Date: ${booking.bookingDate.toDateString()}
        `;

        // Send the ticket details as a response (text/plain for simplicity)
        res.setHeader('Content-Type', 'text/plain');
        res.send(ticketDetails);

        // Alternatively, you could generate a PDF and send it as a file download
        // const doc = new PDFDocument();
        // let buffers = [];
        // doc.on('data', buffers.push.bind(buffers));
        // doc.on('end', () => {
        //     let pdfData = Buffer.concat(buffers);
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.setHeader('Content-Disposition', 'attachment; filename=ticket.pdf');
        //     res.send(pdfData);
        // });
        // doc.text(ticketDetails);
        // doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
