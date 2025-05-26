import argparse
from statsmodels.tsa.stattools import adfuller
import json
import pandas as pd

class ADF():
    
    # Initializes the values for the object
    def __init__(self, tempfile=None):
        if not tempfile:
            raise ValueError("A valid path to the JSON file must be provided.")
        self.tempfile = tempfile
        self.data = self.get_data()
        self.d = 0

    # Runs the adf test, returning True/False depending on the result
    def adf_test(self, data):
        if data.nunique() == 1:
            return True
        if len(data)<15:
            return True    
        result = adfuller(data)
        if result[1] <= 0.05:
            return True
        else:
            return False
        
    #iterates over the adf test, differentiating a data copy, until the adf test returns True and ARIMA value 'd' is found
    def get_diff_degree(self):
        data = self.data.dropna()
        self.d = 0
        while self.adf_test(data)==False:
            if self.d >= 2:
                break
            else:
                data = data.diff().dropna()
                self.d+=1

        
    def get_data(self):
        with open(self.tempfile, 'r') as file:
            return pd.Series(json.load(file))
    
    def save_diff_degree(self):
        with open(self.tempfile, 'w') as file:
            json.dump({"d": self.d}, file)

if __name__ == "__main__":
    # an argument parser, allowing the script to be run with parameters
    parser = argparse.ArgumentParser(description="Ad Hoc ADF Test")
    parser.add_argument("--tempfile", type=str)
    args = parser.parse_args()
    tempfile = args.tempfile

    adf = ADF(tempfile=tempfile)
    adf.get_diff_degree()
    adf.save_diff_degree()




