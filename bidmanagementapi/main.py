from fastapi import APIRouter, Body
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
import models
from pydantic import BaseModel, EmailStr
from dbconfig import engine, SessionLocal, session
from tools.tools import (
    hashstr,
    get_jwt_token,
    verify_str,
    decode_jwt_token)
from cheifdata import secretkey, jwtregexs
import datetime
from fastapi.middleware.cors import CORSMiddleware
import re

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


router = APIRouter()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class User(BaseModel):
    email: EmailStr
    password: str
    companyname: str


class Credentials(BaseModel):
    email: EmailStr
    password: str


db_dependency = Depends(get_db)


def add_company(name, db):
    try:
        company = models.Companies(name=name)
        db.add(instance=company)
        db.commit()
        db.refresh(company)
        return {"company_id": company.id}
    except IntegrityError:
        return {"error": True}


@router.post('/register')
def adduser(user: User, db: Session = db_dependency):
    User = session.query(models.Users).filter(
        models.Users.email == user.email).first()
    if User:
        return {"staus_code": 422, "message": "User Already Exists"}
    else:
        company = add_company(user.companyname, db=db)
        Role = session.query(models.Roles).filter(
            models.Roles.name == "admin").first()
        if company.get("company_id") and Role:
            try:
                user = models.Users(email=user.email, password=hashstr(
                    user.password), company_id=company.get("company_id"), role_id=Role.id)
                db.add(instance=user)
                db.commit()
                db.refresh(user)
                return {"status_code": 200, "message": "Add New User Details"}
            except IntegrityError:
                return {"error": True}
        else:
            return {"status_code": 409, "message": "Unkown Error"}


@router.post("/verifyauthenticator")
def verifyauthenticator(token: str = Body(..., embed=True)):
    if re.match(jwtregexs.get("headerpattern") + jwtregexs.get("payloadpattern") + jwtregexs.get("signaturepattern"), token):
        print("ok")
        data = decode_jwt_token(token=token, scretkey=secretkey)
        if data.get("email") and data.get("user_id"):
            print("ok")
    else:
        pass


@router.post("/login")
def loginuser(creds: Credentials):
    User = session.query(models.Users).filter(
        models.Users.email == creds.email).first()
    if User:
        if verify_str(creds.password, User.password):
            token = get_jwt_token({
                "email": User.email,
                "user_id": User.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=3)  # Token expiration time
            }, secretkey)
            return {"status_code": 200, "token": token, "message": "SuccessFully Authorized"}
    return {"status_code": 401, "message": "Unauthorized User"}


app.include_router(router, prefix="/api")
