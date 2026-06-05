import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Package, CreditCard, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams();
  const showSuccessBanner = searchParams.get('success') === 'true';

  // Toggle state to expand individual order cards
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This will restore product inventory.')) {
      return;
    }

    try {
      await api.put(`/orders/${orderId}/cancel`);
      alert('Order cancelled successfully.');
      fetchOrders(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Packed':
        return 'bg-indigo-100 text-indigo-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Celebration Success Banner */}
      {showSuccessBanner && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center space-y-3 animate-pulse">
          <CheckCircle2 size={36} className="text-green-600 mx-auto" />
          <h2 className="text-xl font-serif font-bold">Order Confirmed!</h2>
          <p className="text-xs text-gray-500 font-sans max-w-md mx-auto leading-relaxed">
            Thank you for purchasing from Vintage Collection. Your transaction was processed successfully. We will pack your luxury traditional garments shortly.
          </p>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">Order History</h1>
        <div className="h-0.5 w-12 bg-gold mt-1"></div>
      </div>

      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-lg shadow-sm space-y-4 max-w-lg mx-auto">
          <Package size={48} className="text-gray-300 mx-auto" />
          <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">No Orders Placed</h2>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            You have not placed any orders yet. Visit our premium store categories to find your styling.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-block bg-charcoal hover:bg-gold text-white hover:text-charcoal px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded transition-all shadow-md"
            >
              Shop Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const canCancel = ['Pending', 'Confirmed', 'Packed'].includes(order.orderStatus);

            return (
              <div
                key={order._id}
                className="bg-white border border-luxuryGray-dark/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                
                {/* Header Summary */}
                <div
                  onClick={() => toggleExpandOrder(order._id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer bg-beige-light/30 border-b select-none hover:bg-beige-light/50 transition-colors"
                >
                  <div className="flex flex-wrap gap-4 sm:gap-8 text-xs">
                    <div>
                      <p className="text-gray-400 font-medium">Order ID</p>
                      <p className="font-bold text-charcoal">{order._id.substring(0, 10)}...</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Date Placed</span>
                      </p>
                      <p className="font-semibold text-charcoal">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Grand Total</p>
                      <p className="font-bold text-gold-dark">₹{order.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Payment</p>
                      <p className="font-semibold text-charcoal">{order.paymentMethod} ({order.paymentStatus})</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 space-y-6 animate-fadeIn">
                    
                    {/* Items List */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal border-b pb-2">Line Items</h4>
                      <div className="divide-y">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex gap-4 py-3 text-xs items-center">
                            <img src={item.image} alt={item.name} className="w-12 h-16 rounded object-cover border" />
                            <div className="flex-grow min-w-0">
                              <h5 className="font-bold text-charcoal truncate">{item.name}</h5>
                              <p className="text-[10px] text-gray-400">
                                Size: <span className="font-semibold text-charcoal">{item.size}</span> | Color:{' '}
                                <span className="font-semibold text-charcoal">{item.color}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-charcoal">₹{item.price * item.quantity}</p>
                              <p className="text-[10px] text-gray-400">₹{item.price} x {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal">Delivery Address</h4>
                        <div className="text-xs text-gray-500 font-sans space-y-1">
                          <p>{order.shippingAddress?.street}</p>
                          <p>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </p>
                          <p>{order.shippingAddress?.postalCode}</p>
                          <p>{order.shippingAddress?.country}</p>
                        </div>
                      </div>

                      {/* Summary calculations & Cancellations */}
                      <div className="space-y-4 text-right self-end">
                        <div className="space-y-1.5 text-xs text-gray-500">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{order.itemsPrice}</span>
                          </div>
                          {order.discountPrice > 0 && (
                            <div className="flex justify-between text-green-700 font-medium">
                              <span>Discount:</span>
                              <span>-₹{order.discountPrice}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Tax (5%):</span>
                            <span>₹{order.taxPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>₹{order.shippingPrice}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-charcoal pt-1.5 border-t">
                            <span>Total Paid:</span>
                            <span className="text-gold-dark">₹{order.totalPrice}</span>
                          </div>
                        </div>

                        {canCancel && (
                          <div className="pt-2">
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="text-xs uppercase tracking-wider font-bold text-red-600 hover:text-red-800 transition-colors border border-red-200 px-4 py-2 bg-red-50 hover:bg-red-100 rounded"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Orders;
