const API_URL = "http://localhost:3000/events";
const tableBody = document.querySelector(".event-list__tbody");
const addEventBtn = document.querySelector(".add-event-btn");

async function fetchEvents() {
  const events = await fetch(API_URL).then((res) => res.json());
  renderEvents(events);
}

function renderEvents(events) {
  tableBody.innerHTML = "";
  events.forEach((event) => {
    const row = document.createElement("tr");
    row.id = event.id;
    // row.innerHTML = `
    //   <td>${event.eventName}</td>
    //   <td>${event.startDate}</td>
    //   <td>${event.endDate}</td>
    //   <td>
    //     <button onclick="editEvent('${event.id}', this)">Edit</button>
    //     <button onclick="deleteEvent('${event.id}')">Delete</button>
    //   </td>
    // `;
    
    const nameCell = document.createElement("td");
    nameCell.textContent = event.eventName;
    const startCell = document.createElement("td");
    startCell.textContent = event.startDate;
    const endCell = document.createElement("td");
    endCell.textContent = event.endDate;
    const actionsCell = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editEvent(event.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteEvent(event.id));

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
    
    row.appendChild(nameCell);
    row.appendChild(startCell);
    row.appendChild(endCell);
    row.appendChild(actionsCell);
    tableBody.appendChild(row);
  });
}

addEventBtn.addEventListener("click", () => {
  // Prevent multiple add rows with unique "new-event-row"
  if (document.getElementById("new-event-row")) return;

  const row = document.createElement("tr");
  row.id = "new-event-row";
  // row.innerHTML = `
  //   <td><input type="text" placeholder="Event name" /></td>
  //   <td><input type="date" /></td>
  //   <td><input type="date" /></td>
  //   <td>
  //     <button onclick="saveNewEvent(this)">Save</button>
  //     <button onclick="cancelNewEvent()">Cancel</button>
  //   </td>
  // `;
  
  const nameCell = document.createElement("td");
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Event name";
  nameCell.appendChild(nameInput);

  const startCell = document.createElement("td");
  const startInput = document.createElement("input");
  startInput.type = "date";
  startCell.appendChild(startInput);

  const endCell = document.createElement("td");
  const endInput = document.createElement("input");
  endInput.type = "date";
  endCell.appendChild(endInput);

  const actionsCell = document.createElement("td");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => saveNewEvent(saveBtn));
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", cancelNewEvent);
  actionsCell.appendChild(saveBtn);
  actionsCell.appendChild(cancelBtn);

  row.appendChild(nameCell);
  row.appendChild(startCell);
  row.appendChild(endCell);
  row.appendChild(actionsCell);
  tableBody.appendChild(row);
})

async function saveNewEvent(btn) {
  const row = btn.closest("tr");  // closest <tr> ancestor Node
  const inputs = row.querySelectorAll("input");

  const newEvent = {
    eventName: inputs[0].value,
    startDate: inputs[1].value,
    endDate: inputs[2].value,
  };

  // Validate
  if (!newEvent.eventName || !newEvent.startDate || !newEvent.endDate) {
    alert("Please fill out all fields");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),
  });

  fetchEvents();
}

function cancelNewEvent() {
  const row = document.getElementById("new-event-row");
  if (row) row.remove();
}

async function deleteEvent(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchEvents();
}

async function editEvent(id) {
  const row = document.getElementById(id);
  if (!row) return;
  const [nameCell, startCell, endCell, actionsCell] = row.children;
  // nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}" />`;
  // startCell.innerHTML = `<input type="date" value="${startCell.textContent}" />`;
  // endCell.innerHTML = `<input type="date" value="${endCell.textContent}" />`;
  // actionsCell.innerHTML = `
  //   <button onclick="saveEvent('${id}', this)">Save</button>
  //   <button onclick="fetchEvents()">Cancel</button>
  // `;
  
  const nameValue = nameCell.textContent.trim();
  const startValue = startCell.textContent.trim();
  const endValue = endCell.textContent.trim();
  
  nameCell.textContent = "";
  startCell.textContent = "";
  endCell.textContent = "";
  actionsCell.textContent = "";
  
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = nameValue;
  nameCell.appendChild(nameInput);

  const startInput = document.createElement("input");
  startInput.type = "date";
  startInput.value = startValue;
  startCell.appendChild(startInput);

  const endInput = document.createElement("input");
  endInput.type = "date";
  endInput.value = endValue;
  endCell.appendChild(endInput);
  
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => saveEvent(id, saveBtn));
  
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", fetchEvents);
  
  actionsCell.appendChild(saveBtn);
  actionsCell.appendChild(cancelBtn);
}

async function saveEvent(id, btn) {
  const row = btn.closest("tr");
  const [nameCell, startCell, endCell] = row.children;

  const updatedEvent = {
    eventName: nameCell.querySelector("input").value,
    startDate: startCell.querySelector("input").value,
    endDate: endCell.querySelector("input").value,
  };

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEvent),
  });

  fetchEvents();
}

// Initial load
fetchEvents();




