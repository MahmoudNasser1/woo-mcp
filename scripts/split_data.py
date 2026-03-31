import csv
import os
import re

INPUT_FILE = 'DATA/clean_market_data.csv'
OUTPUT_DIR = 'DATA/categories'

def sanitize_filename(name):
    # Replace invalid characters with underscore
    return re.sub(r'[<>:"/\\|?*]', '_', name).strip()

def split_data():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    print(f"Reading from {INPUT_FILE}...")
    
    rows_by_category = {}
    fieldnames = []

    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            for row in reader:
                category = row.get('Category', 'Unknown')
                if category not in rows_by_category:
                    rows_by_category[category] = []
                rows_by_category[category].append(row)
    except FileNotFoundError:
        print(f"Error: File {INPUT_FILE} not found.")
        return

    print(f"Found {len(rows_by_category)} categories.")

    for category, rows in rows_by_category.items():
        safe_name = sanitize_filename(category)
        output_file = os.path.join(OUTPUT_DIR, f"{safe_name}.csv")
        
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
        print(f"Saved {len(rows)} rows to {output_file}")

    print("Splitting complete.")

if __name__ == "__main__":
    split_data()
