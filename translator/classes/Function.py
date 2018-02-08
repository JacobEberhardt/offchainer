# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg
from os import linesep
import re

# Define values
ATTRIBUTES = ['name', 'arguments', 'modifiers', 'changed', 'used']

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

        # Remove whitespace
        content = linesep.join([line.strip() for line in content.split(linesep)])

        # Parse trivial values
        self.name = reg.function_name.search(content)[1]
        self.arguments = reg.function_arguments.search(content)[1]
        self.modifiers = reg.function_modifiers.search(content)[1]

        # Parse variable usage/modification
        body = reg.function_body.search(content)[1]
        self.changed = []
        for idx, var in enumerate(variables):
            if re.search(reg.variable_changed_template.format(var.name), body) is not None:
                self.changed.append(idx)
        self.used = self.changed[:]
        for idx, var in enumerate(variables):
            if re.search(reg.variable_used_template.format(var.name), body) is not None:
                self.used.append(idx)

        # Remove duplicates
        self.changed = list(set(self.changed))
        self.used = list(set(self.used))

    def print(self):
        print('Function name:', self.name)
        print('- Arguments:', self.arguments)
        print('- Modifiers:', self.modifiers)
        print('- Variables changed:', ', '.join([str(var) for var in self.changed]))
        print('- Variables used:', ', '.join([str(var) for var in self.used]))
