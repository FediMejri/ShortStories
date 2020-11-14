const moment=require('moment')

module.exports={
    truncate: function(str,len){
        if(str.len > len && str.len>0){
            var newStr= str + " "
            newStr=str.substr(0,len)
            newStr=str.substr(0,newStr.lastIndexOf(" "))
            newStr=(newStr.length >0) ? newStr : str.substr(0,len)
            return newStr + "..."
        }
        return str
    },
    formatDate : function(date,format){
        return moment(date).format(format)
    },
    select : function(selected, options){
        return options.fn(this).replace(new RegExp('value=\"'+selected+'\"'),'$& selected="selected"').replace(new RegExp('>'+selected+'</options>'),'selected="selected"$&')
    }
}