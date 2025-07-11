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
    row.innerHTML = `
      <td>${event.eventName}</td>
      <td>${event.startDate}</td>
      <td>${event.endDate}</td>
      <td>
        <button onclick="editEvent('${event.id}')">Edit</button>
        <button onclick="deleteEvent('${event.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

addEventBtn.addEventListener("click", () => {
  // Prevent multiple add rows with unique "new-event-row"
  if (document.getElementById("new-event-row")) return;

  const row = document.createElement("tr");
  row.id = "new-event-row";
  row.innerHTML = `
    <td><input type="text" placeholder="Event name" /></td>
    <td><input type="date" /></td>
    <td><input type="date" /></td>
    <td>
      <button onclick="saveNewEvent(this)">Save</button>
      <button onclick="cancelNewEvent()">Cancel</button>
    </td>
  `;
  tableBody.appendChild(row);
})

async function saveNewEvent(btn) {
  const row = btn.closest("tr");
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
  const row = [...tableBody.children].find(row =>
    row.innerHTML.includes(`editEvent('${id}')`)
  );

  const [nameCell, startCell, endCell, actionsCell] = row.children;

  const name = nameCell.textContent;
  const start = startCell.textContent;
  const end = endCell.textContent;

  nameCell.innerHTML = `<input type="text" value="${name}" />`;
  startCell.innerHTML = `<input type="date" value="${start}" />`;
  endCell.innerHTML = `<input type="date" value="${end}" />`;
  actionsCell.innerHTML = `
    <button onclick="saveEvent('${id}', this)">Save</button>
    <button onclick="fetchEvents()">Cancel</button>
  `;
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




