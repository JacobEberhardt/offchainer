# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg
from utils import clean
from .Function import Function
from .Variable import Variable

# Define values
ATTRIBUTES = ['name', 'variables', 'functions']

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
        self.name = reg.contract_name.search(content)[1]
        self.variables = [Variable(content[0]) for content in reg.variable.finditer(clean.remove_functions(content))]
        self.functions = [Function(content[0], self.variables) for content in reg.function.finditer(content)]

    def print(self):

        # Print contract name
        print('Contract name:', self.name)

        # Print variables
        print('=' * 10)
        print('Variables:')
        print('=' * 10)
        for var in self.variables or []:
            var.print()

        # Print functions
        print('=' * 10)
        print('Functions:')
        print('=' * 10)
        for fn in self.functions or []:
            fn.print()
