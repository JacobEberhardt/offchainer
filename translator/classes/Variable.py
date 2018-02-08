# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg

# Define values
ATTRIBUTES = ['name', 'type', 'size']

# Define class
class Variable:
    
    # Define functions
    def __init__(self, content):

        # Set attributes
        for attribute_name in ATTRIBUTES:
            self.__setattr__(attribute_name, None)

        # Parse content
        self.parse(content) 
        
    def parse(self, content):

        # Parse values
        result = reg.variable_combined.search(content)
        self.name = result[3]
        self.type = result[1]
        self.size = int(result[2] or 1)

    def print(self):
        print('Variable name:', self.name)
        print('- Type:', self.type)
        print('- Size:', self.size)
