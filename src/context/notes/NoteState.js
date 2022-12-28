import { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props)=>{
   const host ="http://localhost:5000";
    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial);

    // Get all notes
    const getNotes = async ()=>{
      
      const response = await fetch(`http://localhost:5000/api/notes/fetchallnotes`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
     
      const json = await response.json();
      console.log(json);
      let notes = json.map((note)=>{
        return note;
      })
      
      setNotes(notes);
  }

    // Add a note
    const addNote = async (title, description, tag)=>{
        // TODO: API Call
        console.log("adding");
        const response = await fetch(`http://localhost:5000/api/notes/addnote`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag}) 
        });
       
        const json = await response.json();
        console.log(json);

        console.log("Adding a new note.");
        let note = {
            "_id": json._id,
            "user": json.user,
            "title": title,
            "description": description,
            "tag": tag,
            "date": json.date,
            "__v": 0
          };
        setNotes(notes.concat(note));
    }

    // Delete a note
    const deleteNote = async (id)=>{
      // TODO: API Call
      console.log("deleting");
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
        
      });
      const json = await response.json();
      console.log(json);


        console.log(`Deleting the note with ${id}`);
        const newNotes = notes.filter((note)=>{
            return note._id!==id;
        })
        setNotes(newNotes);
    }

    // Edit a note
    const editNote = async (id, title, description, tag)=>{
      // API Call 
      
      const response = await fetch(`http://localhost:5000/api/notes/updatenote/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title, description, tag}) 
      });
     
      const json = await response.json();
      console.log(json);
      // Logic to edit in client
      let newNotes = JSON.parse(JSON.stringify(notes));
      for (let index = 0; index < newNotes.length; index++) {
          const element = notes[index];
          if(element._id === id){
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }
        }
        setNotes(newNotes);
    }


    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}


export default NoteState;