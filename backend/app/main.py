from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from contextlib import asynccontextmanager
from sqlmodel import Session
from .database import create_db_and_tables, get_session
from .models import Survey, SurveyBase
from .crud import create_survey, list_surveys, get_survey, update_survey, delete_survey
from datetime import date
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown (if needed)

app = FastAPI(title="Student Survey API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/surveys/", response_model=Survey, status_code=201)
def create_survey_endpoint(s: Survey, session: Session = Depends(get_session)):
    # validate required fields (SQLModel + Pydantic do most of it)
    # raffle number validation
    if s.raffle:
        if len(s.raffle) < 10:
            raise HTTPException(status_code=400, detail="raffle requires at least 10 numbers")
        for n in s.raffle:
            if not (1 <= n <= 100):
                raise HTTPException(status_code=400, detail="raffle numbers must be 1-100")
    created = create_survey(session, s)
    return created

@app.get("/surveys/", response_model=List[Survey])
def list_surveys_endpoint(session: Session = Depends(get_session)):
    try:
        surveys = list_surveys(session)
        return surveys
    except Exception as e:
        print(f"Error listing surveys: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/surveys/{survey_id}", response_model=Survey)
def get_survey_endpoint(survey_id: int, session: Session = Depends(get_session)):
    s = get_survey(session, survey_id)
    if not s:
        raise HTTPException(status_code=404, detail="Survey not found")
    return s

@app.put("/surveys/{survey_id}", response_model=Survey)
def update_survey_endpoint(survey_id: int, data: Survey, session: Session = Depends(get_session)):
    updated = update_survey(session, survey_id, data.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Survey not found")
    return updated

@app.delete("/surveys/{survey_id}", status_code=204)
def delete_survey_endpoint(survey_id: int, session: Session = Depends(get_session)):
    ok = delete_survey(session, survey_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Survey not found")
    return None

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
