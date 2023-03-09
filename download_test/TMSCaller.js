export class TMS_Call {

    constructor(sessionID, crn,school,quarterNumber){
        this.sessionID = sessionID
        this.crn = crn
        this.school = school
        this.quarterNumber = quarterNumber
    }

    downloadClassPage() {
        console.log(this.sessionID,',',this.crn,',',this.school,',',this.quarterNumber,)
    }
}