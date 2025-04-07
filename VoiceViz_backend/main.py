from datetime import datetime, timedelta
from http.client import HTTPException
import os
from fastapi import FastAPI, Depends
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer ,OAuth2PasswordRequestForm
from passlib.context import CryptContext
from database import Query_History, SessionLocal, User
from pydantic import BaseModel
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import dns.resolver

app = FastAPI()
########################################################################################################################################################

########################################################################################################################################################

SECRET_KEY = "HackToFuture"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXP_MIN = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

pwd_context = CryptContext(schemes=['bcrypt'],deprecated ="auto")

class SignUpRequest(BaseModel):
    email: str
    user_name: str
    password: str


def hash_password(password:str):
    return pwd_context.hash(password)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password:str,hashed_password:str):
    return pwd_context.verify(plain_password,hashed_password)

def create_access_token(data:dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow()+expires_delta
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode,SECRET_KEY, algorithm=ALGORITHM)

def domain_has_mx_record(email: str) -> bool:
    domain = email.split("@")[1]
    try:
        dns.resolver.resolve(domain, 'MX')
        return True
    except:
        return False

@app.get("/favicon.ico")
async def favicon():
    return FileResponse(os.path.join("", "my_icon.jpeg"))

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/signup/")
async def signup(form_data : SignUpRequest , db:Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == form_data.email).first()

    if not domain_has_mx_record(form_data.email):
        raise HTTPException(status_code=400, detail="Invalid email domain (cannot receive emails)")
    
    if existing_user:
        raise HTTPException(status_code=400, detail= "Email already registred")

    hashed_password = hash_password(form_data.password)

    new_user = User(email = form_data.email, username = form_data.user_name,password = hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "email": form_data.email}

@app.post("/login/")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password,user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    acess_token = create_access_token(data = {"sub": user.email},expires_delta=timedelta(minutes= ACCESS_TOKEN_EXP_MIN))
    return {"access_token":acess_token ,"token_type":"bearer","username":user.username  }

@app.post("/users/me")
async def get_current_user_info(token: str = Depends(oauth2_scheme), db:Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
    except JWTError:
        raise HTTPException(status_code=401, detail= "Invalid Token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401 , detail="User not Exist")
    
    return user.id


