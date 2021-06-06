const formatMessage = (username, text) => {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    if(hours > 12){
        return{
            username: username,
            text: text,
            time: (hours-12)+":"+minutes+" "+"pm"
        }
    }
    else{
        return{
            username: username,
            text: text,
            time: hours+":"+minutes+" "+"am"
        }
    }  
}

module.exports = formatMessage;