const { Sequelize} = require('sequelize');// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql', // Change to your database dialect
  username: 'financeApp',
  password: '12345',
  database: 'financeapp',
  host: 'localhost',
});

//Check if the connection is successful
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// Define a User model
// const User = sequelize.define('User', {
//   firstName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     require:true
//   },
//   userId:{
//     type: DataTypes.INTEGER,
//     primaryKey:true,
//     autoIncrement:true
  
//   },
//   userName:{
//     type: DataTypes.STRING,
//     allowNull:false,
//     require:true,
//     unique:true
//   },
//   password:{
//     type: DataTypes.STRING,
//     allowNull:false,
//     require:true
//   },
//   userRole:{
//     type: DataTypes.STRING,
//     allowNull:false,
//     require:true
//   }
  
// });
module.exports = sequelize;
// Sync the model with the database (optional if using migrations)
// await User.sync({force:true});

// // Example usage
// const user = await User.create({
//   firstName: 'John',
//   userName: 'zena',
//   password: 'password123',
//   userRole: 'admin',
// });

// console.log(user.toJSON());

// module.exports ={ User}