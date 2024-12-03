function collectData() {
  const description = document.getElementById(`descriptionInput`).value;
  const date = document.getElementById(`dateInput`).value;
  const time = document.getElementById(`timeInput`).value;
  const index = getNumberOfNotesInLocalStorage();
  return {
    description,
    date,
    time,
    index,
  };
}
function getNumberOfNotesInLocalStorage() {
  return (arr = JSON.parse(localStorage.getItem("notes")).length);
}

function generateHTML(data) {
  const newHTML = `
  <div class="note fade-in"  >
  <i class="bi bi-x-square" onclick="remove(${data.index})"></i>
  <div>${data.description}</div>
  <div>${data.date}</div>
  <div>${data.time}</div>
</div>
`;
  return newHTML;
}

function renderHTML(newHTML) {
  const tableBody = document.getElementById("notes");
  tableBody.innerHTML += newHTML;
}

function resetForm() {
  const notesForm = document.getElementById(`notesForm`);
  notesForm.reset();
  const description = document.getElementById(`descriptionInput`);
  description.focus();
}

function setToLocalStorage(data) {
  const currentTasksInStorageJSON = localStorage.getItem("notes");

  const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON);

  currentTasksInStorage.push(data);

  localStorage.setItem("notes", JSON.stringify(currentTasksInStorage));
}

function initStorage() {
  const currentNotesInStorageJSON = localStorage.getItem(`notes`);

  if (!currentNotesInStorageJSON) {
    localStorage.setItem(`notes`, JSON.stringify([]));
  }
}

function loadFromLocalStorage() {
  const notesJSON = localStorage.getItem(`notes`);
  if (notesJSON) {
    const notes = JSON.parse(notesJSON);
    for (const note of notes) {
      const newHTML = generateHTML(note);
      renderHTML(newHTML);
    }
  }
}

function remove(index) {
  const notesJSON = localStorage.getItem("notes");
  if (!notesJSON) {
    return;
  }
  const notes = JSON.parse(notesJSON);
  notes.splice(index, 1);

  for (let i = 0; i < notes.length; i++) {
    notes[i].index = i;
  }

  localStorage.setItem(`notes`, JSON.stringify(notes));
  refresh();
}

function refresh() {
  document.getElementById(`notes`).innerHTML = "";
  loadFromLocalStorage();
}

function getLocalTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function isNoteExpired(note) {
  const currentDateTime = getLocalTime();
  const noteDateTime = `${note.date} ${note.time}`;

  return currentDateTime >= noteDateTime;
}

function removeExpiredNotes() {
  const notesJSON = localStorage.getItem("notes");
  if (!notesJSON) {
    return;
  }
  const notes = JSON.parse(notesJSON);

  const updatedNotes = [];
  for (let i = 0; i < notes.length; i++) {
    if (!isNoteExpired(notes[i])) {
      updatedNotes.push(notes[i]);
    }
  }

  for (let i = 0; i < updatedNotes.length; i++) {
    updatedNotes[i].index = i;
  }

  localStorage.setItem("notes", JSON.stringify(updatedNotes));
}
function addTask(event) {
  event.preventDefault();
  const data = collectData();
  const newHTML = generateHTML(data);
  renderHTML(newHTML);
  setToLocalStorage(data);
  resetForm();
  console.log(getLocalTime());
}

initStorage();
loadFromLocalStorage();
removeExpiredNotes();
