// this script contains CRUD for handling operations with DB

const Note = require('../models/note.model.js')

// create a save a new note
exports.create = (req, res) => {
  // validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Note content can not be empty"
    })
  }

  // create a note
  const note = new Note({
    title: req.body.title || "Untitled Note",
    content: req.body.content
  })

  // Save note in databse
  note.save()
    .then(data => {
      res.send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error ocurred while creating the note"
      })
    })
};

// Retrieve and return all notes from the database
exports.findAll = (req, res) => {
  Note.find()
    .then(notes => {
      res.send(notes)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes"
      })
    })
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
  Note.findById(req.params.noteId)
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: `Note not found with id ${req.params.noteId}`
        })
      }
      res.send(note)
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Note not found with id ${req.params.noteId}`
        })
      }
      return res.status(500).send({
        message: `Error retrieving note with id ${req.params.noteId}`
      })
    })
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Note content can not be empty"
    });
  }

  // Find note and update it with the request body
  Note.findOneAndUpdate(req.params.noteId, {
    title: req.body.title || "Untitled Note",
    content: req.body.content
  }, { new: true })
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      res.send(note);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      return res.status(500).send({
        message: "Error updating note with id " + req.params.noteId
      });
    });
};

// delete a note with the specified noteId in the request
// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      res.send({ message: "Note deleted successfully!" });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId
        });
      }
      return res.status(500).send({
        message: "Could not delete note with id " + req.params.noteId
      });
    });
};

/*
others methods
https://mongoosejs.com/docs/api.html#document_Document-save

    Mongoose save()
    Mongoose find()
    Mongoose findById()
    Mongoose findByIdAndUpdate()
    Mongoose findByIdAndRemove()
* */


