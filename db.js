
const mongoose = require('mongoose');

async function main() {
  const url = "mongodb+srv://root:pass%40123@cluster0.j41p0ty.mongodb.net/To-Do-List?retryWrites=true&w=majority&appName=Cluster0"

  await mongoose.connect(url);
  console.log("MongoDB connected");
}

main().catch(err => console.log(err));

module.exports = main;