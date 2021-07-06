const mongoose = require('mongoose');
const schema = mongoose.Schema;
const savedDataSchema = new schema(
    {
         uId :
         {
           type : String,
           required : true  
         },
         date: 
         {
            type : String,
            required : true
         },
         fromCur:
         {
            type : String,
            required : true
         },
         toCur:{
            type : String,
            required : true
         },
         fromVal:{
            type : Number,
            required : true
         },
         toVal:{
            type : Number,
            required : true
         }
    }
);
module.exports = mongoose.model('SavedData',savedDataSchema);