"""Quick metrics check for money-mulling.csv"""
import json
import pandas as pd
from detector import FraudDetector

df = pd.read_csv("../money-mulling.csv")
d = FraudDetector()
r = d.analyze(open("../money-mulling.csv").read())

gt_fraud = {
    "ACC_00123","ACC_00456","ACC_00789",
    "ACC_00234","ACC_00567","ACC_00890",
    "ACC_00345","ACC_00678","ACC_00901",
    "SMURF_01",
    "ACC_01000","ACC_01001","ACC_01002","ACC_01003",
    "ACC_01004","ACC_01005","ACC_01006","ACC_01007",
    "ACC_01008","ACC_01009","ACC_01010","ACC_01011",
}

aa = set(df["sender_id"].astype(str)) | set(df["receiver_id"].astype(str))
ps = set(a.account_id for a in r.suspicious_accounts)

TP = len(ps & gt_fraud)
FP = len(ps - gt_fraud)
TN = len((aa - ps) - gt_fraud)
FN = len(gt_fraud - ps)
P = TP / (TP + FP) if (TP + FP) else 0
R = TP / (TP + FN) if (TP + FN) else 0
A = (TP + TN) / len(aa)
F = 2 * P * R / (P + R) if (P + R) else 0

print(f"TP={TP}  FP={FP}  TN={TN}  FN={FN}")
print(f"Precision = {P:.4f} ({P*100:.1f}%)")
print(f"Recall    = {R:.4f} ({R*100:.1f}%)")
print(f"Accuracy  = {A:.4f} ({A*100:.1f}%)")
print(f"F1-Score  = {F:.4f} ({F*100:.1f}%)")
print(f"Total={len(aa)}  GT_fraud={len(gt_fraud)}  Predicted={len(ps)}")
print()
print("Caught:", sorted(ps & gt_fraud))
print("Missed:", sorted(gt_fraud - ps))
print("False +:", sorted(ps - gt_fraud))
print()
print(f"MERCHANT_01 in merchants: {'MERCHANT_01' in d.merchants}")
print(f"MERCHANT_01 score: {d.scores.get('MERCHANT_01', 0)}")
print(f"MERCHANT_01 patterns: {d.patterns.get('MERCHANT_01', [])}")
print(f"SMURF_01 score: {d.scores.get('SMURF_01', 0)}")
print(f"SMURF_01 patterns: {d.patterns.get('SMURF_01', [])}")
