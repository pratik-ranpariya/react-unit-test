import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editedUser, setEditedUser] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setEditedUser({ name: data.name, email: data.email });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUser(updatedUser);
      setMessage("User updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUser(null);
      setMessage("User deleted successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p data-testid="loading">Loading...</p>;
  if (error) return <p data-testid="error">{error}</p>;

  return (
    <div>
      {user ? (
        <>
          <h2 data-testid="user-name">{user.name}</h2>
          <p data-testid="user-email">{user.email}</p>
          <button data-testid="edit-btn">Edit User</button>
          <button data-testid="delete-btn" onClick={handleDelete}>Delete User</button>
          <input
            data-testid="user-name-input"
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          />
          <input
            data-testid="user-email-input"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
          <button data-testid="save-btn" onClick={handleEdit}>Save Changes</button>  {/* ✅ Fix: Add Save Button */}
        </>
      ) : (
        <p data-testid="no-user">No user found</p>
      )}
      {message && <p data-testid="message">{message}</p>}
    </div>
  );
};

export default UserProfile;
