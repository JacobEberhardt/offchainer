# Import dependencies
from . import regexp as reg

# Define functions
def isContract(content):

    # Trivial check for contract syntax
    if reg.contract_name.search(content) is None:
        return False
    else:
        return True
