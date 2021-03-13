const mongoose = require('mongoose'); 
const { User } = require('./models/userModel');
const { initData } = require('./utils/initialData');

// DB coonection
exports.configureDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ranganathmd:uOgKDhu9ZAhmOrnv@developeracc.xzfvx.mongodb.net/dev-sahaaya?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    console.log("Connected to db")

    initData.forEach(async (data) => {
      const admin = await User.findOne({ email: data.email });
      if(!admin){
        const user = new User(data)
        user.save();
        console.log("Saved initial data.........")
      }else {
        console.log("initial data present already")
        return null;
      }
    })
  }catch(err){
    console.log("Something went wrong")
  }
}
