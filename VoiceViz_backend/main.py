from datetime import datetime, timedelta

import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer ,OAuth2PasswordRequestForm
from passlib.context import CryptContext
from database import Query_History, SessionLocal, User
from pydantic import BaseModel
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import dns.resolver
from typing import List

app = FastAPI()

########################################################################################################################################################
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"]  
)

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

# Request schema to receive executed query
class QueryRequest(BaseModel):
    query_exe: str

# Response schema to return history
class QueryResponse(BaseModel):
    query_id: int
    query_exe: str
    timestamp: datetime



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



# Utility to get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.get("/favicon.ico")
async def favicon():
    return FileResponse(os.path.join("", "my_icon.jpeg"))

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/signup/")
async def signup(form_data : SignUpRequest , db:Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == form_data.email).first()

    
    
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
    
    access_token = create_access_token(data = {"sub": user.email},expires_delta=timedelta(minutes= ACCESS_TOKEN_EXP_MIN))
    return {"access_token":access_token ,"token_type":"bearer","username":user.username  }

@app.get("/users/me")
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
    
    return {"id": user.user_id,"email": user.email,"username":user.username}



@app.get("/query-history/", response_model=List[QueryResponse])
def get_query_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history = db.query(Query_History).filter(Query_History.user_id == current_user.user_id).all()
    return [
        QueryResponse(
            query_id=q.query_id,
            query_exe=q.query_exe,
            timestamp=q.timestamp,
        )
        for q in history
    ]