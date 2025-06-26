import requests


type_convert = {
    "text": "VARCHAR",
    "calendar_date": "DATE",
    "number": "FLOAT"
}

def test():
    return "test"

def form_schema(domain: str, uuid: str, table_name: str = None) -> str:
    metadata = requests.get(f"https://{domain}/views/{uuid}.json")
    metadata_dict = metadata.json()

    columns = metadata_dict["columns"]

    table = table_name if table_name is not None else metadata_dict['name'].replace(' ', '_')
    writestr = f"CREATE TABLE {table} (\n"
    for i, c in enumerate(columns):
        ntype = type_convert[c['dataTypeName']] + (',' if i < len(columns) - 1 else '')
        ndesc = c['description'].replace('\n', '')
        writestr += f"\t{c['fieldName']} {ntype} --{ndesc}\n"

    writestr += ");"

    return writestr


if __name__ == "__main__":
    print(form_schema("data.cityofnewyork.us", "kpav-sd4t"))
