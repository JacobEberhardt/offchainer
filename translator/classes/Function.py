# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg
from os import linesep
import re

# Define values
ATTRIBUTES = ['name', 'arguments', 'modifiers', 'used_variables', 'changed_variables']

# Define class
class Function:
    
    # Define functions
    def __init__(self, content, variables):

        # Set attributes
        for attribute_name in ATTRIBUTES:
            self.__setattr__(attribute_name, None)

        # Parse content
        self.parse(content, variables)

    def parse(self, content, variables):
        content = linesep.join([line.strip() for line in content.split(linesep)])
        self.name = reg.function_name.search(content)[1]
        self.arguments = reg.function_arguments.search(content)[1]
        self.modifiers = reg.function_modifiers.search(content)[1]
        body = reg.function_body.search(content)[1]
        self.changed = []
        for var in variables:
            if re.search(reg.variable_changed_template.format(var.name), body) is not None:
                self.changed.append(var.name)
                self.used = self.changed[:]
        for var in variables:
            if re.search(reg.variable_used_template.format(var.name), body) is not None:
                self.used.append(var.name)
        self.changed = list(set(self.changed))
        self.used = list(set(self.used))

    def print(self):
        print('Function name:', self.name)
        print('- Arguments:', self.arguments)
        print('- Modifiers:', self.modifiers)
        print('- Variables changed:', ', '.join(self.changed))
        print('- Variables used:', ', '.join(self.used))
