import os
import pickle
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sklearn.ensemble import IsolationForest
from flask_cors import CORS
from twilio.rest import Client

load_dotenv()

app = Flask(__name__)
CORS(app)


def process_data_and_train_model():
    username = os.getenv('AIVEN_USERNAME')
    password = os.getenv('AIVEN_PASSWORD')
    database = os.getenv('AIVEN_DATABASE')

    engine = create_engine(f'postgresql://{username}:{password}@anomaly-detection-anomaly-detection.a.aivencloud.com:18261/{database}?sslmode=require')
    query = """
        SELECT * FROM anomaly
    """
    df = pd.read_sql_query(query, engine)
    
    # Feature engineering
    df['hour_of_day'] = (df['step']) % 24
    df['balance_change_orig'] = abs((df['newbalanceOrig'] - df['oldbalanceOrg']))
    df['balance_change_dest'] = abs((df['newbalanceDest'] - df['oldbalanceDest']))
    df["errorBalanceOrg"] = abs((df.newbalanceOrig + df.amount - df.oldbalanceOrg))
    df["errorBalanceDest"] = abs((df.oldbalanceDest + df.amount - df.newbalanceDest))
    df['transactionBetween'] = df['nameDest'].apply(lambda x: 'Customer2Customer' if x[0] == "C" else 'Customer2Merchant')
    df_append=df[['type', 'transactionBetween']]
    df = pd.get_dummies(df, columns=['type', 'transactionBetween'])
    X = df[['step', 'amount', 'oldbalanceOrg', 'newbalanceDest', 'balance_change_orig', 'balance_change_dest', 'errorBalanceDest', 'type_CASH_OUT', 'type_TRANSFER', 'transactionBetween_Customer2Customer']]
    y = df['isFraud']
    X= X.rename(str,axis="columns")
    model = IsolationForest(random_state=42)
    model.fit(X)  

    # Save the trained model
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)

    anomaly_scores = model.decision_function(X)
    df['anomaly_score'] = anomaly_scores
    restricted_countries = ['Syria ', 'Cuba ','Bulgaria ']
    outliers = model.predict(X)
    df['isRestrict'] = df['Country'].apply(lambda x: 1 if x in restricted_countries else 0)
    df['outlier'] = outliers
    df['outlier'] = df['outlier'].replace({-1: 1, 1: 0})
    df= pd.concat([df, df_append], axis=1)
    df.drop(columns=['transactionBetween_Customer2Customer',
       'transactionBetween_Customer2Merchant', 
       'type_CASH_IN', 'type_CASH_OUT', 'type_DEBIT', 'type_PAYMENT',
       'type_TRANSFER'], inplace=True)
    desired_column_order = ['step','hour_of_day', 'transaction_id','type', 'amount','transactionBetween', 'nameOrig', 'oldbalanceOrg',
       'newbalanceOrig', 'nameDest', 'oldbalanceDest', 'newbalanceDest',
       'isFraud',  'balance_change_orig', 'balance_change_dest',
       'errorBalanceOrg', 'errorBalanceDest', 'anomaly_score', 'outlier','Country','isRestrict']

    df = df.reindex(columns=desired_column_order)

    df.rename(columns={'oldbalanceOrg':'oldBalanceOrig', 'newbalanceOrig':'newBalanceOrig', 
                    'oldbalanceDest':'oldBalanceDest', 'newbalanceDest':'newBalanceDest', 'balance_change_dest': 'destChange',
                         'balance_change_orig':'origChange', 
                        'anomaly_score': 'iso_anomaly_score', 'outlier':'iso_outliers'}, inplace=True)
    df= df.rename(str,axis="columns")
    
    # df.to_sql('new_output', engine, index=False, if_exists='replace')
    return df, model

@app.route('/processed_data', methods=['GET'])
def get_processed_data():
    # Process data
    process_data_and_train_model()
    
    # Return processed data as JSON
    response = jsonify({"order_id": 123, "status": "Shipped Successfully"})
    return response



@app.route('/predict', methods=['POST'])
def predict():
    # Load the trained model
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    # Get input data from request
    data = request.get_json()
    input_df = pd.DataFrame([data])
    
    # Make predictions
    predictions = model.predict(input_df)
    
    # Return predictions as JSON
    return jsonify({'predictions': predictions.tolist()})

@app.route('/sendsms', methods=['POST'])
def sendsms():
    account_sid = os.environ['TWILIO_SID']
    auth_token = os.environ['TWILIO_AUTH_TOKEN']
    client = Client(account_sid, auth_token)

    data = request.get_json()
    phone = data['phone']
    transactionid = data['transactionid']
    senderPhone = os.getenv('TWILIO_PHONE_NUMBER')

    message = client.messages \
        .create(
            body=f'.\n\nALERT!!!\nDear Customer,\nWe have detected ANOMALY in your latest transaction with Transaction ID {transactionid}.',
            from_= senderPhone,
            to=phone
        )

    return jsonify({"success":True})


if __name__ == '__main__':
    app.run(debug=True)