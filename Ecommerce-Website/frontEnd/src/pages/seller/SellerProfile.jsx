import React, { useState } from "react";
import "../../styles/customer/Profile.css";
import "../../styles/seller/Profile.css";
import ModalInfo from "../../components/common/modals/ModalInfo";
import ModalEditProfileInfo from "../../components/common/modals/ModalEditProfileInfo";
import { useAuth } from "../../context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faGlobe,
  faTreeCity,
  faMapLocationDot,
  faPhone,
  faHouseFlag,
  faUserPen,
  faRightFromBracket,
  faFilter,
  faSort,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";

import { Pie, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

function SellerProfile() {
  const { logout } = useAuth();
  const [showOrderItem, setShowOrderItem] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();

  const sampleItem = {
    asin: "1233234",
    title: "Hello this is the product",
    final_price: 1323.233,
    currency: "USD",
    categories: ["Sport", "Kitchen", "Bedroom"],
    image_url:
      "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    availability: "Only 10 in stock",
    quantity: 69,
  };

  const soldProduct = {
    labels: ["Iphone 77", "Yoink 28", "FootBall X91", "Water Jug", "Other"],
    datasets: [
      {
        data: [2139, 2222, 3736, 1422, 20000],
        backgroundColor: [
          "#081c15",
          "#1b4332",
          "#2d6a4f",
          "#40916c",
          "#52b788",
          "#74c69d",
          "#95d5b2",
          "#b7e4c7",
          "#d8f3dc",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Income",
        data: [150, 10, 250, 90, 220, 400],
        borderColor: "#40916c",
        backgroundColor: "#1b4332",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#081c15",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#eee",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Updated profile information
  const profileInfo = {
    first_name: "Abusufiyan",
    last_name: "",
    username: "Abusufiyankhan",
    email: "abusufiyan730@gmail.com",
    phone_number: "7738901810",
    address_line1: "Sakinaka Mumbai - 400072",
    address_line2: "",
    gender: "male",
    birthdate: new Date("1997-09-18"),
    country: { value: "IN", label: "India" },
    state: "Maharashtra",
    city: "Mumbai",
    zipcode: "400072",
  };

  const sampleTopCustomer = {
    profile:
      "https://www.mensfitness.com/.image/c_fill,g_faces:center/MjEzNzIxNDM1OTcyMDUyODI5/screenshot-2025-03-24-at-7-33-00-pm.png",
    name: "Mr. Micheal Jackson",
    orderCount: 168,
  };

  return (
    <div className="profile-container">
      <ModalEditProfileInfo
        show={showEdit}
        onClose={() => setShowEdit(false)}
        profileInfo={profileInfo}
      />

      <aside className="sidebar">

        {/* Logout */}
        <div
          className="log-out"
          onClick={() => {
            logout();
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>

        {/* Edit Profile */}
        <div
          className="edit-user-info"
          title="Edit Your Info"
          onClick={() => setShowEdit(true)}
        >
          <FontAwesomeIcon icon={faUserPen} />
        </div>

        {/* Profile Picture */}
        <div className="avatar">
          <img
            src="/profile.png"
            alt="Abusufiyan"
          />
        </div>

        {/* Profile Details */}
        <h2 title="Full Name">Abusufiyan</h2>

        <h3 title="Username">@Abusufiyankhan</h3>

        <p className="dob" title="Birthdate">
          18/09/1997 (28)
        </p>

        <ul className="info">

          {/* Email */}
          <li title="Email">
            <FontAwesomeIcon icon={faEnvelope} /> abusufiyan730@gmail.com
          </li>

          {/* Phone */}
          <li title="Phone">
            <FontAwesomeIcon icon={faPhone} /> 7738901810
          </li>

          {/* Address */}
          <li title="Address Line 1">
            <FontAwesomeIcon icon={faLocationDot} /> Sakinaka Mumbai - 400072
          </li>

          {/* Address Line 2 */}
          <li title="Address Line 2">
            <FontAwesomeIcon icon={faLocationDot} /> Sakinaka Mumbai - 400072
          </li>

          {/* Country */}
          <li title="Country">
            <FontAwesomeIcon icon={faGlobe} /> India
          </li>

          {/* State */}
          <li title="State">
            <FontAwesomeIcon icon={faHouseFlag} /> Maharashtra
          </li>

          {/* City */}
          <li title="City">
            <FontAwesomeIcon icon={faTreeCity} /> Mumbai
          </li>

          {/* ZIP Code */}
          <li title="ZIP Code">
            <FontAwesomeIcon icon={faMapLocationDot} /> 400072
          </li>

        </ul>
      </aside>

      <main className="main">

        {/* Statistics */}
        <section className="stats">

          <div className="stat-box">
            <Doughnut
              data={soldProduct}
              options={{ cutout: "65%" }}
            />

            <h3>Top Ordered Product Stats</h3>

            <p>
              <strong>Total Order:</strong> 10,365 orders
            </p>

            <p>
              <strong>Total Product Sell:</strong> 179
            </p>
          </div>

          <div className="stat-box">
            <Line
              data={lineData}
              options={lineOptions}
            />

            <h3>Total Income</h3>

            <p>
              <strong>Total:</strong> $22099
            </p>

            <p>
              <strong>Average Income:</strong> $61
            </p>
          </div>

        </section>

        {/* Top Customer */}
        <section className="top-customer">

          <h3>Top Customer</h3>

          <div className="customer-card-container">

            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />
            <CustomerCard customer={sampleTopCustomer} />

          </div>
        </section>

        {/* Order History */}
        <section className="profile-stats">

          <div className="table-title">

            <h3>Your Orders History</h3>

            <div className="table-title-right">

              {/* Status Filter */}
              <div>
                <h4>
                  <span>
                    <FontAwesomeIcon icon={faFilter} />
                  </span>
                  Status
                </h4>

                <select defaultValue={"date"}>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="processing">Processing</option>
                  <option value="shipping">Shipping</option>
                </select>
              </div>

              {/* Sorting */}
              <div>
                <h4>
                  <span>
                    <FontAwesomeIcon icon={faSort} />
                  </span>
                  Sorting
                </h4>

                <select defaultValue={"date"}>
                  <option value="date">
                    Sort By Order Date
                  </option>

                  <option value="price">
                    Sort By Order Price
                  </option>
                </select>
              </div>

              {/* Sorting Order */}
              <div>
                <h4>
                  <span>
                    <FontAwesomeIcon icon={faArrowsUpDown} />
                  </span>
                  Sorting Order
                </h4>

                <select defaultValue={"ascending"}>
                  <option value="descending">
                    Ascending Order
                  </option>

                  <option value="ascending">
                    Descending Order
                  </option>
                </select>
              </div>

            </div>
          </div>

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date-Time</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>Payment Method</th>
                  <th>Delivery Option</th>
                </tr>
              </thead>

              <tbody>

                {/* Order 1 */}
                <tr>
                  <td>93e32377DDD</td>
                  <td>25.08.2022</td>

                  <td className="status delivered">
                    <select defaultValue="delivered">
                      <option value="delivered">Delivered</option>
                      <option value="shipping">Shipping</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>$ 1923</td>
                  <td>ABA</td>
                  <td>Standard Delivery</td>

                  <td className="order-details">
                    <button onClick={() => setShowOrderItem(true)}>
                      Details
                    </button>
                  </td>
                </tr>

                {/* Order 2 */}
                <tr>
                  <td>93e32377DDD</td>
                  <td>25.08.2022</td>

                  <td className="status cancelled">
                    <select defaultValue="cancelled">
                      <option value="delivered">Delivered</option>
                      <option value="shipping">Shipping</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>$ 1923</td>
                  <td>ABA</td>
                  <td>Standard Delivery</td>

                  <td className="order-details">
                    <button onClick={() => setShowOrderItem(true)}>
                      Details
                    </button>
                  </td>
                </tr>

                {/* Order 3 */}
                <tr>
                  <td>93e32377DDD</td>
                  <td>25.08.2022</td>

                  <td className="status processing">

                    <select defaultValue="processing">
                      <option value="delivered">Delivered</option>
                      <option value="shipping">Shipping</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                  </td>

                  <td>$ 1923</td>
                  <td>ABA</td>
                  <td>Standard Delivery</td>

                  <td className="order-details">
                    <button onClick={() => setShowOrderItem(true)}>
                      Details
                    </button>
                  </td>
                </tr>

                {/* Order 4 */}
                <tr>
                  <td>93e32377DDD</td>
                  <td>25.08.2022</td>

                  <td className="status shipping">

                    <select defaultValue="shipping">
                      <option value="delivered">Delivered</option>
                      <option value="shipping">Shipping</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                  </td>

                  <td>$ 1923</td>
                  <td>ABA</td>
                  <td>Standard Delivery</td>

                  <td className="order-details">
                    <button onClick={() => setShowOrderItem(true)}>
                      Details
                    </button>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

        {/* Order Details Modal */}
        <ModalInfo
          show={showOrderItem}
          title={"Order Item(s)"}
          onClose={() => setShowOrderItem(false)}
        >
          <div className="order-items-container">

            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />
            <OrderItem product={sampleItem} />

          </div>
        </ModalInfo>

      </main>
    </div>
  );
}

export default SellerProfile;


/* ============================
   Order Item Component
   ============================ */

function OrderItem({ product }) {
  return (
    <div className="order-item" key={product.asin}>

      <p>{product.asin}</p>

      <div className="item-image">
        <img
          src={product.image_url}
          alt={product.title}
        />
      </div>

      <div className="item-details">

        <h2>{product.title}</h2>

        <p className="product-categories">
          {product.categories
            .slice(
              0,
              product.categories.length > 3
                ? 4
                : product.categories.length
            )
            .join(" | ")}
        </p>

        <h4>
          ${product.final_price} {product.currency}
        </h4>

      </div>

      <div className="ordered-item-quantity">
        {product.quantity}
      </div>

    </div>
  );
}


/* ============================
   Customer Card Component
   ============================ */

function CustomerCard({ customer }) {
  return (
    <div className="top-customer-card">

      <div className="profile">
        <img
          src={customer.profile}
          alt={customer.name}
        />
      </div>

      <h2>{customer.name}</h2>

      <h3>
        Total Order From You: {customer.orderCount}
      </h3>

    </div>
  );
}
