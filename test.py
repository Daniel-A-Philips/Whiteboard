import requests

headers = {      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "iframe",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "upgrade-insecure-requests": "1",
      "cookie": "apt.uid=AP-PQQY5YJEHTTA-2-1663180781939-68723673.0.2.fcf6507e-23da-4e5c-a886-35ff35396162; BbClientCalenderTimeZone=America/New_York; web_client_cache_guid=a8657b20-4ba5-4a10-824e-26dd498a3aee; apt.sid=AP-PQQY5YJEHTTA-2-1682303314964-15287274; AWSELB=9987079F1C0310C1F6F3C2C0D039DF880E4863507216D3427E29239E543E172295EC3AECDE9CBC17050B0EC66E2617D10CB8C2EB03B8572C5A4497A6A8B2867207039AFC1C; AWSELBCORS=9987079F1C0310C1F6F3C2C0D039DF880E4863507216D3427E29239E543E172295EC3AECDE9CBC17050B0EC66E2617D10CB8C2EB03B8572C5A4497A6A8B2867207039AFC1C; amp_6e403e=HVtq3VCmJNouEl0tfLNdar.ZGFwbG92ZXNwb29jaGllQGdtYWlsLmNvbQ==..1guohesg9.1guoispb3.0.2c.2c; BbRouter=expires:1682315626,id:EFEFC05989E4B7FAAC7E57247B17EF1C,signature:0089ac175acb987e13c5e9288fd2165f6f114b97f0f9fab727c7428c995b8d68,site:0c7fd5ef-a8be-4d47-a1ed-240c8bb3d82b,timeout:10800,user:7397e9f4a2dc4fae86e99e1555d432cf,v:2,xsrf:2b531f09-c2a2-453e-b41f-d3230a8b75ae",
      "Referer": "https://learn.dcollege.net/ultra/courses/_338575_1/cl/outline?legacyUrl=~2Fwebapps~2Fcalendar~2Flaunch~2Fattempt~2F_blackboard.platform.gradebook2.GradableItem-_2979003_1",
      "Referrer-Policy": "strict-origin-when-cross-origin"}



a = requests.get('https://learn.dcollege.net/webapps/calendar/launch/attempt/_blackboard.platform.gradebook2.GradableItem-_2979003_1', headers=headers)
print(a.headers)