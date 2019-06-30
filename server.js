import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Server as SocketServer } from 'ws';
import 'dotenv/config';

import LeadModel from './models/leads';

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

const wss = new SocketServer({ server });

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

app.get("/api/leads/:id/process_judicial_past", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        lead.set({
            approved_judicial_past: Math.round(Math.random()),
        });
        const result = await lead.save();
        const rand = Math.round(Math.random() * (3000 - 500)) + 500;
        setTimeout(() => {
            wss.clients.forEach(client => {
                client.send(JSON.stringify({
                    type: 'UPDATE_LEAD::JUDICIAL_PASS',
                    id: result._id,
                    data: result,
                }));
            });
        }, rand);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error.message, "Failed to process judicial past leads.");
    }
});

app.get("/api/leads/:id/process_personal_information", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        lead.set({
            approved_personal_information: Math.round(Math.random()),
        });
        const result = await lead.save();
        const rand = Math.round(Math.random() * (3000 - 500)) + 500;
        setTimeout(() => {
            wss.clients.forEach(client => {
                client.send(JSON.stringify({
                    type: 'UPDATE_LEAD::PERSONAL_INFORMATION',
                    id: result._id,
                    data: result,
                }));
            });
        }, rand);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error.message, "Failed to process personal information leads.");
    }
});

app.get("/api/leads/:id/process_credit", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        if(lead.approved_personal_information && lead.approved_judicial_past) {
            const score = Math.floor(0 + Math.random()*(100 + 1 - 0));
            const status = (score => 60) ? 'Won' : 'Lost';
            lead.set({ score, status });
        } else {
            lead.set({ status: 'Lost', score: 0 });
        }
        const result = await lead.save();
        const rand = Math.round(Math.random() * (3000 - 500)) + 500;
        setTimeout(() => {
            wss.clients.forEach(client => {
                client.send(JSON.stringify({
                    type: 'UPDATE_LEAD::STATUS',
                    id: result._id,
                    data: result,
                }));
            });
        }, rand);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error.message, "Failed to process credit leads.");
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
