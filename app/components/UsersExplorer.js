"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../lib/api";
import UserCard from "./UserCard";
import UserDetail from "./UserDetail";
import styles from "./UsersExplorer.module.css";

export default function UsersExplorer() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleSelect(userId) {
    setSelectedUserId(userId);
  }

  function handleToggleFavorite(userId) {
    setUsers(
      users.map((item) =>
        item.id === userId ? { ...item, favorite: !item.favorite } : item
      )
    );
  }

  if (loading) {
    return <p className={styles.status}>Loading users...</p>;
  }

  if (error) {
    return <p className={styles.error}>Something went wrong: {error}</p>;
  }

  const favoriteCount = users.filter((user) => user.favorite).length;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleUsers = users
    .filter((user) => user.name.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => Number(b.favorite) - Number(a.favorite));

  return (
    <div className={styles.layout}>
      <section className={styles.list}>
        <div className={styles.toolbar}>
          <label className={styles.searchLabel}>
            <span className={styles.searchLabelText}>Search users</span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          <p className={styles.favoriteCount}>
            {favoriteCount} favorite{favoriteCount === 1 ? "" : "s"} selected
          </p>
        </div>
        {visibleUsers.length === 0 ? (
          <p className={styles.empty}>No users match your search.</p>
        ) : (
          visibleUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isSelected={user.id === selectedUserId}
              onSelect={handleSelect}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        )}
      </section>
      <section className={styles.detail}>
        <UserDetail userId={selectedUserId} />
      </section>
    </div>
  );
}
