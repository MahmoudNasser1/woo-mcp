import csv
import difflib
import sys

INPUT_FILE = 'DATA/market_analysis_report_v2.csv'
OUTPUT_FILE = 'DATA/clean_market_data.csv'
SIMILARITY_THRESHOLD = 0.85

def normalize_text(text):
    if not text:
        return ""
    return text.lower().strip()

def is_valid_price(price_str):
    if not price_str or price_str.upper() == 'N/A':
        return False
    try:
        val = float(price_str)
        return val > 0
    except ValueError:
        return False

def clean_data():
    print(f"Reading from {INPUT_FILE}...")
    
    rows = []
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            for row in reader:
                rows.append(row)
    except FileNotFoundError:
        print(f"Error: File {INPUT_FILE} not found.")
        return

    print(f"Total rows read: {len(rows)}")

    # 1. Filter invalid records
    valid_rows = []
    for row in rows:
        title = row.get('Original Title', '')
        selling_price = row.get('Suggested Selling Price', '0')
        if not title or not is_valid_price(selling_price):
            continue
        valid_rows.append(row)
    
    print(f"Rows after initial filtering (invalid price/title): {len(valid_rows)}")

    # 2. De-duplication (Sort and compare neighbors)
    grouped_data = {}
    for row in valid_rows:
        key = (row.get('Brand', 'Unknown'), row.get('Category', 'Unknown'))
        if key not in grouped_data:
            grouped_data[key] = []
        grouped_data[key].append(row)

    final_rows = []
    duplicates_removed = 0

    print("Processing duplicates (Sort & Compare)...")
    
    for key, group in grouped_data.items():
        # Sort by title to bring similar items together
        group.sort(key=lambda x: normalize_text(x.get('Original Title', '')))
        
        unique_in_group = []
        
        if not group:
            continue
            
        unique_in_group.append(group[0])
        
        for i in range(1, len(group)):
            current_item = group[i]
            # Compare with the last unique item kept
            last_unique = unique_in_group[-1]
            
            curr_title = normalize_text(current_item.get('Original Title', ''))
            last_title = normalize_text(last_unique.get('Original Title', ''))
            
            # Comparison
            similarity = difflib.SequenceMatcher(None, curr_title, last_title).ratio()
            
            if similarity > SIMILARITY_THRESHOLD:
                # Duplicate found
                duplicates_removed += 1
                # Optional: Keep the one with better price? 
                # For now, we drop the current one as it's "redundant" to the one we already kept.
                # If we wanted to keep the 'best' one, we'd need more logic.
            else:
                unique_in_group.append(current_item)
        
        final_rows.extend(unique_in_group)
        print(f"Processed group {key}. Size: {len(group)} -> {len(unique_in_group)}")

    print(f"Total Duplicates removed: {duplicates_removed}")
    print(f"Final clean rows: {len(final_rows)}")

    # Write output
    if final_rows:
        with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(final_rows)
        print(f"Successfully saved to {OUTPUT_FILE}")
    else:
        print("Warning: No rows to save!")

if __name__ == "__main__":
    clean_data()
