import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import LeadModel from './models/leads';

require('dotenv').config();

const { PORT, MONGODB_URI } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// Initialize the app.
const server = app.listen(PORT, function () {
    const port = server.address().port;
    console.log("App now running on port", port);
});

const handleError = (res, reason, message, code) => {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get("/api/leads", async (_, res) => {
    try {
        const leads = await LeadModel.find().exec();
        res.status(200).json(leads);
    } catch (error) {
        handleError(res, error.message, "Failed to get leads.");
    }
});

app.post("/api/leads", async (req, res) => {
    try {
        const lead = new LeadModel(req.body);
        const result = await lead.save();
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error.message, "Failed to created leads.");
    }
});

app.get("/api/leads/:id", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        res.status(200).json(lead);
    } catch (error) {
        handleError(res, error.message, "Failed to get lead.");
    }
});

app.put("/api/leads/:id", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        lead.set(request.body);
        const result = await lead.save();
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error.message, "Failed to updated lead.");
    }
});
