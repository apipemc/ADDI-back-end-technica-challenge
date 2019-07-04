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

const handleSuccess = (res, result) => {
    console.log("SUCCESS: " + result);
    res.status(200).json(result);
}

const handleError = (res, error) => {
    console.log("ERROR: " + JSON.stringify(error));
    if (error.name === 'MongoError' || error.name === 'ValidationError') {
        const message = Object.keys(error.errors).reduce((errors ,key) => {
            errors[key] = error.errors[key].message;
            return errors;
        }, {});
        res.status(422).json({ errors: message });
    } else {
        res.status(500).json({ "error": error.message });
    }
}

app.get("/api/leads", async (_, res) => {
    try {
        const leads = await LeadModel.find().exec();
        handleSuccess(res, leads);
    } catch (error) {
        handleError(res, error);
    }
});

app.post("/api/leads", async (req, res) => {
    try {
        const lead = new LeadModel(req.body);
        const result = await lead.save();
        handleSuccess(res, result);
    } catch (error) {
        handleError(res, error);
    }
});

app.get("/api/leads/:id/process_judicial_past", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        const state = Math.round(Math.random());
        lead.set({
            approved_judicial_past: state,
            status: state ? 'Prospect' : 'Lost',
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
        handleSuccess(res, result);
    } catch (error) {
        handleError(res, error);
    }
});

app.get("/api/leads/:id/process_personal_information", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        const state = Math.round(Math.random());
        lead.set({
            approved_personal_information: state,
            status: state ? 'Prospect' : 'Lost',
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
        handleSuccess(res, result);
    } catch (error) {
        handleError(res, error);
    }
});

app.get("/api/leads/:id/process_credit", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        if(lead.approved_personal_information && lead.approved_judicial_past) {
            const score = Math.floor(0 + Math.random()*(100 + 1 - 0));
            const status = (score >= 60) ? 'Won' : 'Lost';
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
        handleSuccess(res, result);
    } catch (error) {
        handleError(res, error);
    }
});

app.get("/api/leads/:id", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        handleSuccess(res, lead);
    } catch (error) {
        handleError(res, error);
    }
});

app.put("/api/leads/:id", async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id).exec();
        lead.set(req.body);
        const result = await lead.save();
        handleSuccess(res, result);
    } catch (error) {
        handleError(res, error);
    }
});
