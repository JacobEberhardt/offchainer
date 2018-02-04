# Import dependencies
import sys
from os import path, getcwd, makedirs
from utils.check import isContract
from classes.Contract import Contract

# Define values
WORKDIR = getcwd()
MINIMUM_NUMBER_OF_ARGS = 2
MAXIMUM_NUMBER_OF_ARGS = 3
DEFAULT_OUTPUT_DIR = path.join(WORKDIR, 'output')

# Define error codes
CODE_INVALID_NUMBER_OF_ARGS = 1 
CODE_INPUT_EXIST = 2
CODE_OUTPUT_EXIST = 3
CODE_INVALID_CONTRACT = 4

# Define error messages
ERROR = sys.argv[0] + ':'
ERROR_USAGE = 'usage: ' + sys.argv[0] + ' [input] [output]'
ERROR_INVALID_NUMBER_OF_ARGS = 'Invalid number of arguments'
ERROR_INPUT_EXIST = 'Input file does not exist'
ERROR_OUTPUT_DIR_EXISTS = 'already exists'
ERROR_INVALID_CONTRACT = 'Input file is not a valid Solidity contract'

# Define messages
MSG_SUCCESS = 'Done'

# Check number of arguments
if len(sys.argv) < MINIMUM_NUMBER_OF_ARGS or len(sys.argv) > MAXIMUM_NUMBER_OF_ARGS:
    print(ERROR, ERROR_INVALID_NUMBER_OF_ARGS)
    print(ERROR_USAGE)
    exit(CODE_INVALID_NUMBER_OF_ARGS)

# Check input file
input_file_path = path.join(WORKDIR, sys.argv[1])
input_file = path.basename(input_file_path)
if not path.isfile(input_file_path):
    print(ERROR, ERROR_INPUT_EXIST)
    exit(CODE_INPUT_EXIST)

# Check output directory
output_dir = path.join(WORKDIR, sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_OUTPUT_DIR
if path.exists(output_dir):
    print(ERROR, output_dir, ERROR_OUTPUT_DIR_EXISTS)
    exit(CODE_OUTPUT_EXIST)

# Read input file
content = None
with open(input_file_path) as file:
    content = file.read()
    if not isContract(file):
        print(ERROR, ERROR_INVALID_CONTRACT)
        exit(CODE_INVALID_CONTRACT)

contract = Contract()
contract.parse(content)
contract.print()
exit(0)

# Write output
makedirs(output_dir)
with open(path.join(output_dir, input_file), 'w') as file:
    file.write(content)

print(MSG_SUCCESS)
