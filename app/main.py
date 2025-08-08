import io
from fastapi import FastAPI, Request, Form, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import qrcode
from qrcode.constants import ERROR_CORRECT_L

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/generate")
async def generate_qr(
    request: Request,
    qr_type: str = Form(...),
    content: str = Form(None),
    iban: str = Form(None),
    beneficiary: str = Form(None),
    amount: str = Form(None),
    reference: str = Form(None),
    email: str = Form(None),
    subject: str = Form(None),
    body: str = Form(None),
    phone: str = Form(None),
    message: str = Form(None),
    ssid: str = Form(None),
    password: str = Form(None),
    security: str = Form(None)
):
    # Construct QR code content based on type
    qr_content = ""
    
    if qr_type == "text":
        qr_content = content
    elif qr_type == "epc":
        qr_content = f"BCD\n002\n1\nSCT\n\n{beneficiary}\n{iban}\nEUR{amount}\n\n\n{reference}"
    elif qr_type == "email":
        qr_content = f"mailto:{email}"
        if subject or body:
            qr_content += "?"
            if subject:
                qr_content += f"subject={subject.replace(' ', '%20')}"
            if subject and body:
                qr_content += "&"
            if body:
                qr_content += f"body={body.replace(' ', '%20')}"
    elif qr_type == "sms":
        qr_content = f"SMSTO:{phone}:{message}"
    elif qr_type == "wifi":
        qr_content = f"WIFI:T:{security};S:{ssid};P:{password};;"
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_content)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save to bytes
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    return Response(content=img_byte_arr, media_type="image/png")