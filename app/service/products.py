import json
from pathlib import Path

# Always points to the directory your script is currently saved in
BASE_DIR = Path(__file__).resolve().parent.parent

# Combines that safe directory with the relative path
Data_File = BASE_DIR / 'data' / 'products.json'

def load_products() -> list[dict]:
    if not Data_File.exists():
        return []
    with open(Data_File, 'r', encoding='utf-8') as file:
        return json.load(file)
    
def get_all_products() -> list[dict]:
    return load_products()