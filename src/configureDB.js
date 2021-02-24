const mongoose = require('mongoose'); 

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
    console.log('connected to db')
  }catch(err){
    console.log("Something went wrong")
  }
}
