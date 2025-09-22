const path = require("path");
const dotenv = require("dotenv");

// Configure dotenv
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
