# Import dependencies
import re

# Define expressions
contract_name = re.compile('contract ([A-Za-z]+)[\s]*{(?:[^{}]*{[^}]*})*[^}]*}')
function = re.compile('(function[\s]+[A-za-z]+[^\{]+{(?:[^{}]*{[^}]*})*[^}]*})')
variable = re.compile('((?:uint[\d]{0,3}|string|bool)(?:\[([\d]+)\])*[\s]+(?:[A-Za-z]+)[\s]*;)')
comment = re.compile('(?:\/\/.*)|(?:\/\*[\S\s]*?\*\/)')

# Variable expressions
variable_combined = re.compile('(uint[\d]{0,3}|string|bool)(?:\[([\d]+)\])*[\s]+([_A-Za-z]+)[\s]*;')
variable_used_template = '(?:\(|=)[^"\'\nA-Za-z]*{}'
variable_changed_template = '{}(?:\[[^\]]+\])?[^\S\n]*[\+-\/]*='

# Function expressions
function_name = re.compile('function[\s]+([A-za-z]+)[\s]*\(')
function_arguments = re.compile('function[\s]+[A-za-z]+[\s]*\(([^\)]*)\)')
function_modifiers = re.compile('function[\s]+[A-za-z]+[\s]*\([^\)]*\)([^\{]*){')
function_body = re.compile('function[\s]+[A-za-z]+[^\{]+{((?:[^{}]*{[^}]*})*[^}]*)}')
