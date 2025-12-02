import "dotenv/config";
import web from "./middleware/web.js";
import { initializeSocket } from "./utils/socket.js";

const PORT = process.env.PORT || 3000;

const server = web.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

initializeSocket(server);
