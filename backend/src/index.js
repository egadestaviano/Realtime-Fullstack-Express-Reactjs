import "dotenv/config";
import web from "./middleware/web.js";
const PORT = process.env.PORT || 3000;

web.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
