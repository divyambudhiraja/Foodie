const fs = require("fs");
const connectDB = require("./db");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const importData = async () => {
  try {
    await connectDB();

    const jsonData = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

    const hashedData = await Promise.all(
      jsonData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await User.deleteMany(); // Optional: clear existing data
    await User.insertMany(hashedData);

    console.log("✅ Data successfully imported to MongoDB!");
    process.exit();
  } catch (err) {
    console.error("❌ Error importing data:", err);
    process.exit(1);
  }
};

importData();
