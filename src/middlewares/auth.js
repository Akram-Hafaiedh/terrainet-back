export const checkUserRole = (allowRoles) => (req, res, next) => {
    //Assuming user information is attached to the request
    const { roles } = req.user
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
        // NOTE - 401 : Unauthorized
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userRoles = user.roles || []; //Assuming roles is an array on the user object
    const requiredRoles = ['admin'];

    const hasAdminRole = requiredRoles.some((role) => userRoles.includes(role))

    if (hasAdminRole) {
        // User has admin role , proceed to the next middleware
        next();
    } else {
        // NOTE - 403 : Forbidden
        return res.status(403).json({ message: 'Forbidden' })
    }

}
// A middleware that checks if a user is authenticated (i.e., if a valid token is present in the request headers).
// req.isAuthenticated is from passport
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // user is authenticated , proceed to go to the next middle or route handler
        return next();
    }
    // NOTE - 401 :  Unauthorized
    return res.status(401).json({ message: 'Unauthorized' });
}


export const isAuthorized = (requiredRoles) => (req, res, next) => {
    const { user } = req;
    if (!user) {
        // handle the case where there's no user in the request
        // NOTE - 401 :  Unauthorized
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const userRoles = user.roles || [];
    if (requiredRoles.every((role) => userRoles.includes(role))) {
        // User has all the required roles, proceed to the next middleware
        next();
    } else {
        // NOTE - 403 : Forbidden
        return res.status(403).json({ message: 'Forbidden' })
    }
}

// Middleware to check if a user is authenticated
export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};


