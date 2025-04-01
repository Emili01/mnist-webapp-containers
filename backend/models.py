import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(MLP, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, output_size)
        self.dp = nn.Dropout(0.2)
        self.relu = nn.ReLU()
        
    
    def forward(self, x):
        x = x.view(x.size(0), -1) #aplanar la imagen
        x1 = self.fc1(x)
        x2 = self.relu(x1)
        x2 = self.dp(x2)
        x3 = self.fc2(x2)
        return x3