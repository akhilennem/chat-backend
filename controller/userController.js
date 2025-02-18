const User = require("../models/user");
const bcrypt = require('bcryptjs');

exports.addUser =  async (req,res) =>{
    try {
        let data = req.body;
        console.log(data)
        data.password= await bcrypt.hash(data.password,10)
       
        const userData = new User(data)

        const result = await userData.save()
        if(result){
            return res.send({message:"Success",success:true})
        }
        else{
            return res.send({message:"Failed",success:false})
        }

    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req,res)=>{
    try {
        console.log("entered")
        const data={email,password} = req.body;
    const resp = await User.findOne({
        email:data.email
    })
    if(resp){
        const comparepass=await bcrypt.compare(data.password,resp.password)
        if(comparepass){
            return res.send({message:"login success",success:true})
        }else{
        return res.send({message:"Failed",success:false})
        
    }
    }else{
    
            return res.send({message:"mail not exists"})
    

    }
 } catch (error) {
        
    }
}


exports.updateUser = async (req,res)=>{
    try {
        
        const data = req.body;
        console.log(data)
        const updateUser = await User.findOneAndUpdate({_id:data.id},data)
        if(updateUser){
            return res.send({message:"Success",data:updateUser})
        }
        else{
            return res.send({message:"Failed"})
        }
 } catch (error) {
        
    }
}


exports.deleteUser = async (req,res)=>{
    try {
        
       const id = req.query.id;
       console.log(id)
       const delteUser = await User.deleteOne({_id:id})

        if(delteUser.deletedCount > 0){
            return res.send({message:"Success",data:updateUser})
        }
        else{
            return res.send({message:"Failed"})
        }
 } catch (error) {
        
    }
}




exports.addShop =  async (req,res) =>{
    try {
        let data = req.body;
        console.log(data)
       
        const shopData = new Shop(data)

        const result = await shopData.save()
        if(result){
            return res.send({message:"Success"})
        }
        else{
            return res.send({message:"Failed"})
        }

    } catch (error) {
        console.log(error);
    }
}


// exports.getUser = async (req,res)=>{
//     try {
//         console.log("entered")
       
//         const data={email,password} = req.body;
//         console.log(data.email) 
//         const pipeline = [
//             {
//               $match: {
//                 email: data.email,
//               },
//             },
//             {
//               $lookup: {
//                 from: "shops",
//                 localField: "email",
//                 foreignField: "useremail",
//                 as: "shopdata",
//               },
//             },
//            ]
//             const resp= await User.aggregate(pipeline)
//             console.log(resp)
//     if(resp.length>0){
//         // const comparepass=await bcrypt.compare(data.password,resp.password)
//         // if(comparepass){
//             return res.send({message:"login success",resp})
//         // }else{
//         return res.send({message:"Failed"})
        
//     // }
//     }else{
    
//             return res.send({message:"mail not exists"})
    

//     }
//  } catch (error) {
        
//     }
// }