# Import dependencies
import sys
sys.path.append('..')
from utils import regexp as reg
from os import linesep
from .Variable import Variable
import re

# Define values
ATTRIBUTES = ['variables', 'name', 'arguments', 'modifiers', 'body', 'changed', 'used']

# Define class
class Function:
    
    # Define functions
    def __init__(self, content, global_variables):

        # Set attributes
        for attribute_name in ATTRIBUTES:
            self.__setattr__(attribute_name, None)

        # Parse content
        self.variables = global_variables
        self.parse(content)
        self.offchain()

    def parse(self, content):

        # Parse trivial values
        self.name = reg.function_name.search(content)[1]
        self.modifiers = reg.function_modifiers.search(content)[1]

        # Parse arguments
        self.arguments = [Variable('{};'.format(item)) for item in reg.function_arguments.search(content)[1].split(', ')]

        # Parse variable usage/modification
        self.body = reg.function_body.search(content)[1]
        self.changed = []
        for idx, var in enumerate(self.variables):
            if re.search(reg.variable_changed_template.format(var.name), self.body) is not None:
                self.changed.append(idx)
        self.used = self.changed[:]
        for idx, var in enumerate(self.variables):
            if re.search(reg.variable_used_template.format(var.name), self.body) is not None:
                self.used.append(idx)

        # Remove duplicates
        self.changed = list(set(self.changed))
        self.used = list(set(self.used))

        # Get variables
        self.changed = [self.variables[idx] for idx in self.changed]
        self.used = self.arguments + [self.variables[idx] for idx in self.used]

    def offchain(self):

        # Define offchained values
        self.oc = type('Offchain', (object,), {
            'request_name': 'request{}'.format(self.name.title()), # The name of the request function
            'request_event_name': 'Request{}Event'.format(self.name.title()), # The name of the request event
            'execute_name': 'execute{}'.format(self.name.title()), # The name of the execute function
            'execute_event_name': 'Executed{}Event'.format(self.name.title()), # The name of the execute event
            'changed_args_descriptor': ', '.join([var.descriptor for var in self.changed]), # A string containing all changed variables including types, separated by commata
            'changed_args_name': ', '.join([var.name for var in self.changed]), # A string containing the names of all changed variables, separated by commata
            'used_args_descriptor': ', '.join([var.descriptor for var in self.used]), # A string containing all used variables including types, separated by commata
            'call_args_descriptor': ', '.join([var.descriptor for var in self.arguments]), # A string containing all arguments of the orginal function including types, separated by commata
            'call_args_name': ', '.join([var.name for var in self.arguments]) # A string containing the names of all arguments of the original function, separated by commata
        })()

    def print(self):
        print('Function name:', self.name)
        print('- Arguments:', ', '.join([arg.name for arg in self.arguments]))
        print('- Modifiers:', self.modifiers)
        print('- Variables changed:', ', '.join([str(var) for var in self.changed]))
        print('- Variables used:', ', '.join([str(var) for var in self.used]))
