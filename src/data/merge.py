import json
import os

def format_dict(d):
    if isinstance(d, dict):
        # 递归处理字典的键值对
        formatted_items = []
        for key, value in d.items():
            formatted_value = format_dict(value)  # 递归处理值
            formatted_items.append(f"{key}: {formatted_value}")
        return "{" + ", ".join(formatted_items) + "}"
    elif isinstance(d, list):
        # 处理列表中的嵌套字典
        return "[" + ", ".join(format_dict(item) for item in d) + "]"
    else:
        # 非字典和列表的值，直接转换为 JSON 字符串
        return json.dumps(d)


dir = os.path.dirname(__file__)
files = os.listdir(os.path.join(dir, 'performances_data'))

# generate performance.ts
data = []
for f in files:
    p = os.path.join(dir, 'performances_data', f)
    with open(p) as f:
        d = json.load(f)['data']
        data.extend(d)

with open(os.path.join(dir, 'performance.ts'), 'w') as f:
    f.write(r'import {Performance} from "@/types";')
    f.write('\n')
    f.write(r'export const performances: Performance[] = [')
    f.write('\n')
    for index, item in enumerate(data):
        item['id'] = 'record-{}'.format(index)
        # result = "{" + ", ".join(f"{key}: {json.dumps(value)}" for key, value in item.items()) + "},\n"
        result = format_dict(item)
        f.write(result+',\n')
    f.write(']\n')

# generate tasks.ts
data = []
for f in files:
    p = os.path.join(dir, 'performances_data', f)
    with open(p) as f:
        d = json.load(f)['taskinfo']
        data.append(d)

with open(os.path.join(dir, 'tasks.ts'), 'w') as f:
    f.write(r'import {Task} from "@/types";')
    f.write('\n')
    f.write(r'export const tasks: Task[] = [')
    f.write('\n')
    for index, item in enumerate(data):
        # result = "{" + ", ".join(f"{key}: {json.dumps(value)}" for key, value in item.items()) + "},\n"
        result = format_dict(item)
        f.write(result+',\n')
    f.write(']\n')
