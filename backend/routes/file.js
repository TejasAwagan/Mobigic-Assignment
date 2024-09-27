const express = require('express');
const { User } = require('../models/user');
const upload = require('../middleware/fileUpload');
const auth = require('../middleware/auth'); 
const fs = require('fs');
const path = require('path');

const router = express.Router();

//uploading file
router.post('/upload', auth, upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Generate a unique 6-digit code for the file
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit code

    const fileData = {
      originalName: req.file.originalname,
      path: req.file.path,
      code: code,
      user: req.user.id, 
    };

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.files.push(fileData); 
    await user.save();

    return res.status(200).json({ message: "File uploaded successfully", code: code });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//listing files
router.get("/list", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user.files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


//deleting file
router.delete("/delete/:fileId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const fileIndex = user.files.findIndex((file) => file._id == req.params.fileId);
    if (fileIndex === -1) return res.status(404).json({ message: "File not found." });

    user.files.splice(fileIndex, 1); 
    await user.save();

    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

//downloading file
router.post('/validate-code/:fileId', auth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { code } = req.body;

    // Find the user by the decoded user ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the file within the user's files array
    const file = user.files.id(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    if (file.code !== code) {
      return res.status(400).json({ message: "Invalid code." });
    }

    const filePath = path.join(__dirname, '..', file.path); // Ensure file.path is relative to the server root
    console.log("Resolved file path:", filePath);

    // Validate if the file still exists on the server
    if (!fs.existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      return res.status(404).json({ message: "File not found on the server." });
    }

    res.set({
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Type': 'application/octet-stream',
    });

    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('error', (error) => {
      console.error("Error streaming file:", error);
      return res.status(500).json({ message: "Error while downloading the file." });
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error("File download error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


module.exports = router;
