# Define values
ATTRIBUTES = ['name', 'arguments', 'modifiers', 'used_state_variables', 'changed_state_variables']

# Define class
class Function:
    
    # Define functions
    def __init__(self, content):

        # Set attributes
        for attribute_name in ATTRIBUTES:
            self.__setattr__(attribute_name, None)

        # Parse content
        self.parse(content)

    def parse(self, content):
        pass

    def print(self):
        pass
