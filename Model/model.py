import numpy as np
import pandas as pd
import json
import matplotlib.pyplot as plt
from PIL import Image
import torch
import os
import random
import torchvision.datasets as datasets
from torchvision import transforms
from torch.utils.data import DataLoader, Subset
import torch
import torch.nn as nn
import torch.optim as optim
from tqdm.auto import tqdm

# config
base_input_path = '/kaggle/input/'
input_path = f'{base_input_path}plantnet-300k-images/plantnet_300K/'
output_path = '/kaggle/working/'
metadata_path = f'{input_path}plantnet300K_metadata.json'
species_names_path = f'{input_path}plantnet300K_species_names.json'
convert_to_csv = False

if convert_to_csv:
    metadata = pd.read_json(metadata_path)
    metadata = metadata.transpose()
    metadata = metadata.reset_index()
    metadata = metadata.rename(columns={"index": "id"})
    metadata.to_csv(f'{output_path}metadata.csv', index=False)

    species_names = pd.read_json(species_names_path, orient="index")
    species_names = species_names.reset_index()
    species_names = species_names.rename(columns={"index": "species_id", 0: "species_name"})
    species_names.to_csv(f'{output_path}species_names.csv', index=False)
else:
    # load from pre-converted dataset
    metadata = pd.read_csv(f'{base_input_path}plantnet-metadata/metadata.csv')
    species_names = pd.read_csv(f'{base_input_path}plantnet-metadata/species_names.csv')

def show_image(path):
    img = Image.open(f'{input_path}{path}')
    plt.imshow(img)
    plt.axis('off')
    plt.show()

def show_tensor_image(tensor):
    tensor = tensor.detach().numpy().transpose((1, 2, 0))
    plt.imshow(image_array)
    plt.axis('off')  # To hide axis values
    plt.show()
    
show_image('images_train/1355868/01aca26dc4a0b0af7c55ecf84d8772179bf6fd6d.jpg')
metadata.info()
metadata.head()
species_names.info()

metadata['species_id'].plot(kind='hist', edgecolor='black', bins=1081)
# plt.xlabel('speci')
plt.ylabel('Frequency')
plt.show()



plt.style.use('ggplot')

best_model_path = f'{output_path}models/best_model.pth'

class SaveBestModel:
    """
    Class to save the best model while training. If the current epoch's 
    validation loss is less than the previous least less, then save the
    model state.
    """
    def __init__(
        self, best_valid_loss=float('inf')
    ):
        self.best_valid_loss = best_valid_loss
        
    def __call__(
        self, current_valid_loss, 
        epoch, model, optimizer, criterion
    ):
        if current_valid_loss >= self.best_valid_loss:
            return

        self.best_valid_loss = current_valid_loss
        print(f"\nBest validation loss: {self.best_valid_loss}")
        print(f"\nSaving best model for epoch: {epoch+1}\n")
        torch.save({
            'epoch': epoch+1,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'loss': criterion,
        }, best_model_path)
        

def load_best_model():
    return torch.load(best_model_path)

def save_model(epochs, model, optimizer, criterion):
    """
    Function to save the trained model to disk.
    """
    torch.save({
        'epoch': epochs,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'loss': criterion,
    }, f'{output_path}models/model_{epoch}.pth')



def show_species_sample(species_id):
    # List all files in the directory
    directory_path = f"{input_path}images_train/{species_id}/"
    all_files = os.listdir(directory_path)

    # Filter out any non-image files if needed (e.g., based on file extension)
    image_files = [f for f in all_files if f.lower().endswith(('jpg'))]

    # Select a random image file
    random_image_file = random.choice(image_files)

    # Open and display the image
    image_path = os.path.join(directory_path, random_image_file)
    image = Image.open(image_path)
#     plt.imshow(image)
#     plt.axis('off')  # Hide the axis values
#     plt.show()
    return image


train_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomVerticalFlip(p=0.5),
    transforms.GaussianBlur(kernel_size=(5, 9), sigma=(0.1, 5)),
    transforms.RandomRotation(45),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5]
    ),
    transforms.RandomCrop(224) #random on training, center on validation
])


valid_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5]
    ),
    transforms.CenterCrop(224)
])

train_dataset = datasets.ImageFolder(
    root=f'{input_path}images_train/',
    transform=train_transform
)

test_dataset = datasets.ImageFolder(
    root=f'{input_path}images_test/',
    transform=valid_transform
)


batch_size = 32
subset = None
train_subset = None
test_subset = None

# subset for quick iteration, disable once tested
# this is probably class imbalanced due to the nature of Subset not taking a stratified sample, but it is probably good enough for now.
# additionally, the way the test_dataset is subset is naive and may not be a good comparison size relative to train_dataset. i.e. 
# the subset should probably be a percentage, rather than a fixed number
if subset is not None:
    print(f"subsetting data to {subset} results")
    train_subset_indices = list(range(subset if subset < len(train_dataset) else len(train_dataset)))
    train_subset = Subset(train_dataset, train_subset_indices)

    test_subset_indices = list(range(subset if subset < len(test_dataset) else len(test_dataset)))
    test_subset = Subset(test_dataset, test_subset_indices)

# training data loaders
train_loader = DataLoader(
    train_dataset if train_subset is None else train_subset, batch_size=batch_size, shuffle=True,
    num_workers=2, pin_memory=True
)
# validation data loaders
test_loader = DataLoader(
    test_dataset if test_subset is None else test_subset, batch_size=batch_size, shuffle=False,
    num_workers=2, pin_memory=True
)


model = torch.hub.load('pytorch/vision:v0.10.0', 'alexnet', pretrained=True)

num_classes = len(species_names)
model.classifier[-1] = torch.nn.Linear(4096, num_classes)

for param in model.parameters():
    param.requires_grad = False

for param in model.classifier[6].parameters():
    param.requires_grad = True

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model= nn.DataParallel(model)
model.to(device)

def top_k_accuracy(output, target, k=5):
    with torch.no_grad():
        # Get the top k indices (labels) predicted
        _, pred = output.topk(k, 1, True, True)
        pred = pred.t()
        correct = pred.eq(target.contiguous().view(1, -1).expand_as(pred))
        
        # Compute and return the top-k accuracy
        correct_k = correct[:k].contiguous().view(-1).float().sum(0, keepdim=True)
        return correct_k.mul_(100.0 / output.size(0))

# def average_k_accuracy(output, target, k=5):
#     with torch.no_grad():
#         _, pred = output.max(1)
#         mask = target < k
#         correct = pred[mask].eq(target[mask])
#         return correct.float().mean().mul_(100.0)
    
def average_k_accuracy(output, target, k=5):
    with torch.no_grad():
        _, pred = output.topk(k, 1, True, True)  # Get the top-k predicted classes
        correct = pred.eq(target.view(-1, 1).expand_as(pred))  # Compare predictions to true labels
        accuracy = correct.float().mean()  # Calculate mean accuracy across all samples
        return accuracy.mul_(100.0)  # Optionally multiply by 100 to get a percentage


# todo merge below into 1 function
def macro_average_top_k_accuracy(output, target, k=5):
    accuracies = []
    for c in range(num_classes):
        mask = target == c

        if mask.sum() == 0:  # If there are no samples for the class, skip
            continue

        filtered_output = output[mask]
        filtered_target = target[mask]
        accuracy = top_k_accuracy(filtered_output, filtered_target, k)
        accuracies.append(accuracy.item())
    return sum(accuracies) / len(accuracies)

def macro_average_average_k_accuracy(output, target, k=5):
    accuracies = []
    for c in range(num_classes):
        mask = target == c

        if mask.sum() == 0:  # If there are no samples for the class, skip
            continue

        filtered_output = output[mask]
        filtered_target = target[mask]
        accuracy = average_k_accuracy(filtered_output, filtered_target, k)
        accuracies.append(accuracy.item())
    return sum(accuracies) / len(accuracies)

# def macro_metrics(output, target, k=5):
#     average_accuracies = []
#     top_accuracies = []

#     for c in range(num_classes):
#         mask = target == c

#         if mask.sum() == 0:  # If there are no samples for the class, skip
#             continue

#         filtered_output = output[mask]
#         filtered_target = target[mask]
#         top_accuracy = top_k_accuracy(filtered_output, filtered_target, k)
#         top_accuracies.append(top_accuracy.item())
#         average_accuracy = average_k_accuracy(filtered_output, filtered_target, k)
#         average_accuracies.append(average_accuracy.item())
    
#     top_average = sum(top_accuracies) / len(top_accuracies)
#     average_average = sum(average_accuracies) / len(average_accuracies)
#     return top_average, average_average
    

criterion = nn.CrossEntropyLoss()
# only update unfrozen layers, i.e. the last one
optimizer = optim.SGD(model.module.classifier[-1].parameters(), lr=0.0001, momentum=0.9, nesterov=True)


num_epochs = 7
save_best_model = SaveBestModel()
metrics = {
    "losses": [],
    "top_k_accs": [],
    "avg_k_accs": []
}
zero_correct_count = 0

for epoch in range(num_epochs):
    model.train()
    total_loss = 0.0
    total_macro_avg_top_k_acc = 0.0
    total_macro_avg_avg_k_acc = 0.0

    for i, data in tqdm(enumerate(train_loader), total=len(train_loader)):
        inputs, labels = data
        inputs, labels = inputs.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(inputs)
        
        loss = criterion(outputs, labels)
        total_loss += loss.item()
        average_top = macro_average_top_k_accuracy(outputs, labels)
        average_average = macro_average_average_k_accuracy(outputs, labels)
        
        if average_top != 0 and average_average != 0:
            total_macro_avg_top_k_acc += average_top
            total_macro_avg_avg_k_acc += average_average
        else:
            # todo probably need to deal with this more effectively
            zero_correct_count += 1
        
        loss.backward()
        optimizer.step()

    avg_loss = total_loss / len(train_loader)
    metrics["losses"].append(avg_loss)
    avg_macro_avg_top_k_acc = total_macro_avg_top_k_acc / len(train_loader)
    metrics["top_k_accs"].append(avg_macro_avg_top_k_acc)
    avg_macro_avg_avg_k_acc = total_macro_avg_avg_k_acc / len(train_loader)
    metrics["avg_k_accs"].append(avg_macro_avg_avg_k_acc)

    save_model(epoch, model, optimizer, criterion)
    save_best_model(
        loss, epoch, model, optimizer, criterion
    )    

    print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {avg_loss:.4f}, Macro-Avg Top-k Accuracy: {avg_macro_avg_top_k_acc:.5f}%, Macro-Avg Avg-k Accuracy: {avg_macro_avg_avg_k_acc:.5f}%")

save_model(num_epochs, model, optimizer, criterion)
print(f"zeros: {zero_correct_count}")

fig, axes = plt.subplots(2, 2, figsize=(10, 10))
axes = axes.flatten()

for i, item in enumerate(metrics.items()):
    k, v = item
    axis = axes[i]
    axis.plot(v)
    axis.set_xlabel('Epoch')
    axis.set_ylabel(k)
    axis.set_title(k)

plt.tight_layout()
plt.show()

inference_model = load_best_model()


test_metrics = {
    "losses": [],
    "top_k_accs": [],
    "avg_k_accs": []
}
total_test_loss = 0.0
total_test_macro_avg_top_k_acc = 0.0
total_test_macro_avg_avg_k_acc = 0.0

model.eval()

temp_outputs = None
temp_labels = None
temp_issue = None

zero_correct_count = 0
with torch.no_grad():
    for i, data in tqdm(enumerate(test_loader), total=len(test_loader)):
        inputs, labels = data
        inputs, labels = inputs.to(device), labels.to(device)

        outputs = model(inputs)
        loss = criterion(outputs, labels)

        total_test_loss += loss.item() * labels.size(0)
        average_top = macro_average_top_k_accuracy(outputs, labels)
        average_average = macro_average_average_k_accuracy(outputs, labels)
        
#         if np.isnan(average_top) or np.isnan(average_average):
#             temp_outputs = outputs
#             temp_labels = labels
#             temp_issue = 'top' if np.isnan(average_top) else 'average'
#             break
        
        if average_top != 0 and average_average != 0:
            total_test_macro_avg_top_k_acc += average_top
            total_test_macro_avg_avg_k_acc += average_average
        else:
            # todo probably need to deal with this more effectively
            zero_correct_count += 1
        

avg_test_loss = total_test_loss / len(test_loader)
avg_test_macro_avg_top_k_acc = total_test_macro_avg_top_k_acc / len(test_loader)
avg_test_macro_avg_avg_k_acc = total_test_macro_avg_avg_k_acc / len(test_loader)
print(f"Loss: {avg_test_loss:.4f}, Macro-Avg Top-k Accuracy: {avg_test_macro_avg_top_k_acc:.5f}%, Macro-Avg Avg-k Accuracy: {avg_test_macro_avg_avg_k_acc:.5f}%")
print(f"zeros: {zero_correct_count}")

fig, axes = plt.subplots(2, 2, figsize=(10, 10))
axes = axes.flatten()

for i, item in enumerate(test_metrics.items()):
    k, v = item
    axis = axes[i]
    axis.plot(v)
    axis.set_xlabel('Epoch')
    axis.set_ylabel(k)
    axis.set_title(k)

plt.tight_layout()
plt.show()

# show an image and predictions
class_to_idx = train_dataset.class_to_idx
idx_to_class = {v: k for k, v in class_to_idx.items()}

input_species_id = 1355868
input_image = Image.open(f'{input_path}images_train/{input_species_id}/01aca26dc4a0b0af7c55ecf84d8772179bf6fd6d.jpg')
input_species_name = species_names.loc[species_names['species_id'] == input_species_id]['species_name'].iloc[0]
input_tensor = valid_transform(input_image)
input_batch = input_tensor.unsqueeze(0) # create a mini-batch as expected by the model

model.eval()
with torch.no_grad():
    input_batch = input_batch.to(device)
    output = model(input_batch)

probabilities = torch.nn.functional.softmax(output[0], dim=0)
predicted_indices = output.topk(5, 1, True, True)

images = {}
predicted_species_names = []

for idx in predicted_indices.indices[0]:
    predicted_class = int(idx_to_class[idx.cpu().item()])
    species_name = species_names.loc[species_names['species_id'] == predicted_class]['species_name'].iloc[0]
    images[species_name] = show_species_sample(predicted_class)
    predicted_species_names.append(species_name)

print(f"Actual species: {input_species_name}")
print(f"predicted species (1st highest probability): {predicted_species_names}")

fig, axarr = plt.subplots(2, 3, figsize=(10, 5))
axarr = axarr.flatten()

for i, item in enumerate(images.items()):
    key, img = item
    ax = axarr[i]
    ax.set_title(key)
    ax.imshow(img)
    ax.axis('off')

ax = axarr[-1]
ax.axis('off')
ax.set_title(f'Actual: {input_species_name}')
ax.imshow(input_image)
plt.tight_layout()
plt.show()

