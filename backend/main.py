from fastapi import FastAPI, File, UploadFile 
from PIL import Image
import torch
from torchvision import transforms
from models import MLP 
import requests
import io
import os
from fastapi.middleware.cors import CORSMiddleware

input_size = 28 * 28  # Tamaño de las imágenes de MNIST (28x28 píxeles) 
model = MLP(input_size, 150, 10)
#model.load_state_dict(torch.load('mlp_prm_mnist.pth',weights_only=True))
model.load_state_dict(torch.load('mlp_prm_mnist.pth', weights_only=True, map_location=torch.device('cpu')))
model.eval()

transform = transforms.Compose([transforms.Grayscale(),transforms.Resize((28,28)), transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])

app = FastAPI()


# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/') 
def root():
    return {'message': 'Hello World'}

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    images_byte = await file.read()
    image = Image.open(io.BytesIO(images_byte))

    image = transform(image).unsqueeze(0) #Se agrega una dimensión extra para el tamaño del lote
    
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
        prediction = predicted.item()
        print(prediction)
    return {'prediction': prediction}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=3000)