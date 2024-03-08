import bcrypt
import jwt
import datetime


def hashstr(string):
    hashed_password = bcrypt.hashpw(string.encode('utf-8'), bcrypt.gensalt())
    string_password = hashed_password.decode('utf8')
    return string_password


def verify_str(password, hashed_password):
    print(password)
    print(hashed_password)
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def get_jwt_token(payload, scretkey):
    token = jwt.encode(payload, scretkey, "HS256")
    return token