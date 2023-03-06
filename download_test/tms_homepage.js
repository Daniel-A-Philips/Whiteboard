// Purpose:
//  A helper function that returns true when the desired line is passed through
// Inputs:
//  line : A string of a line of HTML
// Output:
//  Returns true if the desired text is within the line, otherwise returns false
// Last edited:
//  March 6th 2023
//  Daniel Philips
function filterHTML(line){
    if(line.includes('class=\"term\"')){
      return true
    }
    else return false
  }
  
  // Purpose:
  //  A function that grabs and parses the body of the TMS homepage,
  //  Finding the term numbers and hyperlinks
  // Inputs:
  //  NONE
  // Output:
  //  Returns a parsed list of terms in the following format
  //    [
  //    [Quarter Title (eg Spring Semester 21-22),
  //     Hyperlink (eg /webtms_du/collegesSubjects/202141;jsessionid=A54F835C01E448B62F3C93D8B2ECAAC0?collCode=)
  //     ]
  //    ]
  // Last edited:
  //  March 6th 2023
  //  Daniel Philips
  async function getTermIDS(){
    console.log('Starting getTermIDS')
    let terms_raw = []
    var url = 'http://termmasterschedule.drexel.edu'
    // Download the hompeage of TMS and get the body, splitting to an array
    const bodyAsArray = (await axios.get(url)).data.split('\n')
    // Filter out all lines that don't contain a term link
    terms_raw = bodyAsArray.filter(filterHTML)
    var terms = []
    terms_raw.forEach( raw => {
      var temp = raw.split('>').slice(2,4)
      // Clean up HTML Code to make readable
      temp[0] = temp[0].substring('&nbsp;&nbsp;<a href="'.length)
      temp[0] = temp[0].substring(0,temp[0].length - 2)
      temp[1] = temp[1].substring(0,temp[1].indexOf('<'))
  
      // Switch the order of the link and the title
      var temp1 = temp[0]
      temp[0] = temp[1]
      temp[1] = temp1
      terms.push(temp)
    })
    return terms
  }

  getTermIDS().then( output => {
    console.log(output)
  })