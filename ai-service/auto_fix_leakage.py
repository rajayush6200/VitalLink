import os
import shutil
from collections import defaultdict

BASE = "dataset"
CLASSES = ["infection", "normal"]

# Collect smear locations
smear_map = defaultdict(list)

for split in ["train", "val"]:
    for cls in CLASSES:
        folder = os.path.join(BASE, split, cls)
        for f in os.listdir(folder):
            smear_id = "_".join(f.split("_")[:6])  # adjust if needed
            smear_map[smear_id].append((split, cls, f))

# Fix leakage
for smear_id, locations in smear_map.items():
    splits = set([loc[0] for loc in locations])

    if len(splits) > 1:
        # keep smear in TRAIN by default
        for split, cls, fname in locations:
            if split == "val":
                src = os.path.join(BASE, "val", cls, fname)
                dst = os.path.join(BASE, "train", cls, fname)
                shutil.move(src, dst)
        print(f"Fixed leakage for smear {smear_id}")

print("✅ Leakage fix completed")
