import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //Fetch all notes
  const getNotes = async () => {
    //API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "auth-token":
          localStorage.getItem('token'),
      },
    });
    const json = await response.json()
    setNotes(json)
  }
   

  //Add a note
  const addNote = async (title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note)); //concat returns an array
  };

  //Delete a note
  const deleteNote = async (id) => {
  //API call
  const response = await fetch(
    `${host}/api/notes/deletenote/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
    }
  );
  const json = response.json();
  console.log(json);

  //client-side
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(
      `${host}/api/notes/updatenote/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "auth-token":
            localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag }),
      }
    );
    const json = await response.json();
    console.log(json);
    
    let newNotes = JSON.parse(JSON.stringify(notes))
    //edit on client side
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, getNotes, addNote, deleteNote, editNote }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
