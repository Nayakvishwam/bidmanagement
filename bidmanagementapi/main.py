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
    check_jwt_exp,
    decode_jwt_token)
from chiefdata import secretkey, jwt_regex_pattern, rightsallow
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
    allow_headers=["*"]
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
    '''
    Add New Company
    '''
    try:
        company = models.Companies(name=name)
        db.add(instance=company)
        db.commit()
        db.refresh(company)
        return {"company_id": company.id}
    except IntegrityError:
        return {"error": True}


def getroleofuserdetails(id):
    '''
    User For Get User Role
    '''
    Role = session.query(models.Roles).filter(
        models.Roles.id == id).first()
    return Role


@router.post('/register')
def adduser(user: User, db: Session = db_dependency):
    '''
    /register:- User For Register Purpose
    '''
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
    '''
    /verifyauthenticator:-Check Authenticator By Jwt Token Valid Or Not
    '''
    try:
        if re.match(jwt_regex_pattern, token):
            data = decode_jwt_token(token=token, scretkey=secretkey)
            if data.get("exp") and data.get("email") and data.get("user_id"):
                if check_jwt_exp(data.get("exp")):
                    User = session.query(models.Users).filter(
                        models.Users.email == data.get("email"),
                        models.Users.id == data.get("user_id")).first()
                    if User:
                        RoleDetails = getroleofuserdetails(User.role_id)
                        userdata = {
                            "userid": User.id,
                            "email": User.email,
                            "role": RoleDetails.name,
                            "company_id": User.company_id,
                            "token": token
                        }
                        return {"status_code": 200, "data": userdata, "message": "Validate Authenticator"}
        return {"status_code": 400, "message": "Invalid Payload"}
    except Exception as err:
        print(err)
        return {"status_code": 409, "message": "Unkown Error"}


def checkaccess_rights(token, path):
    '''
    Check Access Rights By Jwt Token
    '''
    authentication = verifyauthenticator(token=token)
    getrole = authentication.get("data").get("role")
    if authentication.get("status_code") == 200 and rightsallow.get(getrole):
        checkaccess = rightsallow.get(getrole)["paths"]
        if checkaccess.count(path) > 0:
            return {"allow": True}
        else:
            return {"status_code": 403, "message": "User does not have rights", "allow": False}
    return authentication


@router.post("/login")
def loginuser(creds: Credentials):
    '''
    /login :- Used For User Login Purpose
    '''
    User = session.query(models.Users).filter(
        models.Users.email == creds.email).first()
    if User:
        if verify_str(creds.password, User.password):
            token = get_jwt_token({
                "email": User.email,
                "user_id": User.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=3)  # Token expiration time
            }, secretkey)
            userdata = {
                "userid": User.id,
                "email": User.email,
                "roleid": User.role_id,
                "company_id": User.company_id,
                "token": token
            }
            return {"status_code": 200, "data": userdata, "message": "SuccessFully Authorized"}
    return {"status_code": 401, "message": "Unauthorized User"}


@router.post("/additem")
async def additem(token: str = Body(..., embed=True),
                  name: str = Body(..., embed=True),
                  db: Session = db_dependency):
    '''
    /additem - User To Add New Item
    '''
    authentication = checkaccess_rights(token=token, path="/api/additem")
    if authentication.get("allow"):
        try:
            Item = session.query(models.Items).filter(
                models.Items.name == name).first()
            if Item:
                return {"status_code": 400, "message": "Item Already Exists"}
            item = models.Items(name=name)
            db.add(instance=item)
            db.commit()
            db.refresh(item)
            return {"status_code": 200, "message": "Add New Item Details"}
        except IntegrityError as err:
            return {"statuc_code": 409, "message": str(err)}
    return authentication


@router.put("/edititem")
async def additem(token: str = Body(..., embed=True),
                  name: str = Body(..., embed=True),
                  itemid: int = Body(..., embed=True),
                  db: Session = db_dependency):
    '''
    /edititem - User Edit Item
    '''
    authentication = checkaccess_rights(token=token, path="/api/edititem")
    if authentication.get("allow"):
        try:
            Item = session.query(models.Items).filter_by(id=itemid).first()
            if Item:
                Item.name = name
                session.commit()
                session.close()
                return {"status_code": 200, "message": "Edit Item Details"}
            else:
                return {"status_code": 404, "message": "Item Not Exists"}
        except IntegrityError as err:
            return {"statuc_code": 409, "message": str(err)}
    return authentication


@router.delete("/deleteitems")
async def deleteitems(token: str = Body(..., embed=True),
                      ids: list = Body(..., embed=True),
                      db: Session = db_dependency):
    '''
    /deleteitems- Used To Remove Delete Items
    '''
    authentication = checkaccess_rights(token=token, path="/api/deleteitems")
    if authentication.get("allow"):
        try:
            items = db.query(models.Items).filter(
                models.Items.id.in_(ids)).all()
            if items:
                for item in items:
                    db.delete(instance=item)
                db.commit()
                db.close()
                return {"status_code": 200, "message": "Delete Items Details"}
            else:
                return {"status_code": 404, "message": "Item Not Exists"}
        except IntegrityError as err:
            return {"statuc_code": 409, "message": str(err)}
    return authentication


@router.post("/items")
async def getItems(token: str = Body(..., embed=True), db: Session = db_dependency):
    '''
    /items- Used To Get Items
    '''
    authentication = checkaccess_rights(token=token, path="/api/items")
    if authentication.get("allow"):
        data = db.query(models.Items).all()
        return {"status_code": 200, "data": data, "message": "Items Details"}
    return authentication


def addauctionlineitem(**kwargs):
    kwargs = kwargs.get("data")
    try:
        auctionlineitem = models.AuctionsLinesItems(
            auction_id=kwargs.get("auction_id"),
            item_id=kwargs.get("item_id"),
            quantity=kwargs.get("quantity")
        )
        db = kwargs.get("db")
        db.add(instance=auctionlineitem)
        db.commit()
        db.refresh(auctionlineitem)
        return True
    except Exception as err:
        print(err)
        return False


@router.post("/addauction")
async def additem(token: str = Body(..., embed=True),
                  item_id: int = Body(..., embed=True),
                  company_id: int = Body(..., embed=True),
                  quantity: int = Body(..., embed=True),
                  description: str = Body(..., embed=True),
                  db: Session = db_dependency):
    '''
    /addauction - User To Add Auction
    '''
    authentication = checkaccess_rights(token=token, path="/api/addauction")
    if authentication.get("allow"):
        try:
            Item = session.query(models.Items).filter(
                models.Items.id == item_id).first()
            if Item:
                Company = session.query(models.Companies).filter(
                    models.Companies.id == company_id).first()
                if Company:
                    auction = models.Auctions(
                        description=description, company_id=company_id)
                    db.add(instance=auction)
                    db.commit()
                    db.refresh(auction)
                    if auction:
                        auctionlineitem = addauctionlineitem(data={
                            "auction_id": auction.id,
                            "item_id": item_id,
                            "quantity": quantity,
                            "db": db
                        })
                        if auctionlineitem:
                            return {"status_code": 200, "message": "Add New Auction Details"}
                    return {"statuc_code": 409, "message": "Known Error"}
                else:
                    return {"status_code": 404, "message": "Company is Not Exists"}
            else:

                return {"status_code": 404, "message": "Item IS Not Exists"}
        except IntegrityError as err:
            return {"statuc_code": 409, "message": str(err)}
    return authentication


@router.post("/getauctions")
async def getautctions(token: str = Body(..., embed=True), db: Session = db_dependency):
    '''
    /getautctions- Used To Get Auctions
    '''
    authentication = checkaccess_rights(token=token, path="/api/getauctions")
    if authentication.get("allow"):
        maindata = []
        data = db.query(models.Companies, models.Auctions, models.AuctionsLinesItems, models. Items).\
            join(models.Auctions, models.Companies.id == models.Auctions.company_id).\
            join(models.AuctionsLinesItems, models.Auctions.id == models.AuctionsLinesItems.auction_id).\
            join(models.Items, models.AuctionsLinesItems.item_id == models.Items.id).\
            data = data.all()
        for company, auction in data:
            info = {
                "id": auction.id,
                "description": auction.description,
                "companyname": company.name,
                "companyid": company.id
            }
            maindata.append(info)
        return {"status_code": 200, "data": maindata, "message": "Auctions Details"}
    return authentication

app.include_router(router, prefix="/api")
