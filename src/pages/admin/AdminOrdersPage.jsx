import React, { useEffect, useState } from "react";
import { purchaseClient } from "@/api/http";
import { API_ROUTES } from "@/config/api";
import { showApiError } from "@/api/errors";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await purchaseClient.get(API_ROUTES.purchase);
      setOrders(response.data || []);
    } catch (err) {
      showApiError("Fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(query.toLowerCase()) ||
    (o.userEmail || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 p-xl-5">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Customer Orders</h1>
          <p className="text-secondary small mb-0">
            Real-time orders from the DynamoDB <code>orders</code> table.
          </p>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline-primary btn-sm">
          Refresh List
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3 mb-3">
        <div className="card-body py-3">
          <input
            type="search"
            className="form-control"
            placeholder="Search by Order ID or Email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Img</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="fw-medium">{order.orderId.substring(0, 8)}...</td>
                    <td>{order.userEmail || order.userId.substring(0, 8)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        {order.items?.map((item, idx) => (
                          item.image ? (
                            <img 
                              key={idx}
                              src={item.image} 
                              alt={item.name} 
                              className="rounded border bg-white shadow-sm" 
                              style={{ width: 40, height: 40, objectFit: "contain" }}
                            />
                          ) : (
                            <div key={idx} className="bg-light rounded border d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                              <small className="text-muted" style={{ fontSize: '8px' }}>No Img</small>
                            </div>
                          )
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="badge bg-light text-dark border fw-normal">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="fw-bold text-primary">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
