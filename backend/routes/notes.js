const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router =express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// Route3: Get loggedin User Details using: GET "/api/notes/fetchallnotes". Login required

router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    
    const userId = req.user.id;
    console.log(userId);
    try {
        const notes = await Notes.find({user:req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
})


// Route4: Add a new Note using: POST "/api/notes/addnote". Login required

router.post('/addnote',fetchuser,[
    body('title').isLength({min:3}),
    body('description').exists()
], async (req,res)=>{
    
    console.log("Calling add note");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {title, description, tag} = req.body;
        const note = new Notes({
            title, description,tag, user: req.user.id
        });
        const savedNote = await note.save();
        
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
})


// Route5: Add a new Note using: PUT "/api/notes/updatenote". Login required

router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    
    try {
        const {title, description, tag} = req.body;
        
        // Create new note
        const newNote = {};
        
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        console.log("Updating321");

        // Find the note to be updated
        let savedNote = await Notes.findById(req.params.id);
        console.log(savedNote);
        // Note not found
        if(!savedNote){
            return res.status(404).send("Not Found");
        }
        // User id of note not same 
        if(savedNote.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }

        savedNote = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
})


// Route6: Add a new Note using: DELETE "/api/notes/updatenote". Login required

router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
    
    try {
        // Find the note to be deleted
        let savedNote = await Notes.findById(req.params.id);
        console.log(savedNote);
        // Note not found
        if(!savedNote){
            return res.status(404).send("Not Found");
        }
        // User id of note not same 
        if(savedNote.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }

        savedNote = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note has been deleted", note: savedNote});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
})

module.exports = router;