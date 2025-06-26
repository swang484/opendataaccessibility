from flask import Flask, request, jsonify
import pandas as pd
import requests 
import json
import duckdb
from ollama import chat
from ollama import ChatResponse
import importlib
import columns_to_schema
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/convertSQL',methods=["POST"])
def convertSQL():
  params = request.json
  domain = params['domain']
  code = params['code']
  question = params['question']
  # domain = "data.cityofnewyork.us"
  # code = "vx8i-nprf"
  # question = 'give me all people with names starting with the letter A'

  r = requests.get(f'https://{domain}/resource/{code}.json')
  df = pd.DataFrame(r.json())
  # with open('database.json', 'w') as f:
  #     json.dump(r.json(), f)

  schema = columns_to_schema.form_schema(domain, code, "df")

  prompt = f"""
  Generate a SQL query to answer this question: [QUESTION]{question}[/QUESTION]. Do not change the prompt.
  Write in plain text without any formatting. DO NOT RESPOND WITH ANYTHING EXCEPT THE SQL COMMAND!!!!
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
  # return output
  print(output)
  # out = process_output(output)
  # db = duckdb.read_json('database.json')
  result = duckdb.sql(output).df()
  print(result)
  print(jsonify(result.to_dict(orient='records')))
  return jsonify(result.to_dict(orient='records'))

if __name__ == '__main__':
   app.run()