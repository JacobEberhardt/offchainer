# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg

# Define values
ATTRIBUTES = ['name', 'type', 'size', 'descriptor']

# Define class
class Variable:
    
    # Define functions
    def __init__(self, content, index = None):

        # Set attributes
        for attribute_name in ATTRIBUTES:
            self.__setattr__(attribute_name, None)

        # Parse content
        self.index = index
        self.parse(content) 
        
    def parse(self, content):

        # Parse values
        result = reg.variable_combined.search(content)
        self.name = result.group(3)
        self.type = result.group(1)
        self.size = int(result.group(2) or 1)
        self.descriptor = '{}{} {}'.format(self.type, '[{}]'.format(self.size) if self.size > 1 else '', self.name)

    def print(self):
        print('Variable name:', self.name)
        print('- Type:', self.type)
        print('- Size:', self.size)
