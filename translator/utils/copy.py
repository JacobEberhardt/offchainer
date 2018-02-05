# Import depedencies
from shutil import copy2
from os import path, walk, makedirs 

def is_file(filepath):
    last = filepath.split(path.sep)[-1]
    return last == 'Dockerfile' or last.find('.') is not -1

def copy(src, dst):
    if not path.isdir(src):
        filename = path.basename(src)
        dst_dir = dst
        if is_file(dst):
            dst_dir = path.dirname(dst)
        if not path.exists(dst_dir):
            makedirs(dst_dir)
        copy2(src, dst_dir)
    else:
        for _, dirs, files in walk(src):
            for dir in dirs:
                dir = path.join(src, dir)
                print(dir)
                makedirs(dir)
                copy(dir, dst)
            for file in files:
                file = path.join(src, file)
                copy(file, dst)
