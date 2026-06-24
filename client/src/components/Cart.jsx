import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Cart({ cart, increaseQty, decreaseQty, removeItem, clearCart, onOrderSaved }) {
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const isSavingRef = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const saveOrder = async () => {
    if (cart.length === 0 || isSavingRef.current) return null;

    isSavingRef.current = true;
    const orderData = {
      customerName: 'Walk-in Customer',
      items: cart.map((item) => ({
        menuItem: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: total,
      status: 'delivered',
    };

    try {
      const res = await axios.post(`${API_URL}/api/orders`, orderData);
      console.log("Order Response:", res.data);
      setLastOrder(res.data);
      clearCart();
      if (onOrderSaved) onOrderSaved();
      isSavingRef.current = false;
      return res.data;
    } catch (error) {
      console.log('Save error:', error);
      isSavingRef.current = false;
      return null;
    }
  };

  // ✅ Ctrl+P aur Ctrl+S dono handle
  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Ctrl+P - Save + Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (cart.length > 0) {
          await saveOrder();
          setTimeout(() => window.print(), 150);
        } else if (lastOrder) {
          window.print();
        }
      }

      // ✅ Ctrl+S - Save Only
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (cart.length > 0) {
          setLoading(true);
          await saveOrder();
          setLoading(false);
        } else {
          alert('Cart khali hai!');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, lastOrder]);

  const handleSaveOnly = async () => {
    if (cart.length === 0) {
      alert('Cart khali hai!');
      return;
    }
    setLoading(true);
    await saveOrder();
    setLoading(false);
  };

  const handlePrint = async () => {
    if (cart.length === 0) {
      alert('Cart khali hai!');
      return;
    }
    setLoading(true);
    await saveOrder();
    setTimeout(() => window.print(), 150);
    setLoading(false);
  };

  const getInvoiceNumber = (order) => {
    return order?.invoiceNumber || '----';
  };

  return (
    <div>
      <div className="bg-white p-4 m-4 rounded-lg shadow-md print:hidden">
        <h2 className="text-xl font-bold mb-4">🛒 Cart</h2>

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
            onClick={handleSaveOnly}
            disabled={loading || cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 mb-2"
          >
            {loading ? 'Saving...' : '💾 Save Order Only (Ctrl+S)'}
          </button>

          <button
            onClick={handlePrint}
            disabled={loading || cart.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving & Printing...' : '🖨️ Print & Save Order (Ctrl+P)'}
          </button>
        </div>
      </div>

      {lastOrder && (
        <div className="receipt-print p-2" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          <div className="text-center font-bold" style={{ fontSize: '16px' }}>LAHORI LASON</div>
          <div className="text-center font-bold" style={{ fontSize: '13px' }}>FAST FOOD</div>
          <div className="text-center">G.T Road Near Rahwali Cantt</div>
          <div className="text-center">0345-6199593</div>

          <div style={{ margin: '8px 0' }}></div>

          <div>Invoice #{getInvoiceNumber(lastOrder)}</div>
          <div>Date: {new Date(lastOrder.createdAt).toLocaleDateString('en-GB')} {new Date(lastOrder.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>

          <div style={{ margin: '8px 0' }}></div>

          <div className="flex justify-between font-bold">
            <span>Item</span>
            <span>Qty&nbsp;&nbsp;&nbsp;Price</span>
          </div>

          <div style={{ margin: '8px 0' }}></div>

          {lastOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between" style={{ marginBottom: '4px' }}>
              <span>{item.name.length > 14 ? item.name.slice(0, 13) + '.' : item.name}</span>
              <span>{item.quantity}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.price * item.quantity}</span>
            </div>
          ))}

          <div style={{ margin: '8px 0' }}></div>

          <div className="flex justify-between font-bold" style={{ fontSize: '15px' }}>
            <span>TOTAL</span>
            <span>Rs.{lastOrder.totalAmount}</span>
          </div>

          <div style={{ margin: '8px 0' }}></div>

          <div className="text-center mt-2">Thank You For Visiting</div>
          <div className="text-center">Please Visit Again</div>
        </div>
      )}
    </div>
  );
}

export default Cart;