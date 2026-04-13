export const getRole = () => localStorage.getItem("userRole");

export const isAdmin = () => {
  return getRole()?.toLowerCase().trim() === "admin";
};

export const isStaff = () => {
  return getRole()?.toLowerCase().trim() === "staff";
};

export const setRole = (role) => {
  localStorage.setItem("userRole", role.toLowerCase().trim());
};

export const clearRole = () => {
  localStorage.removeItem("userRole");
};