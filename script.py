import pandas
import requests
import duckdb

r = requests.get('https://data.cityofnewyork.us/resource/vx8i-nprf.json')

duckdb.read_json(r.json())


