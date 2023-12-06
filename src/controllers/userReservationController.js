export default class userReservationController  {
    async getUserReservations(req, res) {
        try {
            // eager loding the reservations with the user
            const userId = req.params.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // console.log("🚀 ~ file: userController.js:77 ~ getUserReservations ~ userId:", userId)
            // console.log("🚀 ~ file: userController.js:78 ~ getUserReservations ~ page:", page)
            // console.log("🚀 ~ file: userController.js:79 ~ getUserReservations ~ limit:", limit)

            const user = await User.findById(userId).populate({
                path: 'reservations',
                options: {
                    skip: (page - 1) * limit,
                    limit: limit,
                }
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.reservations) {
                console.error('Error populating reservations:', user);
                return res.status(500).json({ messsage: 'Error populating reservations' })
            }
            const reservations = user.reservations;

            // res.status(200).json(user.reservations);
            res.status(200).json({
                totalReservations: reservations.length,
                currentPage: page,
                totalPages: Math.ceil(reservations.length / limit),
                reservations: reservations.slice((page - 1) * limit, page * limit)
            });

        } catch (error) {
            console.error('Error fetching user reservations:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getUserReservationById(req, res) {
        try {
            const { userId, reservationId } = req.params

            const user = await User.findById(userId).populate({
                path: 'reservations',
                match: { '_id': reservationId },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const reservation = user.reservations.find((r) => r._id.equals(reservationId))
            if (!reservation) {
                return res.status(404).json({ message: 'Reservation not found for the user' });
            }
            res.status(200).json(reservation)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
            console.log(error);
        }
    }
}