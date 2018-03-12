module.exports = {
    hide: 0,
    logic : function(a){
        console.log(a);
    },
    addOne: function(){
        this.hide++;
        console.log(this.hide);
    }
};
