import traceback
from detector import FraudDetector

try:
    with open('c:/Users/ghosh/Downloads/Mulex-main/Mulex-main/money-mulling.csv', 'r') as f:
        csv_data = f.read()

    fd = FraudDetector()
    res = fd.analyze(csv_data)
    with open('test_result.json', 'w') as f:
        f.write('{"status": "Success"}')
except Exception as e:
    with open('test_result.json', 'w') as f:
        import json
        f.write(json.dumps({"error": str(e), "traceback": traceback.format_exc()}))
