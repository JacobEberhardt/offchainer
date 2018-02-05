# Import depedencies
from shutil import copy2
from os import path, listdir, makedirs 

def is_file(filepath):
    last = filepath.split(path.sep)[-1]
    return last == 'Dockerfile' or last.find('.') is not -1

def copy(src, dst):
    if not path.isdir(src):
        dst_dir = dst
        if is_file(dst):
            dst_dir = path.dirname(dst)
        if not path.exists(dst_dir):
            makedirs(dst_dir)
        copy2(src, dst_dir)
    else:
        for blob in listdir(src):
            copy(path.join(src, blob), path.join(dst, blob))
