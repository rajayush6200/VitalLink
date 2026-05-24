require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("❌ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    // Update password if admin already exists
    await User.updateOne(
      { email: adminEmail, role: "admin" },
      { $set: { password: hashedPassword } }
    );
    console.log("✅ Admin password updated successfully");
  } else {
    // Create new admin
    const admin = new User({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });
    await admin.save();
    console.log("✅ Admin account created successfully");
    console.log("   Email:", adminEmail);
  }

  mongoose.disconnect();
}

seedAdmin().catch(err => {
  console.error("❌ Error:", err);
  mongoose.disconnect();
});
