from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, schemas

router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TicketResponse)
def create_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db)):
    return crud.create_ticket(db, ticket)

@router.get("/", response_model=list[schemas.TicketResponse])
def get_tickets(
    db: Session = Depends(get_db)):
    return crud.get_tickets(db)

@router.get(
    "/{ticket_id}",
    response_model=schemas.TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = crud.get_ticket(db, ticket_id)

    if ticket is None:
        raise HTTPException( status_code=404, detail="Ticket not found")

    return ticket

@router.put(
    "/{ticket_id}",
    response_model=schemas.TicketResponse)
def update_ticket(ticket_id: int,ticket: schemas.TicketUpdate,
    db: Session = Depends(get_db)):
    updated_ticket = crud.update_ticket(db,ticket_id,ticket)

    if updated_ticket is None:
        raise HTTPException( status_code=404,detail="Ticket not found" )

    return updated_ticket