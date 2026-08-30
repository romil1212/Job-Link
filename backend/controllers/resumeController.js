const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const { extractTextFromFile, verifyResumeText } = require('../services/resumeVerification');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX file' });
    }

    const fileExt = path.extname(req.file.originalname).substring(1).toLowerCase();
    const filePath = req.file.path;

    // 1. Text Extraction
    const rawText = await extractTextFromFile(filePath, fileExt);

    // 2. Custom Verification Logic
    const verificationResults = verifyResumeText(rawText, req.user.name);

    // 3. Remove existing resume file & record (1 active resume per user)
    const existingResume = await Resume.findOne({ userId: req.user._id });
    if (existingResume) {
      if (fs.existsSync(existingResume.filePath)) {
        fs.unlinkSync(existingResume.filePath);
      }
      await Resume.deleteOne({ _id: existingResume._id });
    }

    // 4. Save new verification result in MongoDB
    const newResume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: fileExt.toUpperCase(),
      fileSize: req.file.size,
      ...verificationResults,
    });

    res.status(201).json({
      success: true,
      message: 'Resume verified and stored successfully',
      data: newResume,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'No active resume found' });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Resume.deleteOne({ _id: resume._id });

    res.status(200).json({ success: true, message: 'Resume removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};