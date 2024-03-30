const { Sequelize } = require("sequelize"); // Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "mysql", // Change to your database dialect
  username: "root",
  password: "$@ry0556",
  database: "fip-database",
  host: "localhost",
  port: "3306",
});

//Check if the connection is successful
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync().then(() => {
  console.log(`Database & tables created!`);
});

module.exports = sequelize;
// Sync the model with the database (optional if using migrations)
// await User.sync({force:true});
