import React, { useEffect, useState } from "react";
import { Button } from "../components/ui.jsx";
import { CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const Renewal = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/licenseS/");
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setError("Failed to load subscriptions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/profile/");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile.");
      }
    };

    fetchSubscriptions();
    fetchUserProfile();
  }, []);

  const filteredSubscriptions =
    filter === "all"
      ? subscriptions
      : subscriptions.filter((sub) => sub.status === filter);

  return (
    <>
      {userProfile ? (
        <div className="card">
          <div className="card-content">
            <div className="flex-space-x">
              <img
                src={userProfile.avatar || "/icons/avatar.png"}
                alt="avatar"
                className="avatar"
              />
              <div>
                <p className="user-name">{userProfile.first_name}</p>
                <p className="user-bio">{userProfile.bio}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray">Loading user profile...</p>
      )}

      <div className="filter-buttons">
        <button
          className={`button ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Active</span>
        </button>

        <button
          className={`button ${filter === "expired" ? "active" : ""}`}
          onClick={() => setFilter("expired")}
        >
          <Clock className="w-4 h-4 text-yellow-500" />
          <span>Expired</span>
        </button>
      </div>

      <div>
        <div className="subscription-header">
          <h3>Current Subscriptions</h3>
          <span className="show-all" onClick={() => setFilter("all")}>
            Show all
          </span>
        </div>

        {loading ? (
          <div className="text-center text-gray">Loading...</div>
        ) : error ? (
          <p className="text-center text-red">{error}</p>
        ) : filteredSubscriptions.length === 0 ? (
          <p className="text-center text-gray">No subscriptions found.</p>
        ) : (
          <div className="space-y-2">
            {filteredSubscriptions.map((sub, idx) => (
              <motion.div
                key={sub.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="subscription-box">
                  <img
                    src={sub.icon || "/icons/default.png"}
                    alt={sub.name}
                    className="subscription-icon"
                  />
                  <div className="subscription-name">{sub.service_provider}</div>
                  <p
                    className={`subscription-price ${
                      sub.status === "expired" ? "expired" : ""
                    }`}
                  >
                    {sub.price} Ksh/Month
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <style>
            {
                `
                /* Card-style container */
.card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  padding: 0.75rem;
}

/* Flex layout for content inside card */
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

/* Flex row spacing */
.flex-space-x {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Avatar styles */
.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
}

/* User info */
.user-name {
  font-weight: 600;
}

.user-bio {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Filter buttons layout */
.filter-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

/* Generic button styling */
.button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.button:hover {
  background-color: #f3f4f6;
}

.button.active {
  background-color: #3b82f6;
  color: white;
  border-color: transparent;
}

/* Header for subscription section */
.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.subscription-header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.show-all {
  font-size: 0.875rem;
  color: #3b82f6;
  cursor: pointer;
}

/* Subscription item layout */
.subscription-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
}

.subscription-box:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* Subscription icon */
.subscription-icon {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

/* Subscription name text */
.subscription-name {
  flex: 1;
  font-weight: 500;
}

/* Subscription price */
.subscription-price {
  font-size: 0.875rem;
  color: #4b5563;
}

.subscription-price.expired {
  color: #ef4444;
}

/* Text helpers */
.text-center {
  text-align: center;
}

.text-gray {
  color: #6b7280;
}

.text-red {
  color: #ef4444;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}
`
            }
        </style>

      </div>
    </>
  );
};

export default Renewal;
