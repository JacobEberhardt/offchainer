# Import dependencies
import re

# Define expressions
contract_name = re.compile('contract ([A-Za-z]+)[\s]*{(?:[^{}]*{[^}]*})*[^}]*}')
function = re.compile('(function[\s]+(?:[A-za-z]+)[^\{]+{(?:[^{}]*{[^}]*})*[^}]*})')
state_variable = re.compile('(uint[\d]{0,3}|string|bool)(?:\[([\d]+)\])*[\s]+([A-Za-z]+)[\s]*;')
comment = re.compile('(?:\/\/.*)|(?:\/\*[\S\s]*?\*\/)')
