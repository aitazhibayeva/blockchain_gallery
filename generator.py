import json
import random
import os
from PIL import Image, ImageDraw, ImageFont

# config
COLLECTION_SIZE = 20
OUTPUT_DIR = "./output"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
METADATA_DIR = os.path.join(OUTPUT_DIR, "json")

os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(METADATA_DIR, exist_ok=True)

programs = ["Blockchain 101", "Advanced Solidity", "DeFi Mastery", "NFT Architecture"]
grades = ["A", "A+", "B", "B+"]
names = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Heidi"]

for i in range(1, COLLECTION_SIZE + 1):
    # 1. Generate Data
    name = f"{random.choice(names)} #{i}"
    program = random.choice(programs)
    grade = random.choice(grades)

    # 2. Create Image (Simple Certificate)
    img = Image.new('RGB', (500, 300), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    # Draw border
    d.rectangle([10, 10, 490, 290], outline="black", width=5)
    # Draw Text (Default font used for simplicity)
    d.text((50, 50), "CERTIFICATE OF COMPLETION", fill=(0, 0, 0))
    d.text((50, 100), f"Name: {name}", fill=(0,0,0))
    d.text((50, 140), f"Program: {program}", fill=(0,0,0))
    d.text((50, 180), f"Grade: {grade}", fill=(0,0,0))
    
    img_filename = f"{i}.png"
    img.save(os.path.join(IMAGES_DIR, img_filename))

    # 3. Create Metadata
    metadata = {
        "name": f"Graduate Certificate #{i}",
        "description": "Verified blockchain certification.",
        "image": f"ipfs://bafybeifdppfcaeljaw2pdoq3bpxmg4neg5frt6ldft3sm2esvmaruasmvi/{i}.png", # Placeholder, update later
        "attributes": [
            {"trait_type": "Student Name", "value": name},
            {"trait_type": "Program", "value": program},
            {"trait_type": "Grade", "value": grade}
        ]
    }
    
    with open(os.path.join(METADATA_DIR, f"{i}.json"), "w") as f:
        json.dump(metadata, f, indent=4)

print("Generation complete!")