# mnist-webapp-containers
An MLP model trained on the MNIST database with a web interface to recognize handwritten numbers in real time.

## Key Features
✅ **Model Training**: 2-layer MLP with Dropout regularization  
✅ **Microservice Architecture**: Decoupled frontend/backend  
✅ **Production Deployment**: Containerized with Docker Compose  
✅ **Interactive Demo**: Real-time predictions via canvas input  

## Quick Start
```bash
# Clone and deploy
git clone https://github.com/Emili01/mnist-webapp-containers.git
cd mnist-webapp-containers
docker-compose up --build
