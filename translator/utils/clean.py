# Import dependencies
from .regexp import comment, function

# Define functions
def remove_comments(content):
    return comment.sub('', content)

def remove_functions(content):
    return function.sub('', content)
