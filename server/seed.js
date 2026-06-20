const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected ✅');

    // Purana data clear karo
    await Category.deleteMany();
    await MenuItem.deleteMany();

    // Categories banao
    const categories = await Category.insertMany([
      { name: 'Shawarma' },
      { name: 'Partha Roll' },
      { name: 'Burger' },
      { name: 'Sandwich' },
      { name: 'Fries' },
      { name: 'Continental' },
      { name: 'Drinks' },
      { name: 'Pizza' }
    ]);

    // Easy access ke liye category id nikalo
    const getCatId = (name) => categories.find(c => c.name === name)._id;

    // Menu Items banao
    await MenuItem.insertMany([
      // Shawarma
      { name: 'Small Shawarma', category: getCatId('Shawarma'), price: 190 },
      { name: 'Medium Shawarma', category: getCatId('Shawarma'), price: 250 },
      { name: 'Large Shawarma', category: getCatId('Shawarma'), price: 300 },
      { name: 'Open Shawarma', category: getCatId('Shawarma'), price: 500 },
      { name: 'Chicken Shees Shawarma', category: getCatId('Shawarma'), price: 350 },
      { name: 'Extra Bread', category: getCatId('Shawarma'), price: 50 },
      { name: 'Grill Shawarma', category: getCatId('Shawarma'), price: 350 },
      { name: 'Extra Sauce', category: getCatId('Shawarma'), price: 100 },

      // Partha Roll
      { name: 'Zinger Shawarma Roll', category: getCatId('Partha Roll'), price: 340 },
      { name: 'Chicken Paratha Roll', category: getCatId('Partha Roll'), price: 340 },
      { name: 'Zinger Paratha Roll', category: getCatId('Partha Roll'), price: 350 },
      { name: 'Nugget Paratha Roll', category: getCatId('Partha Roll'), price: 350 },
      { name: 'Kababsh Paratha Roll', category: getCatId('Partha Roll'), price: 350 },

      // Burger
      { name: 'Zinger Burger MR', category: getCatId('Burger'), price: 390 },
      { name: 'Zinger Burger', category: getCatId('Burger'), price: 330 },
      { name: 'Chicken Tikka Burger', category: getCatId('Burger'), price: 320 },
      { name: 'Chicken Patty Burger', category: getCatId('Burger'), price: 340 },
      { name: 'Tower Burger', category: getCatId('Burger'), price: 430 },
      { name: 'Chicken Twist Burger', category: getCatId('Burger'), price: 350 },
      { name: 'Cheese Extra', category: getCatId('Burger'), price: 150 },
      { name: 'Sada Burger', category: getCatId('Burger'), price: 170 },
      { name: 'Chicken Burger', category: getCatId('Burger'), price: 280 },
      { name: 'Double Egg Burger', category: getCatId('Burger'), price: 230 },
      { name: 'Double Shami Burger', category: getCatId('Burger'), price: 230 },
      { name: 'Double Egg Double Shami', category: getCatId('Burger'), price: 270 },

      // Sandwich
      { name: 'Chicken Sandwich', category: getCatId('Sandwich'), price: 300 },
      { name: 'Chicken Club Sandwich', category: getCatId('Sandwich'), price: 400 },
      { name: 'Chicken Tikka Sandwich', category: getCatId('Sandwich'), price: 400 },
      { name: 'Grill Sandwich', category: getCatId('Sandwich'), price: 450 },

      // Fries
      { name: 'Loaded Fries Half', category: getCatId('Fries'), price: 390 },
      { name: 'Loaded Cheese Fries Full', category: getCatId('Fries'), price: 590 },
      { name: 'Fries Small', category: getCatId('Fries'), price: 180 },
      { name: 'Fries Medium', category: getCatId('Fries'), price: 280 },
      { name: 'Fries Large', category: getCatId('Fries'), price: 350 },

      // Continental
      { name: 'Hot Wings', category: getCatId('Continental'), price: 440 },
      { name: 'Bar-B-Q Wings', category: getCatId('Continental'), price: 590 },
      { name: 'Hot Shot (10 Pcs)', category: getCatId('Continental'), price: 590 },
      { name: 'Chicken Strip', category: getCatId('Continental'), price: 350 },
      { name: 'Nuggets (6 Pcs)', category: getCatId('Continental'), price: 450 },
      { name: 'Chicken Piece', category: getCatId('Continental'), price: 250 },

      // Drinks
      { name: 'Regular Drinks', category: getCatId('Drinks'), price: 60 },
      { name: 'Regular Sting', category: getCatId('Drinks'), price: 80 },
      { name: 'NR Bottle', category: getCatId('Drinks'), price: 120 },
      { name: 'NR Sting', category: getCatId('Drinks'), price: 130 },
      { name: 'Half Litter', category: getCatId('Drinks'), price: 120 },
      { name: 'Half Litter Sting', category: getCatId('Drinks'), price: 130 },
      { name: 'Litter Bottle', category: getCatId('Drinks'), price: 170 },
      { name: '1.5 Ltr Bottle', category: getCatId('Drinks'), price: 210 },
      { name: 'Half Litter Water', category: getCatId('Drinks'), price: 60 },
      { name: '1.5 Litter Water', category: getCatId('Drinks'), price: 120 },
      { name: 'Ten Pack', category: getCatId('Drinks'), price: 120 },

      // Pizza (sizes ke saath)
      { name: 'Chicken Tikka Pizza', category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: 'Chicken Fajita Pizza', category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: 'Chicken Supreme Pizza', category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: 'Bar B Q Pizza', category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: "Hot'n & Spicy Pizza", category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: 'Mexican Chilli Pizza', category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: 'Chicken Achari Pizza', category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: 'Chicken Tandouri Pizza', category: getCatId('Pizza'), sizes: { small: 530, medium: 880, large: 1190 } },
      { name: 'Special Kababish Pizza', category: getCatId('Pizza'), sizes: { small: 580, medium: 940, large: 1240 } },
      { name: 'Chicken Lover Pizza', category: getCatId('Pizza'), sizes: { small: 580, medium: 940, large: 1240 } },
      { name: 'Cheese Lover Pizza', category: getCatId('Pizza'), sizes: { small: 580, medium: 940, large: 1240 } },
      { name: 'Kareem Spical Pizza', category: getCatId('Pizza'), sizes: { small: 580, medium: 940, large: 1240 } },
      { name: 'Lahore Lason Special Pizza', category: getCatId('Pizza'), sizes: { small: 580, medium: 940, large: 1240 } },
      { name: 'Pine Apple Pizza', category: getCatId('Pizza'), sizes: { small: 580, medium: 940, large: 1240 } },
      { name: 'Vegetable Pizza', category: getCatId('Pizza'), sizes: { small: 470, medium: 940, large: 1190 } },
      { name: 'Pizza Paratha', category: getCatId('Pizza'), price: 590 },
      { name: 'Chicken Cheese Stick', category: getCatId('Pizza'), price: 590 }
    ]);

    console.log('Menu Seeded Successfully! 🎉');
    process.exit();
  } catch (error) {
    console.log('Seeding Error ❌', error);
    process.exit(1);
  }
};

seedData();