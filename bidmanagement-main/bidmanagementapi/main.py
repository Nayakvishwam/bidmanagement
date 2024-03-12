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
    decode_jwt_token,
    changecasestr)
from chiefdata import secretkey, jwt_regex_pattern, rightsallow
import datetime
from fastapi.middleware.cors import CORSMiddleware
import re
from sqlalchemy import func
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
def register(user: User, db: Session = db_dependency):
    '''
    /register:- User For Register Purpose
    '''
    email = changecasestr(user.email, "lower", True)
    User = session.query(models.Users).filter(
        func.lower(models.Users.email) == email).first()
    if User:
        return {"status_code": 409, "message": "User already exists"}
    else:
        company = add_company(user.companyname, db=db)
        Role = session.query(models.Roles).filter(
            models.Roles.name == "admin").first()
        if company.get("company_id") and Role:
            try:
                user = models.Users(email=user.email, password=hashstr(
                    user.password), company_id=company.get("company_id"),
                    role_id=Role.id)
                db.add(instance=user)
                db.commit()
                db.refresh(user)
                return {"status_code": 200, "message": "User registered"}
            except IntegrityError:
                return {"status_code": 500, "message": "Internal Server Error"}
        else:
            return {"status_code": 500, "message": "Internal Server Error"}


# @router.post("/verifyauthenticator")
# def verifyauthenticator(token: str = Body(..., embed=True)):
#     '''
#     /verifyauthenticator:-Check Authenticator By Jwt Token Valid Or Not
#     '''
#     try:
#         if re.match(jwt_regex_pattern, token):
#             data = decode_jwt_token(token=token, secretkey=secretkey)
#             if data.get("exp") and data.get("email") and data.get("user_id"):
#                 if check_jwt_exp(data.get("exp")):
#                     User = session.query(models.Users).filter(
#                         models.Users.email == data.get("email"),
#                         models.Users.id == data.get("user_id")).first()
#                     if User:
#                         RoleDetails = getroleofuserdetails(User.role_id)
#                         userdata = {
#                             "email": User.email,
#                             "role": RoleDetails.name,
#                             "token": token
#                         }
#                         return {"status_code": 200, "data": userdata, "message": ""}
#         return {"status_code": 400, "message": ""}
#     except Exception as err:
#         return {"status_code": 500, "message": ""}

def companyidbyuserid(id):
    user = session.query(models.Users).filter(
        models.Users.id == id).first()
    return user.id


def verifytoken(token):
    '''
    Check Access Rights By Jwt Token
    '''
    try:
        if re.match(jwt_regex_pattern, token):
            data = decode_jwt_token(token=token, secretkey=secretkey)
            if data.get("exp") and data.get("email") and data.get("user_id"):
                if check_jwt_exp(data.get("exp")):
                    User = session.query(models.Users).filter(
                        models.Users.email == data.get("email"),
                        models.Users.id == data.get("user_id")).first()
                    if User:
                        RoleDetails = getroleofuserdetails(User.role_id)
                        userdata = {
                            "email": User.email,
                            "role": RoleDetails.name,
                            "token": token,
                            "userid": User.id
                        }
                        # getrole = userdata.get("role")
                        # if rightsallow.get(getrole):
                        #     checkaccess = rightsallow.get(getrole)["paths"]
                        # if checkaccess.count(path) > 0:
                        return {"allow": True, "data": userdata}
                        # else:
                        # return {"statu_code": 403, "allow": False}
        return {"status_code": 403, "allow": False}
    except Exception as err:
        return {"status_code": 403, "allow": False}


@router.post("/login")
def login(creds: Credentials):
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
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=3)
            }, secretkey)
            role = getroleofuserdetails(User.role_id)
            userdata = {
                "rolename": role.name,
                "token": token
            }
            return {"status_code": 200, "data": userdata, "message": ""}
    return {"status_code": 401, "message": "Invalid email or password"}


@router.post("/additem")
async def additem(token: str = Body(..., embed=True),
                  name: str = Body(..., embed=True),
                  db: Session = db_dependency):
    '''
    /additem - User To Add New Item
    '''
    authentication = verifytoken(token=token)
    if authentication.get("allow"):
        try:
            name = changecasestr(name, "lower", True)
            Item = session.query(models.Items).filter(
                func.lower(models.Items.name) == name).first()
            if Item:
                return {"status_code": 409, "message": "Item already exists"}
            item = models.Items(name=name)
            db.add(instance=item)
            db.commit()
            db.refresh(item)
            return {"status_code": 200, "message": "Item add successfully"}
        except IntegrityError as err:
            return {"status_code": 500, "message": str(err)}
    return authentication


@router.put("/edititem")
async def edititem(token: str = Body(..., embed=True),
                   name: str = Body(..., embed=True),
                   itemid: int = Body(..., embed=True)):
    '''
    /edititem - User Edit Item
    '''
    authentication = verifytoken(token=token)
    if authentication.get("allow"):
        try:
            Item = session.query(models.Items).filter_by(id=itemid).first()
            if Item:
                name = changecasestr(name, "lower", True)
                ExistItem = session.query(models.Items).filter(
                    func.lower(models.Items.name) == name, models.Items.id != itemid).first()
                if ExistItem:
                    return {"status_code": 409, "message": "Item already exists"}
                Item.name = name
                session.commit()
                session.close()
                return {"status_code": 200, "message": "Change item details successfully"}
            else:
                return {"status_code": 204, "message": "Item not exists"}
        except IntegrityError as err:
            return {"status_code": 500, "message": str(err)}
    return authentication


@router.delete("/deleteitems")
async def deleteitems(token: str = Body(..., embed=True),
                      ids: list = Body(..., embed=True),
                      db: Session = db_dependency):
    '''
    /deleteitems- Used To Remove Delete Items
    '''
    authentication = verifytoken(token=token)
    if authentication.get("allow"):
        try:
            items = db.query(models.Items).filter(
                models.Items.id.in_(ids)).all()
            if items:
                for item in items:
                    db.delete(instance=item)
                db.commit()
                db.close()
                return {"status_code": 200, "message": "Delete items successfully"}
            else:
                return {"status_code": 204, "message": "Items does not exists"}
        except IntegrityError as err:
            return {"status_code": 500, "message": str(err)}
    return authentication


@router.post("/items")
async def getItems(token: str = Body(..., embed=True), db: Session = db_dependency):
    '''
    /items- Used To Get Items
    '''
    authentication = verifytoken(token=token)
    if authentication.get("allow"):
        data = db.query(models.Items).all()
        return {"status_code": 200, "data": data, "message": ""}
    return authentication


def addAunctionLines(lines, id):
    db = SessionLocal()
    try:
        for line in lines:
            auctionline = models.AuctionsLinesItems(
                **{
                    "item_id": line.get("item_id"),
                    "quantity": line.get("quantity"),
                    "auction_id": id
                }
            )
            db.add(auctionline)
        db.commit()
    except IntegrityError:
        db.rollback()
        return False
    finally:
        db.close()
    return True


@router.post("/addauction")
async def addauction(token: str = Body(..., embed=True),
                     description: str = Body(..., embed=True),
                     auctions_lines: list = Body(..., embed=True),
                     db: Session = db_dependency):
    '''
    /addauction - User To Add Auction
    '''
    authentication = verifytoken(token=token)
    if authentication.get("allow"):
        company_id = companyidbyuserid(
            authentication.get("data").get("userid"))
        try:
            Company = session.query(models.Companies).filter(
                models.Companies.id == company_id).first()
            if Company:
                auction = models.Auctions(
                    description=description, company_id=company_id)
                db.add(instance=auction)
                db.commit()
                db.refresh(auction)
                if auction:
                    auctionlineitem = addAunctionLines(
                        auctions_lines, auction.id)
                    if auctionlineitem:
                        return {"status_code": 200, "message": "Add auction details successfully"}
                return {"status_code": 500, "message": "Internal Server Error"}
            else:
                return {"status_code": 204, "message": "Company is not exists"}

        except IntegrityError as err:
            return {"status_code": 500, "message": str(err)}
    return authentication


@router.post("/getauctions")
async def getauctions(token: str = Body(..., embed=True), db: Session = db_dependency):
    '''
    /getauctions- Used To Get Auctions
    '''
    authentication = verifytoken(token=token)
    if authentication.get("allow"):
        companyid = companyidbyuserid(authentication.get("data").get("userid"))
        maindata = []
        data = db.query(models.Companies, models.Auctions, models.AuctionsLinesItems, models. Items).\
            join(models.Auctions, models.Companies.id == models.Auctions.company_id).\
            join(models.AuctionsLinesItems, models.Auctions.id == models.AuctionsLinesItems.auction_id).\
            join(models.Items, models.AuctionsLinesItems.item_id == models.Items.id)
        data = data.filter(models.Companies.id == companyid)
        for company, auction, auction_line, item in data:
            info = {
                "id": auction.id,
                "description": auction.description,
                "companyname": company.name,
                "companyid": company.id,
                "itemname": item.name,
                "quantity": auction_line.quantity,
                "itemid": item.id
            }
            maindata.append(info)
        return {"status_code": 200, "data": maindata, "message": ""}
    return authentication

app.include_router(router, prefix="/api")
