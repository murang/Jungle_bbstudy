#uese to move datas

import os
import sys
import shutil

rootdir = sys.path[0]
target_rootdir = sys.path[0]+'/data'
for subdir in os.listdir(rootdir):
	print subdir
	if subdir.endswith('03'):
		orgin_path = rootdir+'/'+subdir
		target_path = './data/'+subdir
		shutil.copytree(orgin_path, target_path)
	