import json
import requests
class tms:
    
    def __init__(self):
        self.download_homepage()


    def get_terms_from_body(self, body):
        return [line for line in body if 'class="term"' in line]


    def download_homepage(self):
        url, terms = 'http://termmasterschedule.drexel.edu', []
        body = requests.get(url).content.decode('utf-8').split('\n')
        terms_raw = self.get_terms_from_body(body)

        for term in terms_raw:
            temp_term = term.split('>')[2:4]
            temp_term[0] = temp_term[0][len('&nbsp;&nbsp;<a href="') - 2:]
            temp_term[1] = temp_term[1][:temp_term[1].index('<')]
            terms.append([temp_term[1], temp_term[0]])

        return terms

    # Takes in the raw html line and extracts the data required from it
    def html_line_parser(self,line):
        return line[line.index('>')+1:len(line)-6]

    def class_page_parser(self, data):
        data = data.split('\n')
        class_data = {}
        for i in range(len(data)):
            if '<td align="center" valign="center">' in data[i]:
                class_data['Subject Code'] = self.html_line_parser(data[i])
                class_data['Course No.'] = self.html_line_parser(data[i+1])
                class_data['Instr Type'] = self.html_line_parser(data[i+2])
                class_data['Instr Method'] = self.html_line_parser(data[i+3])
                class_data['Sec'] = self.html_line_parser(data[i+4])
                class_data['Course Title'] = self.html_line_parser(data[i+13])
                class_data['Days'] = self.html_line_parser(data[i+18])
                class_data['Times'] = self.html_line_parser(data[i+19])
                class_data['Instructor'] = self.html_line_parser(data[i+24])
                return class_data

    def download_class(self, crn, quarter):
        headers = json.loads(open('./TMS_Headers.json','r').read())['headers']
        # Replaces the holder for the session ID with the users ID
        tms_homepage = self.download_homepage()
        jsessionid = tms_homepage[0][1].split(';')[1][tms_homepage[0][1].split(';')[1].index('=')+1:tms_homepage[0][1].split(';')[1].index('?')]
        headers['cookie'] = headers['cookie'].replace('INSERT_SESSION_ID',jsessionid)
        response = requests.post('https://termmasterschedule.drexel.edu/webtms_du/searchCourses', 
                                headers = headers, 
                                data=f'term.termDesc={quarter}&crseTitle=&crseNumb=&crn={crn}&campus.desc=Any')
        data = self.class_page_parser(response.content.decode())

a = tms()
b = a.download_class(crn='33849',quarter='Spring+Quarter 22-23')