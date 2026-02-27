const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { seedDefaultDoctors } = require("./services/doctorSeedService");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startHttpServer = () =>
  new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => resolve(server));
    server.on("error", (error) => reject(error));
  });

const startServer = async () => {
  try {
    await startHttpServer();
    console.log(`Server running on http://localhost:${PORT}`);

    const immediateSeedCount = await seedDefaultDoctors();
    if (immediateSeedCount > 0) {
      console.log(`Seeded ${immediateSeedCount} default doctor account(s) for startup.`);
    }

    const connected = await connectDB();
    if (!connected) {
      console.log("Database mode: in-memory");
    } else {
      const mongoSeedCount = await seedDefaultDoctors();
      if (mongoSeedCount > 0) {
        console.log(`Seeded ${mongoSeedCount} default doctor account(s) in MongoDB.`);
      }
    }
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop the existing process or change PORT in backend/.env (example: PORT=5001).`
      );
      process.exit(1);
    }

    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
