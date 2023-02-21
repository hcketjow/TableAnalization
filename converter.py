import pandas as pd

# Read the excel file into a pandas dataframe
df = pd.read_excel('file2.xlsx', skiprows=None)

# Convert the dataframe to a list of dictionaries
data = df.to_dict('records')

# Print the data in the desired format
for item in data:
    print({
         id: item[ id],
        data_umowy: item[data_umowy],
        spolka: item[spolka],
        nazwa_inwest: item[nazwa_inwest],
        adres: item[adres],
        pesel: item[pesel],
         nip: item[ nip],
        regon: item[regon],
        przedmiot: item[przedmiot],
        kwota: int(item[kwota]) if str(item[kwota]).isnumeric() else 0,
        nr_rach_spol: str(item[nr_rach_spol]).replace('.', '_'),
        nr_rach_inwest: str(item[nr_rach_inwest]),
        uwagi: item[uwagi],
    })
