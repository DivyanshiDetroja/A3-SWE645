from typing import Optional, List
from datetime import date
from sqlmodel import SQLModel, Field, Column, JSON

class SurveyBase(SQLModel):
    first_name: str
    last_name: str
    street_address: str
    city: str
    state: str
    zip: str
    telephone: str
    email: str
    survey_date: date
    liked_most: Optional[List[str]] = []
    interest_source: Optional[str] = None
    recommendation: Optional[str] = None
    raffle: Optional[List[int]] = []
    comments: Optional[str] = None

class Survey(SurveyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # store lists as JSON in DB:
    liked_most: Optional[List[str]] = Field(sa_column=Column(JSON), default=[])
    raffle: Optional[List[int]] = Field(sa_column=Column(JSON), default=[])
