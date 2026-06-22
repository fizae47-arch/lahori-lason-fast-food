import ChangePassword from './components/ChangePassword';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import OrdersList from './components/OrdersList';
import MenuManagement from './components/MenuManagement';
import CategoryManagement from './components/CategoryManagement';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('pos'); // 'pos', 'orders', 'menu', 'categories'

  const addToCart = (item, price) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item._id && cartItem.price === price
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item._id && cartItem.price === price
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        { id: item._id, name: item.name, price: price, quantity: 1 },
      ]);
    }
  };

  const increaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  const decreaseQty = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    }
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-black via-gray-900 to-black p-5 shadow-lg print:hidden border-b-4 border-yellow-400">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-yellow-400 tracking-wide drop-shadow-lg">
          🍔 LAHORI LASON FAST FOOD
        </h1>
        <p className="text-center text-gray-300 text-xs md:text-sm mt-1">
          Taste & Quality | Gujranwala
        </p>

        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === 'pos'
                ? 'bg-yellow-400 text-black shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🛒 POS
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-yellow-400 text-black shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📋 Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-yellow-400 text-black shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🍔 Menu
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-yellow-400 text-black shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📁 Categories
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-yellow-400 text-black shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🔐 Settings
          </button>
        </div>
      </header>

      {activeTab === 'pos' && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <MenuList addToCart={addToCart} />
          </div>
          <div className="md:w-1/3">
            <Cart
              cart={cart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              removeItem={removeItem}
              clearCart={clearCart}
            />
          </div>
        </div>
      )}

      {activeTab === 'orders' && <OrdersList />}

      {activeTab === 'menu' && <MenuManagement />}

      {activeTab === 'categories' && <CategoryManagement />}

      {activeTab === 'settings' && <ChangePassword />}
    </div>
  );
}

export default App;