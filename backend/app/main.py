from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import Base
from .database import engine
from .database import get_db
from .schemas import TicketCreate
from .schemas import TicketUpdate
from .crud import create_ticket
from .crud import get_tickets
from .crud import get_ticket
from .crud import update_ticket

Base.metadata.create_all(bind=engine)

app = FastAPI( title="Support CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

@app.get("/")
def home():
     return {"message": "Support CRM API is running"}

@app.post("/api/tickets")
def create(
    data: TicketCreate, db: Session = Depends(get_db)):

    ticket = create_ticket(db,data)

    return { "ticket_id": ticket.ticket_id,"created_at": ticket.created_at}

@app.get("/api/tickets")
def list_tickets(
    status: str | None = None,search: str | None = None,db: Session = Depends(get_db)):

    return get_tickets(db,status,search)

@app.get("/api/tickets/{ticket_id}")
def details(
    ticket_id: str,db: Session = Depends(get_db)):

    ticket = get_ticket(db,ticket_id )

    if not ticket:
        raise HTTPException(
            status_code=404,detail="Ticket not found")

    return {"ticket_id": ticket.ticket_id, "customer_name":ticket.customer_name,
        "customer_email": ticket.customer_email,
        "subject": ticket.subject,
        "description": ticket.description,
        "status": ticket.status,
        "notes": [ { "note_text": note.note_text, "created_at": note.created_at }
            for note in ticket.notes ]}

@app.put("/api/tickets/{ticket_id}")
def update( ticket_id: str, data: TicketUpdate, db: Session = Depends(get_db)):

    ticket = get_ticket(db,ticket_id )

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket = update_ticket(db, ticket,data)

    return {"success": True,"updated_at": ticket.updated_at}