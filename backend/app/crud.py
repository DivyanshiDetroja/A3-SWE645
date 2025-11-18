from sqlmodel import Session, select
from .models import Survey
from typing import List
from datetime import date

def create_survey(session: Session, survey: Survey) -> Survey:
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey

def get_survey(session: Session, survey_id: int) -> Survey | None:
    return session.get(Survey, survey_id)

def list_surveys(session: Session, limit: int = 100) -> List[Survey]:
    return session.exec(select(Survey).limit(limit)).all()

def update_survey(session: Session, survey_id: int, data: dict) -> Survey | None:
    survey = session.get(Survey, survey_id)
    if not survey:
        return None
    for k, v in data.items():
        setattr(survey, k, v)
    session.add(survey)
    session.commit()
    session.refresh(survey)
    return survey

def delete_survey(session: Session, survey_id: int) -> bool:
    survey = session.get(Survey, survey_id)
    if not survey:
        return False
    session.delete(survey)
    session.commit()
    return True
