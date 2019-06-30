import mongoose, { Schema } from 'mongoose';

const leadSchema = Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    document_tye: {
        type: String,
        enum : ['CC', 'CE', 'PS', 'DNI', 'Other'],
    },
    document_id: {
        type: String,
        required: true,
        unique: true
    },
    date_of_expedition: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    date_of_birthday: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum : ['Male', 'Female', 'Other'],
    },
    address: {
        type: String,
    },
    neighborhood: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    mobile_number: {
        type: String,
    },
    approved_judicial_past: {
        type: Boolean,
        default: 0
    },
    approved_personal_information: {
        type: Boolean,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum : ['Prospect', 'Won', 'Lost'],
        default: 'Prospect',
    },
},{ 
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
