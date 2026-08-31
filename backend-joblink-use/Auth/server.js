import mongoose from "mongoose";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import config from "./src/config/config.js";

const PORT = config.PORT;


// Start application
const startServer = async () => {
    try {
        // Connect MongoDB first
        await connectDB();

        // Start HTTP server only after DB connection succeeds
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });


        // Graceful shutdown
        const shutdown = async () => {
            console.log("\nShutting down server...");

            try {
                await mongoose.connection.close();

                server.close(() => {
                    console.log("Server closed.");
                    process.exit(0);
                });

            } catch (error) {
                console.error(
                    "Error during shutdown:",
                    error
                );

                process.exit(1);
            }
        };


        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
};


startServer();