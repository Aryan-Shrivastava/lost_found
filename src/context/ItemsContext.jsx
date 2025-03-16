import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const ItemsContext = createContext();

// Custom hook to use the context
export const useItems = () => useContext(ItemsContext);

export const ItemsProvider = ({ children }) => {
  // State for lost and found items
  const [lostItems, setLostItems] = useState(() => {
    // Initialize state from localStorage on component mount
    try {
      const storedItems = localStorage.getItem('lostItems');
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error loading lost items from localStorage:', error);
      return [];
    }
  });
  
  const [foundItems, setFoundItems] = useState(() => {
    // Initialize state from localStorage on component mount
    try {
      const storedItems = localStorage.getItem('foundItems');
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error loading found items from localStorage:', error);
      return [];
    }
  });
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('lostItems', JSON.stringify(lostItems));
      console.log('Saved lost items to localStorage:', lostItems);
    } catch (error) {
      console.error('Error saving lost items to localStorage:', error);
    }
  }, [lostItems]);
  
  useEffect(() => {
    try {
      localStorage.setItem('foundItems', JSON.stringify(foundItems));
      console.log('Saved found items to localStorage:', foundItems);
    } catch (error) {
      console.error('Error saving found items to localStorage:', error);
    }
  }, [foundItems]);
  
  // Add a new lost item
  const addLostItem = (item) => {
    try {
      const newItem = {
        ...item,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      const updatedItems = [newItem, ...lostItems];
      setLostItems(updatedItems);
      
      // Directly save to localStorage as a backup
      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
      console.log('Added lost item:', newItem);
      
      return newItem;
    } catch (error) {
      console.error('Error adding lost item:', error);
      throw error;
    }
  };
  
  // Add a new found item
  const addFoundItem = (item) => {
    try {
      const newItem = {
        ...item,
        id: Date.now(),
        status: 'unclaimed',
        createdAt: new Date().toISOString(),
      };
      
      const updatedItems = [newItem, ...foundItems];
      setFoundItems(updatedItems);
      
      // Directly save to localStorage as a backup
      localStorage.setItem('foundItems', JSON.stringify(updatedItems));
      console.log('Added found item:', newItem);
      
      return newItem;
    } catch (error) {
      console.error('Error adding found item:', error);
      throw error;
    }
  };
  
  // Update a lost item
  const updateLostItem = (id, updates) => {
    try {
      const updatedItems = lostItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      setLostItems(updatedItems);
      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating lost item:', error);
      throw error;
    }
  };
  
  // Update a found item
  const updateFoundItem = (id, updates) => {
    try {
      const updatedItems = foundItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      setFoundItems(updatedItems);
      localStorage.setItem('foundItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating found item:', error);
      throw error;
    }
  };
  
  // Delete a lost item
  const deleteLostItem = (id) => {
    try {
      const updatedItems = lostItems.filter(item => item.id !== id);
      setLostItems(updatedItems);
      localStorage.setItem('lostItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting lost item:', error);
      throw error;
    }
  };
  
  // Delete a found item
  const deleteFoundItem = (id) => {
    try {
      const updatedItems = foundItems.filter(item => item.id !== id);
      setFoundItems(updatedItems);
      localStorage.setItem('foundItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting found item:', error);
      throw error;
    }
  };
  
  // Get user's items
  const getUserItems = (userId) => {
    try {
      const userLostItems = lostItems.filter(item => 
        item.userId === userId || item.userEmail === userId
      );
      const userFoundItems = foundItems.filter(item => 
        item.userId === userId || item.userEmail === userId
      );
      return { userLostItems, userFoundItems };
    } catch (error) {
      console.error('Error getting user items:', error);
      return { userLostItems: [], userFoundItems: [] };
    }
  };
  
  // Debug function to check localStorage
  const debugStorage = () => {
    console.log('Current localStorage:');
    console.log('lostItems:', JSON.parse(localStorage.getItem('lostItems') || '[]'));
    console.log('foundItems:', JSON.parse(localStorage.getItem('foundItems') || '[]'));
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
        getUserItems,
        debugStorage
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export default ItemsContext; 