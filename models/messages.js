const mongoose=require('mongoose')

const messageSchema=mongoose.Schema({
    user: {
        type: String
     },
     to: {
        type: String
     },
    // user:{
    //     type:String
    // },
    message:{
        type:String
    }

},{timestamps:true}
)


module.exports = mongoose.model('message',messageSchema)
