# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg
from utils import clean

# Define values
ATTRIBUTES = ['name', 'state_variables', 'functions']

# Define class
class Contract:

    # Define functions
    def __init__(self):

        # Set attributes
        for attribute_name in ATTRIBUTES:
            self.__setattr__(attribute_name, None)

    def parse(self, content):
        content = clean.remove_comments(content) # Remove comments
        self.name = reg.contract_name.match(content)
        self.functions = [{'source': fn[1], 'name': fn[2]} for fn in reg.function.finditer(content)]
        self.state_variables = [{'name': var[3], 'type': var[1], 'size': int(var[2] or 1)} for var in reg.state_variable.finditer(clean.remove_functions(content))]

    def print(self):
        print(self.name)
        print('\tfunctions:')
        for fn in self.functions or []:
            print('\t\t', fn['name'])
        print('\tvariables:')
        for var in self.state_variables or []:
            print('\t\t', var['name'])
            print('\t\t\ttype:', var['type'])
            print('\t\t\tsize:', var['size'])
