require("dotenv").config();
const app = require("./src/app");
const connectionDB = require("./src/config/db");

const dbUri = process.env.DB_URI || process.env.DB_URL;
if (!dbUri) {
  console.error("Missing database URI. Set DB_URI or DB_URL in .env");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
    await connectionDB(dbUri);
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
})();
