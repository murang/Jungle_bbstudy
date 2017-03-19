#这个用来转换爱认知的资源里面的xml为json
#爱认知的资源目录为data 在同级目录下建立一个conten文件夹 运行这个py就可以生成对应目录的content.json
#json文件包含了当前小项目的中英文主题  以及中英文内容


import xml.dom.minidom
import json
import sys
import os

reload(sys)
sys.setdefaultencoding('utf-8')

rootdir = sys.path[0]+'/data'
for subdir in os.listdir(rootdir):
	print subdir
	paths_xml = (rootdir, subdir, 'res', 'card','config.xml')
	xml_url = '/'.join(paths_xml)
	paths_json = (rootdir, subdir, 'res', 'card','config.json')
	json_url = '/'.join(paths_json)
	json_dir = './content/' + subdir
	os.mkdir(json_dir)

	dom = xml.dom.minidom.parse(xml_url)
	root = dom.documentElement

	title_cn = root.getAttribute('cnTop')
	title_en = root.getAttribute('enTop')

	str_items_cn = []
	str_items_en = []
	items = root.getElementsByTagName("item")
	for index in range(len(items)):
		item_cn = items[index].getAttribute("cn")
		item_en = items[index].getAttribute("en")
		str_items_cn.append(item_cn)
		str_items_en.append(item_en)

	data_j = {'title_cn':title_cn, 'title_en':title_en, 'str_items_cn':str_items_cn, 'str_items_en':str_items_en}

	f = open(json_dir + '/content.json', 'w+')
	f.write(json.dumps(data_j,ensure_ascii=False))
	f.close()


