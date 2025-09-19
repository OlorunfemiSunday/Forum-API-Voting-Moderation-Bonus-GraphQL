module.exports = function(requiredRole) {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      console.warn('RoleCheck: Unauthorized access attempt');
      return res.status(401).json({ error: 'Unauthorized: user not logged in' });
    }

    // Check if user has the required role
    if (req.user.role !== requiredRole) {
      console.warn(`RoleCheck: User role "${req.user.role}" insufficient, requires "${requiredRole}"`);
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
    }

    next();
  };
};
