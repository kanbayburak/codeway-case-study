const app = require("./app");

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ Backend running with Firebase on http://localhost:${port}`);
});
