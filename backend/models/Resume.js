const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One active resume per candidate
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
    verificationScore: {
      type: Number,
      default: 0,
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'REJECTED', 'PENDING'],
      default: 'PENDING',
    },
    verificationRemarks: {
      type: [String],
      default: [],
    },
    verificationDetails: {
      nameFound: { type: Boolean, default: false },
      emailFound: { type: Boolean, default: false },
      phoneFound: { type: Boolean, default: false },
      educationFound: { type: Boolean, default: false },
      skillsFound: { type: Boolean, default: false },
      experienceFound: { type: Boolean, default: false },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);