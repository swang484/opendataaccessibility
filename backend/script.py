import pandas
import requests
import json
import duckdb
from ollama import chat
from ollama import ChatResponse
import importlib
import columns_to_schema

domain = "data.cityofnewyork.us"
code = "vx8i-nprf"
question = 'give me the first names of all candidates that start with the name A'

r = requests.get(f'https://{domain}/resource/{code}.json')
with open('database.json', 'w') as f:
    json.dump(r.json(), f)

schema = columns_to_schema.form_schema(domain, code, "db")

prompt = f"""
Generate a SQL query to answer this question: [QUESTION]{question}[/QUESTION]. Do not change the prompt. DO NOT ADD
Write in plain text without any formatting.
The query will run on a database with the following schema:
{schema}
Answer: Given the database schema, here is the SQL query that answers [QUESTION]{question}[/QUESTION]. [SQL] <s>
"""

response: ChatResponse = chat(model='sqlcoder:latest', messages=[
  {
    'role': 'user',
    'content': prompt,
  },
])

output = response['message']['content']
print(output)

db = duckdb.read_json('database.json')
print(duckdb.sql(output))
