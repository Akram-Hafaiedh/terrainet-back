export const checkUserRole = (allowRoles) => (req, res, next) => {
    const { roles } = req.user //Assuming user information is attached to the request
    if (roles.some((role) => allowRoles.includes(role))) {
        // User has the required role
        return next()
    }
    // NOTE - 403 : Forbidden
    return res.status(403).json({ message: 'Forbidden' })
}

export const checkAdminRole = (req, res, next) => {
    const { user } = req;
    if (!user) {
        // handle the case where there's no user in the resquest
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userRoles = user.roles || []; //Assuming roles is an array on the user object

}