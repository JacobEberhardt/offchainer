# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg
from utils import clean
from .Function import Function

# Define values
ATTRIBUTES = ['name', 'state_variables', 'functions']

# Define class
class Contract:

    # Define functions
    def __init__(self, content):

        # Set attributes
        for attribute_name in ATTRIBUTES:
            self.__setattr__(attribute_name, None)

        # Parse content
        self.parse(content)

    def parse(self, content):
        content = clean.remove_comments(content) # Remove comments
        self.name = reg.contract_name.search(content)
        self.functions = [Function(content) for content in reg.function.finditer(content)]
        self.state_variables = [{'name': var[3], 'type': var[1], 'size': int(var[2] or 1)} for var in reg.state_variable.finditer(clean.remove_functions(content))]

    def print(self):
        print('Contract name:', self.name)
        print('Functions:')
        print('=' * 10)
        for fn in self.functions or []:
            fn.print()
        print('Variables:')
        print('=' * 10)
        for var in self.state_variables or []:
            print('Variable name:', var['name'])
            print('- Type:', var['type'])
            print('- Size:', var['size'])
