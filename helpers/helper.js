module.exports = {
    productAverage : function(tab){
        let sum=0
        let avg
        for(let i=0;i<tab.length;i++){
            sum+=tab[i].rating
        }
        avg=sum/tab.length
        return avg
    }
}