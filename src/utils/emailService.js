// Mock email service - no actual emails will be sent
// This is a temporary solution until email functionality is properly implemented

// Mock initialization function (does nothing)
const initEmailJS = () => {
  console.log('Mock email service initialized');
};

// Mock function for seen email
export const sendItemSeenEmail = async (itemDetails, finderInfo) => {
  // Log what would be sent
  console.log('MOCK: Would send "seen item" email with:', {
    to: itemDetails.email,
    item: itemDetails.itemName,
    finder: finderInfo.name
  });
  
  // Always return success
  return { 
    success: true, 
    message: 'Email would be sent in production' 
  };
};

// Mock function for found email
export const sendItemFoundEmail = async (itemDetails, finderInfo) => {
  // Log what would be sent
  console.log('MOCK: Would send "found item" email with:', {
    to: itemDetails.email,
    item: itemDetails.itemName,
    finder: finderInfo.name
  });
  
  // Always return success
  return { 
    success: true, 
    message: 'Email would be sent in production' 
  };
};

export { initEmailJS, sendItemSeenEmail, sendItemFoundEmail }; 