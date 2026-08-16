from datetime import datetime
from sqlalchemy.orm import Session
from .models import Ticket
from .models import Note

def create_ticket(db: Session, data):
    last_ticket = (
        db.query(Ticket)
        .order_by(Ticket.id.desc())
        .first())

    if last_ticket:
        number = last_ticket.id + 1
    else:
        number = 1

    ticket = Ticket(
        ticket_id=f"TKT-{number:03d}",
        customer_name=data.customer_name,
        customer_email=data.customer_email,
        subject=data.subject,
        description=data.description,
        status="Open",
        created_at=datetime.now(),
        updated_at=datetime.now())

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket

def get_tickets(db: Session,status=None,search=None):

    tickets = db.query(Ticket).all()
    result = []

    for ticket in tickets:
        if status and ticket.status != status:
            continue

        if search:
            text = (
                ticket.ticket_id
                + ticket.customer_name
                + ticket.customer_email
                + ticket.description ).lower()

            if search.lower() not in text:
                continue
        result.append({
            "ticket_id": ticket.ticket_id,
            "customer_name": ticket.customer_name,
            "subject": ticket.subject,
            "status": ticket.status,
            "created_at": ticket.created_at})

    return result

def get_ticket( db: Session, ticket_id):

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.ticket_id == ticket_id
        )
        .first() )
    return ticket

def update_ticket(db: Session,ticket,data):

    ticket.status = data.status
    if data.notes:
        note = Note(
            ticket_id=ticket.id, note_text=data.notes,
            created_at=datetime.now())
        db.add(note)

    ticket.updated_at = datetime.now()

    db.commit()
    db.refresh(ticket)

    return ticket