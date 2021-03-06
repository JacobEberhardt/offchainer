# Import dependencies
import sys
from os import path, getcwd, makedirs, listdir
from utils.check import isContract
from classes.Contract import Contract
from utils.io import copy, render, delete

# Define values
DEFAULT_OPTIONS = {
    'force_overwrite': False,
    'ignore_existing': False,
    'show_analysis': False
}
FLAGS = {
    '--force-overwrite': 'force_overwrite',
    '-f': 'force_overwrite',
    '--ignore-existing': 'ignore_existing',
    '-i': 'ignore_existing',
    '--show-analysis': 'show_analysis',
    '-s': 'show_analysis'
}
FILEDIR = path.dirname(path.realpath(__file__))
WORKDIR = getcwd()
MINIMUM_NUMBER_OF_ARGS = 2
DEFAULT_OUTPUT_DIR = path.join(WORKDIR, 'translator-output')
TEMPLATE_DIR = path.join(FILEDIR, 'templates')

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
MSG_SUCCESS = 'Contract successfully translated.'

# Filter flags
args = list(filter(lambda x: x.find('-') != 0, sys.argv))

# Check number of arguments
if len(args) < MINIMUM_NUMBER_OF_ARGS:
    print(ERROR, ERROR_INVALID_NUMBER_OF_ARGS)
    print(ERROR_USAGE)
    exit(CODE_INVALID_NUMBER_OF_ARGS)

# Parse flags
options = type('Options', (object,), DEFAULT_OPTIONS)() # Hack to avoid class definition
for arg in sys.argv:
    if arg in FLAGS:
        setattr(options, FLAGS[arg], True)

# Check input file
input_file_path = path.join(WORKDIR, args[1])
input_file = path.basename(input_file_path)
if not path.isfile(input_file_path):
    print(ERROR, ERROR_INPUT_EXIST)
    exit(CODE_INPUT_EXIST)

# Check output directory
output_dir = path.join(WORKDIR, args[2]) if len(args) > 2 else DEFAULT_OUTPUT_DIR
if path.exists(output_dir):
    if options.force_overwrite:
        delete(output_dir)
    elif not options.ignore_existing:
        print(ERROR, output_dir, ERROR_OUTPUT_DIR_EXISTS)
        exit(CODE_OUTPUT_EXIST)

# Read input file
content = None
with open(input_file_path) as file:
    content = file.read()
    if not isContract(content):
        print(ERROR, ERROR_INVALID_CONTRACT)
        exit(CODE_INVALID_CONTRACT)

# Parse contract
contract = Contract(content)
if options.show_analysis:
    contract.print()

# Render templates
render(output_dir, TEMPLATE_DIR, contract)

# Print success message
print(MSG_SUCCESS)
