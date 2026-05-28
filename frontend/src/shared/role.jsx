// ✅ REFACTORED: Role management utilities with JSDoc comments

/**
 * Get the current user's role from localStorage
 * @returns {string|null} The user's role (admin/staff) or null if not set
 */
export const getRole = () => localStorage.getItem("userRole");

/**
 * Check if the current user is an admin
 * @returns {boolean} True if user role is admin, false otherwise
 */
export const isAdmin = () => {
  return getRole()?.toLowerCase().trim() === "admin";
};

/**
 * Check if the current user is a staff member
 * @returns {boolean} True if user role is staff, false otherwise
 */
export const isStaff = () => {
  return getRole()?.toLowerCase().trim() === "staff";
};

/**
 * Set the current user's role in localStorage
 * @param {string} role - The role to set (admin/staff)
 */
export const setRole = (role) => {
  localStorage.setItem("userRole", role.toLowerCase().trim());
};

/**
 * Clear the current user's role from localStorage
 */
export const clearRole = () => {
  localStorage.removeItem("userRole");
};