# A program that downloads all class numbers and names saved on Blackboards Drexel Server
import grequests
import json

responses = []
num_per_test = 100
max = 500000
d = open('course_ids.json')
course_id = {int(k):v for k,v in json.load(d).items()}
keys = list(course_id.keys())
try:
    start = keys[len(keys) - 1]
except:
    start = 0
print(start)
for j in range(start,max,num_per_test):
    f = j+num_per_test
    urls = [f'https://learn.dcollege.net/webapps/assignment/uploadAssignment?content_id=_13149465_1&course_id={id}_1' for id in range(j,f)]
    rs = []
    for d in range(0,num_per_test):
        rs.append(grequests.get(urls[d]))
    print(f'Getting {j}:{f}')
    response = grequests.map(rs,stream=False)
    for response_indv in response:
        try:
            if f'/webapps/blackboard/execute/courseMain?course_id=' in response_indv.text:
                data = response_indv.text.split('\n')[291].split('=')
                id = data[2].split('_')[1]
                name = data[3].split('\"')[1]
                print(id,':',name)
                course_id[id] = name
                response_indv.close()
        except:
            print('No Data Found')
    responses.append(response)

with open("course_ids.json", "w") as outfile:
    json.dump(course_id, outfile)


    