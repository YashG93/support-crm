import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  async function loadAllTickets() {
    try {
      const response = await fetch(`${API}/api/tickets`);
      if (!response.ok) throw new Error("Could not load tickets");

      setAllTickets(await response.json());
    } catch (error) {
      console.log(error);
    }
  }

  async function loadTickets() {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const url = `${API}/api/tickets${
        params.toString() ? `?${params}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not load tickets");

      setTickets(await response.json());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadAllTickets();
  }, []);

  useEffect(() => {
    loadTickets();
  }, [search, status]);

  async function createTicket(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("Could not create ticket");
        return;
      }

      setForm({
        customer_name: "",
        customer_email: "",
        subject: "",
        description: "",
      });

      setShowCreate(false);

      await loadAllTickets();
      await loadTickets();
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  }

  async function openTicket(ticketId) {
    try {
      const response = await fetch(`${API}/api/tickets/${ticketId}`);

      if (!response.ok) {
        alert("Ticket not found");
        return;
      }

      setSelected(await response.json());
    } catch (error) {
      console.log(error);
    }
  }

  async function updateTicket() {
    try {
      const response = await fetch(
        `${API}/api/tickets/${selected.ticket_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: selected.status,
            notes: selected.newNote || "",
          }),
        }
      );

      if (!response.ok) {
        alert("Could not update ticket");
        return;
      }

      setSelected(null);

      await loadAllTickets();
      await loadTickets();
    } catch (error) {
      console.log(error);
    }
  }

  function goTo(pageName) {
    setPage(pageName);
    setSelected(null);
    setMobileMenu(false);
  }

  const total = allTickets.length;
  const open = allTickets.filter((t) => t.status === "Open").length;
  const progress = allTickets.filter(
    (t) => t.status === "In Progress"
  ).length;
  const closed = allTickets.filter(
    (t) => t.status === "Closed"
  ).length;

  const clientsMap = new Map();

  allTickets.forEach((ticket) => {
    const key = ticket.customer_email || ticket.customer_name;

    if (!clientsMap.has(key)) {
      clientsMap.set(key, {
        name: ticket.customer_name,
        email: ticket.customer_email,
      });
    }
  });

  const clients = Array.from(clientsMap.values());

  return (
    <div className="app">
      <header className="mobile-header">
        <button
          className="menu-button"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </button>

        <strong>Support CRM</strong>
      </header>

      {mobileMenu && (
        <div
          className="menu-backdrop"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside
        className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}
      >
        <div className="sidebar-title">
          <h2>Support CRM</h2>

          <button
            className="close-menu"
            onClick={() => setMobileMenu(false)}
          >
            ×
          </button>
        </div>

        {[
          ["home", "Home"],
          ["tickets", "Tickets"],
          ["clients", "Clients"],
          ["settings", "Settings"],
        ].map(([name, label]) => (
          <button
            key={name}
            className={page === name ? "active" : ""}
            onClick={() => goTo(name)}
          >
            {label}
          </button>
        ))}
      </aside>

      <main className="main">
        {page === "home" && (
          <section>
            <h1>Dashboard</h1>
            <p className="subtitle">Ticket overview</p>

            <div className="stats">
              {[
                ["Total Tickets", total, ""],
                ["Open", open, "Open"],
                ["In Progress", progress, "In Progress"],
                ["Closed", closed, "Closed"],
              ].map(([label, count, filter]) => (
                <button
                  key={label}
                  className="stat"
                  onClick={() => {
                    setSearch("");
                    setStatus(filter);
                    goTo("tickets");
                  }}
                >
                  <span>{label}</span>
                  <strong>{count}</strong>
                </button>
              ))}
            </div>

            <div className="home-buttons">
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  goTo("tickets");
                }}
              >
                View All Tickets
              </button>

              <button onClick={() => goTo("clients")}>
                View All Clients
              </button>
            </div>
          </section>
        )}

        {page === "tickets" && !selected && (
          <section>
            <div className="page-header">
              <div>
                <button
                  className="back"
                  onClick={() => goTo("home")}
                >
                  ← Back
                </button>

                <h1>Tickets</h1>
              </div>

              <button
                className="primary"
                onClick={() => setShowCreate(true)}
              >
                + Create Ticket
              </button>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="tickets">
              {tickets.length === 0 ? (
                <div className="empty">No tickets found.</div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    className="ticket"
                    key={ticket.ticket_id}
                    onClick={() => openTicket(ticket.ticket_id)}
                  >
                    <div>
                      <strong>{ticket.ticket_id}</strong>
                      <h3>{ticket.subject}</h3>
                      <p>{ticket.customer_name}</p>
                    </div>

                    <span className="badge">
                      {ticket.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {page === "tickets" && selected && (
          <section>
            <button
              className="back"
              onClick={() => setSelected(null)}
            >
              ← Back to Tickets
            </button>

            <div className="details">
              <h1>{selected.ticket_id}</h1>
              <p className="subtitle">Ticket details</p>

              {[
                ["Customer", selected.customer_name],
                ["Email", selected.customer_email],
                ["Subject", selected.subject],
              ].map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}

              <div className="description">
                <strong>Description</strong>
                <p>{selected.description}</p>
              </div>

              <div className="detail-row">
                <strong>Status</strong>

                <select
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">
                    In Progress
                  </option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <h2>Notes</h2>

              <div className="notes">
                {selected.notes.length === 0 ? (
                  <p>No notes yet.</p>
                ) : (
                  selected.notes.map((note, index) => (
                    <div className="note" key={index}>
                      <p>{note.note_text}</p>
                      <small>
                        {new Date(
                          note.created_at
                        ).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>

              <textarea
                placeholder="Add a note..."
                value={selected.newNote || ""}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    newNote: e.target.value,
                  })
                }
              />

              <button
                className="primary update"
                onClick={updateTicket}
              >
                Update Ticket
              </button>
            </div>
          </section>
        )}

        {page === "clients" && (
          <section>
            <button
              className="back"
              onClick={() => goTo("home")}
            >
              ← Back
            </button>

            <h1>Clients</h1>
            <p className="subtitle">All clients in the system</p>
            <p className="client-count">{clients.length} clients</p>

            <div className="clients">
              {clients.length === 0 ? (
                <div className="empty">No clients found.</div>
              ) : (
                clients.map((client, index) => (
                  <div
                    className="client"
                    key={client.email || index}
                  >
                    <strong>{client.name}</strong>
                    <p>{client.email}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {page === "settings" && (
          <section>
            <button
              className="back"
              onClick={() => goTo("home")}
            >
              ← Back
            </button>

            <h1>Settings</h1>

            <div className="settings">
              <p>Support CRM</p>
              <p>Version 1.0</p>
            </div>
          </section>
        )}
      </main>

      {showCreate && (
        <div className="modal-bg">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Ticket</h2>

              <button
                onClick={() => setShowCreate(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={createTicket}>
              <label>Customer Name</label>
              <input
                required
                value={form.customer_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customer_name: e.target.value,
                  })
                }
              />

              <label>Customer Email</label>
              <input
                required
                type="email"
                value={form.customer_email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customer_email: e.target.value,
                  })
                }
              />

              <label>Subject</label>
              <input
                required
                value={form.subject}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subject: e.target.value,
                  })
                }
              />

              <label>Description</label>
              <textarea
                required
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />

              <button className="primary full" type="submit">
                Create Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;