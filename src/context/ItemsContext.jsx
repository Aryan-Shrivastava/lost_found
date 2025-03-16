import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const ItemsContext = createContext();

// Custom hook to use the context
export const useItems = () => useContext(ItemsContext);

export const ItemsProvider = ({ children }) => {
  // State for lost and found items
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  
  // Load items from localStorage on initial render
  useEffect(() => {
    const storedLostItems = localStorage.getItem('lostItems');
    const storedFoundItems = localStorage.getItem('foundItems');
    
    if (storedLostItems) {
      setLostItems(JSON.parse(storedLostItems));
    }
    
    if (storedFoundItems) {
      setFoundItems(JSON.parse(storedFoundItems));
    }
  }, []);
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
  }, [lostItems]);
  
  useEffect(() => {
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
  }, [foundItems]);
  
  // Add a new lost item
  const addLostItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setLostItems(prevItems => [newItem, ...prevItems]);
    return newItem;
  };
  
  // Add a new found item
  const addFoundItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      status: 'unclaimed',
      createdAt: new Date().toISOString(),
    };
    setFoundItems(prevItems => [newItem, ...prevItems]);
    return newItem;
  };
  
  // Update a lost item
  const updateLostItem = (id, updates) => {
    setLostItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };
  
  // Update a found item
  const updateFoundItem = (id, updates) => {
    setFoundItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };
  
  // Delete a lost item
  const deleteLostItem = (id) => {
    setLostItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Delete a found item
  const deleteFoundItem = (id) => {
    setFoundItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Get user's items
  const getUserItems = (userId) => {
    const userLostItems = lostItems.filter(item => item.userId === userId);
    const userFoundItems = foundItems.filter(item => item.userId === userId);
    return { userLostItems, userFoundItems };
  };
  
  return (
    <ItemsContext.Provider
      value={{
        lostItems,
        foundItems,
        addLostItem,
        addFoundItem,
        updateLostItem,
        updateFoundItem,
        deleteLostItem,
        deleteFoundItem,
        getUserItems
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export default ItemsContext; 