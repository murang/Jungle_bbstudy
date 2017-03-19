#use to classify the files

import os
import sys
import shutil

rootdir = sys.path[0]+'/data'
target_rootdir_pic = sys.path[0]+'/picture'
target_rootdir_aud = sys.path[0]+'/audio'
for subdir in os.listdir(rootdir):
	print subdir
	orgin_path = rootdir+'/'+subdir+'/res/card/'
	target_path_pic = './picture/'+subdir+'/'
	target_path_aud = './audio/'+subdir+'/'
	os.mkdir(target_path_pic)
	os.mkdir(target_path_aud)

	for file in os.listdir(orgin_path):
		if file.endswith('.png'):
			shutil.copy(orgin_path+file,target_path_pic)
		if file.endswith('.ogg'):
			shutil.copy(orgin_path+file,target_path_aud)