export const stripHtmlTags = (html) => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Function to encrypt/mask sensitive IDs like wallet IDs
export const encryptWalletId = (walletId) => {
  if (!walletId) return "N/A";
  
  // Convert to string in case it's a number
  const id = String(walletId);
  
  // If ID is too short, just return asterisks
  if (id.length <= 4) {
    return "*".repeat(id.length);
  }
  
  // Show only last 4 digits and mask the rest
  const visiblePart = id.slice(-4);
  const maskedPart = "*".repeat(id.length - 4);
  
  return `${maskedPart}${visiblePart}`;
};

/**
 * Format a date according to Vietnamese timezone with locale options
 * @param {Date|string|number} date - The date to format (Date object, ISO string, or timestamp)
 * @param {string} format - Format type: 'full' (default), 'short', 'long', 'datetime', or 'time'
 * @param {string} locale - Locale for formatting: 'vi-VN' (default) or 'en-US'
 * @returns {string} Formatted date string in the specified locale
 */
export const formatDate = (date, format = 'full', locale = 'en-US') => {
  if (!date) return 'N/A';
  
  // Convert to Date object if it's not already
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  const options = {
    timeZone: 'Asia/Ho_Chi_Minh' // Vietnam timezone
  };
  
  switch (format) {
    case 'short':
      // Format: MM/DD/YYYY (en-US) or DD/MM/YYYY (vi-VN)
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      break;
      
    case 'long':
      // Format: Month DD, YYYY (en-US) or DD tháng MM năm YYYY (vi-VN)
      options.day = '2-digit';
      options.month = 'long';
      options.year = 'numeric';
      break;
      
    case 'datetime':
      // Format: MM/DD/YYYY, HH:MM (en-US) or DD/MM/YYYY, HH:MM (vi-VN)
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
      
    case 'time':
      // Format: HH:MM AM/PM (en-US) or HH:MM (vi-VN)
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
      
    case 'full':
    default:
      // Format: Day, Month DD, YYYY (en-US) or Thứ, DD tháng MM năm YYYY (vi-VN)
      options.dateStyle = 'full';
      break;
  }
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

// Keep the original formatDateVN function for backward compatibility
export const formatDateVN = (date, format = 'full') => {
  return formatDate(date, format, 'en-US');
};

/**
 * Get background color for a season value
 * @param {string} seasonValue - The season value to get background color for
 * @returns {string} Tailwind background color class
 */
export const getBgColorForSeason = (seasonValue) => {
  const colorMap = {
    'spring': 'bg-green',
    'summer': 'bg-yellow',
    'autumn': 'bg-orange',
    'winter': 'bg-primary',
    'christmas': 'bg-red',
    'new-year': 'bg-purple'
  };

  return colorMap[seasonValue] || 'bg-primary';
};

/**
 * Get season configuration including icon and background color
 * @param {string} seasonName - The name of the season to get configuration for
 * @param {Array} seasons - Array of season objects from constants
 * @returns {Object} Season configuration with icon and background color
 */
export const getSeasonConfig = (seasonName, seasons) => {
  // Find the matching season from constants
  const season = seasons.find(
    s => s.label.toLowerCase() === seasonName.toLowerCase() ||
    s.value.toLowerCase() === seasonName.toLowerCase()
  );

  if (season) {
    return {
      icon: season.icon,
      bgColor: getBgColorForSeason(season.value)
    };
  }

  // Default configuration if no match found
  return {
    icon: seasons[0].icon,
    bgColor: "bg-primary"
  };
};


