import Profile from "../models/Profile.js"

export const profileController = {
    // create a profile
    async createProfile(req, res) {
        try {
            const newProfile = new Profile(req.body);
            await newProfile.save();
            //NOTE - 201 : Created , new ressource created
            //NOTE - methods:[POST, PUT]
            res.status(201).json(newProfile);
        } catch (error) {
            //NOTE - 400 : Bad Request , incorrect syntax
            res.status(400).json({ message: error.message });
        }
    },
    // get all profiles
    async getProfiles(req, res) {
        try {
            const places = await Profile.find()
            //NOTE - 200 : OK
            //NOTE - methods: [GET,PUT,POST,HEAD, TRACE]
            res.status(200).json(places);
        } catch (error) {
            // NOTE - 500 : Internal Server Error
            res.status(500).json({ message: error.message })
        }
    },
    // get one profile by id
    async getProfileById(req, res) {
        try {
            const place = await Profile.findById(req.params.id);
            //NOTE - 200 : OK
            //NOTE - methods: [GET,PUT,POST,HEAD, TRACE]
            res.status(200).json(place);
        } catch (error) {
            //NOTE - 404 : Not Found , not found ressource
            // res.status(404).json({ message: error.message });
            res.status(404).json({ message: 'Profile not found' });
        }
    },
    // update a profile by id
    async updateProfileById(req, res) {
        try {
            const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true })
            //NOTE - 200 : OK
            //NOTE - methods: [GET,PUT,POST,HEAD, TRACE]
            res.status(200).json(updatedProfile);
        } catch (error) {
            //NOTE - 404 : Not Found , not found ressource
            // res.status(404).json({message:error.message})
            res.status(404).json({ message: 'Profile not found' });
        }
    },
    // delete a profile by id
    async deleteProfileById(req, res) {
        try {
            await Profile.findByIdAndDelete(req.params.id);
            // NOTE - 204 : No content, no content to send for this request
            res.status(204).end()
        } catch (error) {
            //NOTE - 404 : Not Found , not found ressource
            // res.status(404).json({message:error.message});
            res.status(404).json({ message: 'Profile not found' });
        }
    },
}




