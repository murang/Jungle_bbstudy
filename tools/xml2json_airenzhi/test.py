import xml.dom.minidom
import json
import sys
 
reload(sys)
sys.setdefaultencoding('utf-8')

dom = xml.dom.minidom.parse('config.xml')
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

f = open('config.json', 'w+')
f.write(json.dumps(data_j,ensure_ascii=False))
f.close()
