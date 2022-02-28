//endpoints related to notes: it will fetch notes from the database that users have created

const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal error occured");
  }
});

//ROUTE2: Add a new note using: POST "/api/notes/addnote". Login required.
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors, this will run
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal error occured");
    }
  }
);

//ROUTE3: Update an existing node using: PUT "/api/notes/updatenote". Login required.
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    //fetching all the info of existing note from main body
    const { title, description, tag } = req.body;
    //create a newnode object, we will replace this with old note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //find the note to be updated
    let note = await Notes.findById(req.params.id);
    //if note doesn't exist, we will throw an error
    if (!note) {
      return res.status(404).send("Not found");
    }
    //check if the user has requested for their own id and not for anyone else's, if not throw an error
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed!");
    }
    //update the note
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    //display result
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal error occured");
  }
});

//ROUTE4: Delete an existing node using: DELETE "/api/notes/deletenote". Login required.
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted
    let note = await Notes.findById(req.params.id);
    //if note doesn't exist, we will throw an error
    if (!note) {
      return res.status(404).send("Not found");
    }
    //check if the user has requested for their own id and not for anyone else's, if not throw an error
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed!");
    }
    //delete the note
    note = await Notes.findByIdAndDelete(req.params.id);
    //display result
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal error occured");
  }
});

module.exports = router;
