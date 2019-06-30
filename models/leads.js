import mongoose from 'mongoose';
import uniqueValidator  from 'mongoose-unique-validator';

const leadSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "cannot be empty."]
    },
    last_name: {
        type: String,
        required: [true, "cannot be empty."]
    },
    document_type: {
        type: String,
        required: [true, "cannot be empty."],
        enum : ['CC', 'CE', 'PS', 'DNI', 'Other'],
    },
    document_id: {
        type: String,
        required: [true, "cannot be empty."],
        unique: true,
        lowercase: true,
        index: true
    },
    date_of_expedition: {
        type: Date,
        required: [true, "cannot be empty."],
    },
    email: {
        type: String,
        required: [true, "cannot be empty."],
        unique: true,
        lowercase: true,
        index: true
    },
    date_of_birthday: {
        type: Date,
        required: [true, "cannot be empty."],
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
        required: [true, "cannot be empty."],
        enum : ['Prospect', 'Won', 'Lost'],
        default: 'Prospect',
    },
},{ 
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    }
});

leadSchema.plugin(uniqueValidator, { message: "is already taken." });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
