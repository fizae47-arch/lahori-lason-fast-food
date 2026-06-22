import { useState } from 'react';
import axios from 'axios';

function Cart({ cart, increaseQty, decreaseQty, removeItem, clearCart }) {
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSaveOrder = async () => {
    if (!customerName) {
      alert('Customer name daalna zaroori hai!');
      return;
    }
    if (cart.length === 0) {
      alert('Cart khali hai!');
      return;
    }

    const orderData = {
      customerName: customerName,
      items: cart.map((item) => ({
        menuItem: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: total,
    };

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData);

      setLastOrder(res.data);

      setCustomerName('');
      clearCart();
    } catch (error) {
      alert('Error: Order save nahi hua!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="bg-white p-4 m-4 rounded-lg shadow-md print:hidden">
        <h2 className="text-xl font-bold mb-4">🛒 Cart</h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {cart.length === 0 ? (
          <p className="text-gray-500">No items added yet</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Rs. {item.price} x {item.quantity}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQty(index)} className="bg-gray-300 px-2 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(index)} className="bg-gray-300 px-2 rounded">+</button>
                <button onClick={() => removeItem(index)} className="text-red-600 ml-2">✕</button>
              </div>
            </div>
          ))
        )}

        <div className="mt-4 pt-4 border-t">
          <p className="text-xl font-bold mb-3">Total: Rs. {total}</p>

          <button
            onClick={handleSaveOrder}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Order'}
          </button>

          {lastOrder && (
            <button
              onClick={handlePrint}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 mt-2"
            >
              🖨️ Print Last Receipt
            </button>
          )}
        </div>
      </div>

      {lastOrder && (
        <div className="receipt-print p-4">
          <h2 className="text-center text-xl font-bold">Lahori Lason Fast Food</h2>
          <p className="text-center text-sm">G.T Road Near Rahwali Cantt Gujranwala</p>
          <p className="text-center text-sm mb-4">0345-6199593</p>

          <p>Name: {lastOrder.customerName}</p>
          <p>Date: {new Date(lastOrder.createdAt).toLocaleDateString()}</p>

          <table className="w-full mt-4 border-t border-b">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-right">Price</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {lastOrder.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td className="text-right">{item.price}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-right font-bold mt-4">Total Bill: Rs. {lastOrder.totalAmount}</p>

          <p className="text-center text-sm mt-6">Thank you for visiting Lahori Lason. Please visit again.</p>
        </div>
      )}
    </div>
  );
}

export default Cart;