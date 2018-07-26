module.exports = {
    name : 'Test Plugin',
    init : function(app, db, context){
    },
    handlers: {
        'pre_list' : function(args){
            console.log('pre_listDB', args);
        },
        'post_list' : function(args){
            console.log('post_listDB', args);
        },
        'pre_listDB' : function(args){
            console.log('pre_listDB', args);
        }
    }
}