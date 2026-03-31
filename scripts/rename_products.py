import csv
import re
import os

# --- Configuration ---
INPUT_FILE = 'DATA/categories/Battery_Ranked.csv'
OUTPUT_FILE = 'DATA/categories/Battery_Renamed.csv'

# Brand Arabic Mapping Matches typical market transliterations
BRAND_AR_MAP = {
    'Dell': 'ديل',
    'HP': 'اتش بي',
    'Lenovo': 'لينوفو',
    'Acer': 'ايسر',
    'Asus': 'اسوس',
    'Apple': 'ابل',
    'Toshiba': 'توشيبا',
    'Samsung': 'سامسونج',
    'Sony': 'سوني',
    'Microsoft': 'مايكروسوفت',
    'Fujitsu': 'فوجيتسو',
    'Generic/Unknown': 'لاب توب' # Fallback
}

def clean_text(text):
    if not text:
        return ""
    return text.strip()

def map_quality_ar(quality_en):
    """Maps quality string to Arabic."""
    q = quality_en.lower()
    if 'original' in q:
        return 'أصلية'
    elif 'copy' in q or 'standard' in q or 'replacement' in q:
        # "High Copy" is a standard marketing term for good replacements
        return 'هاى كوبي' 
    return 'جودة عالية' # Default fallback

def extract_model_info(title, brand):
    """
    Attempts to extract the model or part number from the title.
    Removes the brand name to avoid confusion.
    """
    if not title:
        return ""
    
    # 1. Remove Brand from Title (case insensitive) to focus on Model
    #    Also remove common words like "Battery", "Replacement", "Laptop"
    ignore_words = [
        'battery', 'replacement', 'laptop', 'notebook', 'genuine', 'original', 
        'quality', 'for', 'compatible', 'series', 'high', 'copy', 'cell', 'standard',
        'mah', 'wh', 'volt', 'v', 'adapter', 'charger', 'new'
    ]
    if brand and brand != 'Generic/Unknown':
        ignore_words.append(brand.lower())

    # Normalized title for processing
    text = title.lower()
    
    # Remove specs like 11.1v, 5200mah to avoid confusing them with models (simple regex)
    text = re.sub(r'\d+(\.\d+)?[vV]', '', text) # Remove voltage
    text = re.sub(r'\d+mah', '', text)       # Remove mAh
    text = re.sub(r'\d+wh', '', text)        # Remove Wh

    tokens = text.split()
    model_candidates = []
    
    for token in tokens:
        # Clean token of special chars
        clean_token = re.sub(r'[^a-zA-Z0-9-]', '', token)
        
        if len(clean_token) < 3: # Skip very short tokens
            continue
            
        if clean_token in ignore_words:
            continue
        
        # Check if it looks like a model/part number
        # Should contain digits or be mixed alphanumeric
        # Pure alpha words checking against ignore list is handled above
        is_alphanumeric = bool(re.search(r'\d', clean_token)) and bool(re.search(r'[a-zA-Z]', clean_token))
        is_numeric_model = bool(re.match(r'^\d{4,}$', clean_token)) # e.g. 3521, 5558
        is_part_code = bool(re.match(r'^[a-zA-Z0-9]{4,10}$', clean_token)) # e.g. J1KND, 6MT4T
        
        if is_alphanumeric or is_numeric_model or is_part_code:
            # Preserve original case if possible from original title? 
            # We split lower(), so we need to find it in original string or just uppercase it?
            # Uppercase is standard for models
            model_candidates.append(clean_token.upper())

    # Deduplicate and join
    unique_models = sorted(list(set(model_candidates)), key=model_candidates.index)
    
    # Take top 3 max to keep title short
    return " ".join(unique_models[:4])

def rename_products():
    print(f"Reading from {INPUT_FILE}...")
    
    rows = []
    with open(INPUT_FILE, 'r', encoding='utf-8-sig') as f: # Use utf-8-sig to handle POTENTIAL BOM
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    if 'FixZone_Title' not in fieldnames:
        fieldnames.append('FixZone_Title')

    count = 0
    for row in rows:
        brand = row.get('Brand', 'Generic/Unknown').strip()
        original_title = row.get('Original Title', '')
        quality = row.get('Quality', 'Standard/Copy')
        
        # Determine components
        # Normalize brand for lookup
        brand_key = brand.capitalize() # Dell, Hp, Lenovo
        # Special case for HP which might be Hp or HP
        if brand.upper() == 'HP': brand_key = 'HP'
        if brand_key == 'Hp': brand_key = 'HP' 

        brand_ar = BRAND_AR_MAP.get(brand_key, brand) # Default to English if no map
        
        if brand == 'Generic/Unknown':
             brand_ar = "" # Don't print "Lapt top Lapt top"

        quality_ar = map_quality_ar(quality)
        model_info = extract_model_info(original_title, brand)
        
        # Format: بطارية لاب توب [Brand_Ar] [Model] - [Quality_Ar]
        # Example: بطارية لاب توب ديل Inspiron 5558 - أصلية
        
        components = ["بطارية لاب توب"]
        if brand_ar:
            components.append(brand_ar)
        
        if model_info:
            components.append(model_info)
            
        # Add separator for quality
        full_title = " ".join(components) + f" - {quality_ar}"
        
        row['FixZone_Title'] = full_title
        count += 1

    print(f"Renamed {count} products.")
    
    print(f"Writing to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print("Done.")

if __name__ == "__main__":
    rename_products()
