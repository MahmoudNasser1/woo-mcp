import csv
import re
import os

FILES_TO_PROCESS = [
    'DATA/categories/Battery.csv',
    'DATA/categories/Keyboard.csv'
]

# Heuristics
HIGH_DEMAND_BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple']
MEDIUM_DEMAND_BRANDS = ['Acer', 'Asus', 'Toshiba', 'Sony', 'Samsung']
LOW_DEMAND_BRANDS = ['Gateway', 'Fujitsu', 'MSI', 'Unknown', 'Generic/Unknown']

POPULAR_MODELS_REGEX = r"(Inspiron|Latit|Vostro|Pavilion|ProBook|EliteBook|ThinkPad|IdeaPad|MacBook|ZenBook|Aspire)"

def calculate_demand_score(row):
    score = 50  # Base score
    
    brand = row.get('Brand', 'Unknown')
    title = row.get('Original Title', '')
    
    # Brand Score
    if brand in HIGH_DEMAND_BRANDS:
        score += 30
    elif brand in MEDIUM_DEMAND_BRANDS:
        score += 15
    elif brand in LOW_DEMAND_BRANDS:
        score -= 10
        
    # Model Popularity
    if re.search(POPULAR_MODELS_REGEX, title, re.IGNORECASE):
        score += 20
        
    return min(100, max(0, score))

def calculate_expert_rating(row):
    rating = 7.0 # Base rating
    
    quality = row.get('Quality', 'Standard/Copy')
    brand = row.get('Brand', 'Unknown')
    price_str = row.get('Suggested Selling Price', '0')
    
    try:
        price = float(price_str)
    except ValueError:
        price = 0
        
    # Quality Factor
    if 'Original' in quality:
        rating += 1.5
    elif 'High Copy' in quality: # Assumption if exists
        rating += 0.5
    else:
        rating -= 0.5 # Standard/Copy
        
    # Brand Factor
    if brand == 'Apple':
        rating += 0.5 # High resale value
    elif brand in ['Dell', 'HP', 'Lenovo']:
        rating += 0.2
        
    # Price Value Factor (Lower price is better/higher value for generic items, 
    # but for high end items, price might indicate quality. Let's stick to simple value.)
    # This is a bit subjective. Let's keep it simple: 
    # If Original and Price < 2000 (cheap original), boost rating
    if 'Original' in quality and 0 < price < 2000:
        rating += 0.5
        
    return min(10.0, max(1.0, round(rating, 1)))

def process_files():
    for filepath in FILES_TO_PROCESS:
        if not os.path.exists(filepath):
            print(f"Skipping {filepath} (Not found)")
            continue
            
        print(f"Processing {filepath}...")
        
        rows = []
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            if 'Demand_Score' not in fieldnames:
                fieldnames.extend(['Demand_Score', 'Expert_Rating'])
            
            for row in reader:
                row['Demand_Score'] = calculate_demand_score(row)
                row['Expert_Rating'] = calculate_expert_rating(row)
                rows.append(row)
        
        # Sort by Demand Score Descending
        rows.sort(key=lambda x: x['Demand_Score'], reverse=True)
        
        # Write back
        output_path = filepath.replace('.csv', '_Ranked.csv')
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
            
        print(f"Saved ranked data to {output_path}")

if __name__ == "__main__":
    process_files()
