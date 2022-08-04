// const mongoose = require("mongoose");
import mongoose from 'mongoose';

delete mongoose.connection.models['Registration'];

const registrationSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    name: String,
    id_no: String,
    address: String,
    email: String,
    agency_code: String,
    phone: String,
    contest_id: String,
    qr_code: String,
    checked: { type: Boolean, default: false },
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
