import app from "./app.js";
import DBConnection from './Utils/DBConnection.js';
const PORT = process.env.PORT || 3000;

process.on('uncaughtException',(err)=>{
    console.error(err);
    console.log("UNCAUGHT Exception! Shutting down ...");
    process.exit(1);
});

const server = app.listen(PORT, () => {
    DBConnection();
    console.log(`Server is running on 🚀 http://localhost:${PORT}🚀 `);
  });

  process.on("unhandledRejection", (err) => {
    console.error(err);
    console.log("UNHANDLED REJECTION! Shutting down ...");
    server.close(() => {
      process.exit(1); // Exit the process after closing the server
    });
  });