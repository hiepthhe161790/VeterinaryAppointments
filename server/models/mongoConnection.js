const mongoose = require("mongoose");

mongoose.connect(
	process.env.MONGODB_URI || "mongodb+srv://hiepthhe161790:G2yfYiErDCpL0FTL@cluster0.iqtdu.mongodb.net/MYPET?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	},
	(err) => {
		if (err) throw err;
		console.log("MongoDB connection established");
	}
);

module.exports = mongoose;
