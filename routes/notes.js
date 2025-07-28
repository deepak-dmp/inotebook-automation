const express = require("express");
const router = express.Router();
const featchuser = require("../middleware/featchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
// Route 1:- Get all the notes using : GET "". Login required
router.get("/fechallnotes", featchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 2:- Add a new notes using : POST "". Login required
router.post(
  "/addlnote",
  featchuser,
  [
    body("title", "Enter a valid ttle").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    //if there are errors, retuurn bad request  and the error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await notes.save();
      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
