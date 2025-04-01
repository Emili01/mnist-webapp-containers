FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
COPY main.py .
COPY models.py .
COPY mlp_prm_mnist.pth .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]