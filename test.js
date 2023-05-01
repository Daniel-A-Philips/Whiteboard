const fs = require('fs')

async function test(){
  fetch("https://learn.dcollege.net/webapps/assignment/uploadAssignment?course_id=_341727_1&content_id=_13176041_1&group_id=&mode=view").then( function (response) {
    return response.text()
  }).then(function (html) {
    fs.writeFile('testhtml.html',html, err =>{
      if(err){
        console.log(err)
      }
    })
    if(html.includes('For reference, the Error ID is ')){
      if (count_lines(html)){
        console.log('Correct class number')
      }else{
        console.log('Incorrect Class Number or Assignment Number')
      }
    }else{
      console.log('Incorrect Class Number or Assignment Number')
    }
  }).catch(function(err){
    console.warn('Something went wrong.',err)
  })
  }
  
  function count_lines(html){
      return html.includes('crumb_2')
  }
  
  test()