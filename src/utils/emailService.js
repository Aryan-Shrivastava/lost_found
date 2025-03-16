import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID
// You need to sign up at https://www.emailjs.com/ and get your user ID
const initEmailJS = () => {
  emailjs.init("YOUR_USER_ID"); // Replace with your actual EmailJS User ID
};

// Function to send email when someone has seen the item
export const sendItemSeenEmail = async (itemDetails, finderInfo) => {
  try {
    const templateParams = {
      to_email: itemDetails.email,
      to_name: itemDetails.name,
      from_name: finderInfo.name,
      from_email: finderInfo.email,
      from_phone: finderInfo.phone,
      item_name: itemDetails.itemName,
      location: finderInfo.location,
      message: finderInfo.message,
      date_seen: new Date().toLocaleString(),
      subject: `Someone has seen your lost item: ${itemDetails.itemName}`
    };

    const response = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID_SEEN', // Replace with your EmailJS template ID for "seen" emails
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'Failed to send email. Please try again.' };
  }
};

// Function to send email when someone has found the item
export const sendItemFoundEmail = async (itemDetails, finderInfo) => {
  try {
    const templateParams = {
      to_email: itemDetails.email,
      to_name: itemDetails.name,
      from_name: finderInfo.name,
      from_email: finderInfo.email,
      from_phone: finderInfo.phone,
      item_name: itemDetails.itemName,
      location: finderInfo.location,
      message: finderInfo.message,
      date_found: new Date().toLocaleString(),
      subject: `Great news! Someone has found your lost item: ${itemDetails.itemName}`
    };

    const response = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID_FOUND', // Replace with your EmailJS template ID for "found" emails
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'Failed to send email. Please try again.' };
  }
};

export default {
  initEmailJS,
  sendItemSeenEmail,
  sendItemFoundEmail
}; 