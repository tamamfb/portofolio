import os
import re

mapping = {
    '#A8D8B8': '#FFB27D',
    '#9FD4A6': '#FFA566',
    '#C8E6D7': '#FFD6B8',
    '#B4E0BA': '#FFC499',
    '#5BAA75': '#E67E4D',
    '#EBF9F1': '#FFF2E8',
    '#F0FAF5': '#FFF8F4',
    '#D4F1E0': '#FFE8D6'
}

src_dir = r"d:\ITS\S1\Semester 6\Random Project\Web Portofolio\portfolio\src"

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old_col, new_col in mapping.items():
        # Case insensitive replacement for hex codes
        pattern = re.compile(re.escape(old_col), re.IGNORECASE)
        new_content = pattern.sub(new_col, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk(src_dir):
    for filename in files:
        if filename.endswith(".jsx") or filename.endswith(".css"):
            filepath = os.path.join(root, filename)
            replace_in_file(filepath)

print("Color palette updated successfully.")
