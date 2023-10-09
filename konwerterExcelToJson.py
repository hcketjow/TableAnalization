import pandas as pd
import json
from datetime import datetime

# Put excel file here:
excel_file = 'file_name.xlsx'
df = pd.read_excel(excel_file)

# Function to handle datetime serialization


def serialize_datetime(obj):
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d')
    return None


# Change data to JSON format
contacts = []
for idx, row in df.iterrows():
    contact = {
        'id': row['excel_col_name'],
        'date_info': serialize_datetime(row['date_excel_col_name']),
        'your_name': row['excel_col_name'],
        'your_name': str(row['excel_col_name']),
    }

    # Replace NaN values with empty strings for all fields
    for key, value in contact.items():
        if pd.isna(value):
            contact[key] = ""

    contacts.append(contact)

# Zapisz dane JSON do pliku
with open('contacts.json', 'w', encoding='utf-8') as json_file:
    json.dump(contacts, json_file, indent=4,
              default=serialize_datetime, ensure_ascii=False)

print("File JSON was created with the name of: contacts.json")
