const express = require("express");
const router = express.Router();
const featchuser = require("../middleware/featchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
// Route 1:- Get all the notes using : GET "/api/notes/fechallnotes". Login required
router.get("/fechallnotes", featchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 2:- Add a new notes using : POST "/api/notes/addlnote". Login required
router.post(
  "/addnote",
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

// Route 3:- Updating an existing notes using : put "/api/notes/addlnote". Login required
router.put("/updatenotes/:id", featchuser, async (req, res) => {

  try {
    
  
   const { title, description, tag } = req.body;

   //creating a new note object
   const newNotes={}
   if(title){newNotes.title=title}
   if(description){newNotes.description=description}
   if(tag){newNotes.tag=tag}

   //Find the note to be updated and Update it
   let note =await Notes.findById(req.params.id)
   if(!note){return res.status(404).send("Not found")}

   if(note.user.toString() !==req.user.id)
   {
    return res.status(401).send("Not Allowed")
   }

   note= await Notes.findByIdAndUpdate(req.params.id, {$set:newNotes},{new:true})
   res.json({note})
   } 
   catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error"); 
  }
});

// Route 3:- Deleting an existing notes using : Delete "/api/notes/Deletenote". Login required
router.delete("/deletenote/:id", featchuser, async (req, res) => {
  try {
    
  
   //Find the note to be Deleted and Delete it
   let note =await Notes.findById(req.params.id)
   if(!note){return res.status(404).send("Not found")}

   if(note.user.toString() !==req.user.id)
   {
    return res.status(401).send("Not Allowed")
   }

   note= await Notes.findByIdAndDelete(req.params.id)
   res.json({"success":"Deleted successfully","note":note})
   } 
   catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error"); 
  }

});


module.exports = router;
