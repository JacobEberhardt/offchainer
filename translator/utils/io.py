# Import depedencies
from shutil import copy2, rmtree
from os import path, listdir, makedirs, remove
from jinja2 import Template

def is_file(filepath):
    last = filepath.split(path.sep)[-1]
    return last == 'Dockerfile' or last.find('.') is not -1

def copy(src, dst):

    # If src is a file
    if not path.isdir(src):

        # Get dirname if dst is file
        dst_dir = dst
        if is_file(dst):
            dst_dir = path.dirname(dst)

        # Create directory if dst_dir doesn't exists
        if not path.exists(dst_dir):
            makedirs(dst_dir)

        # Copy the file
        copy2(src, dst_dir)

    # If src is a directory
    else:

        # For every item in the directory
        for blob in listdir(src):

            # Copy the item
            copy(path.join(src, blob), path.join(dst, blob))

def render(output, filepath, contract):

    # if filepath is a file
    if not path.isdir(filepath):

        # If file is no template file
        if filepath.find('.j2') is not len(filepath) - 3:
            return

        # Get output path
        output_file = '.'.join(path.basename(filepath).split('.')[:-1])
        output_dir = path.dirname(output)
        output_path = path.join(output_dir, output_file)

        # Create output directory if it doesn't exists
        if not path.exists(output_dir):
            makedirs(output_dir)

        # Render template
        template = Template(open(filepath).read())
        with open(output_path, 'w') as file:
            content = template.render(c = contract)
            file.write(content)

    # If filepath is a directory
    else:

        # For every item in the directory
        for blob in listdir(filepath):

            # Render the item
            render(path.join(output, blob), path.join(filepath, blob), contract)

def delete(pth):
    if path.isdir(pth):
        rmtree(pth)
    else:
        remove(pth)
