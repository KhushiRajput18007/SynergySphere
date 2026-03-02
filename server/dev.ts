import "dotenv/config";
import { createServer } from "./index.ts";

const app = createServer();
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`🚀 Dev API server running on http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
});
