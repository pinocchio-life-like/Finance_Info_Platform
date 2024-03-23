const { Sequelize } = require("sequelize"); // Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "mysql", // Change to your database dialect
  username: "admin",
  password: "12345678",
  database: "eliyas_test",
  host: "fip-demodb.ckhs9i5s4dyl.us-east-1.rds.amazonaws.com",
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
