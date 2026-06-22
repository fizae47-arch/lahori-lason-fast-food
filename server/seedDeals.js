const mongoose = require('mongoose');
require('dotenv').config();
const Deal = require('./models/Deal');

const seedDeals = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected ✅');

    // Purani deals clear karo
    await Deal.deleteMany();

    await Deal.insertMany([
      {
        name: 'Deal 01',
        items: '1 Small Pizza, 1 Zinger Paratha Roll, Fries, Tin Pack Bottle',
        price: 1040
      },
      {
        name: 'Deal 02',
        items: '1 Open Shawarma, 1 Small Pizza, 1 Zinger Burger, 1 Zinger Paratha, 1 Ltr Bottle',
        price: 1690
      },
      {
        name: 'Deal 03',
        items: '1 Small Shawarma, 1 Zinger Burger, 1 Zinger Paratha, Small Fries, 1 Ltr Bottle',
        price: 1050
      },
      {
        name: 'Deal 04',
        items: '3 Zinger Burger, Hot Short (10 Pcs.), Nuggets (6 Pcs), Large Fries, 1.5 Ltr Bottle',
        price: 2390
      },
      {
        name: 'Deal 05',
        items: '2 Medium Pizza, 2 Zinger Burger, 2 Paratha Roll, 2 Chicken Patti, 1.5 Ltr Bottle',
        price: 3450
      },
      {
        name: 'Deal 06',
        items: '3 Zinger Burger, 3 Medium Shawarma, 1 Ltr Bottle',
        price: 1740
      },
      {
        name: 'Deal 07',
        items: '2 Large Shawarma, 2 Medium Shawarma, 1 Burger Sada, 1 Ltr Bottle',
        price: 1440
      },
      {
        name: 'Deal 08',
        items: '10 Medium Shawarma, 1 Large Fries, 1.5 Ltr Bottle',
        price: 2740
      },
      {
        name: 'Deal 09',
        items: '2 Open Shawarma, 3 Medium Shawarma, Large Fries, 1.5 Ltr Bottle',
        price: 1950
      },
      {
        name: 'Deal 10',
        items: '2 Large Pizza, 4 Zinger Burger, 1 Cake (2 Pound), 1.5 Ltr Bottle',
        price: 4590
      }
    ]);

    console.log('Deals Seeded Successfully! 🎉');
    process.exit();
  } catch (error) {
    console.log('Seeding Error ❌', error);
    process.exit(1);
  }
};

seedDeals();