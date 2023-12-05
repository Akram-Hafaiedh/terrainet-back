export const up = async (db, client) => {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    const usersCollection = db.collection('users');
    const profilesCollection = db.collection('profiles');

    const usersWithoutProfileId = await usersCollection.find({ profileId: { $exists: false } }).toArray();
    for (const user of usersWithoutProfileId) {
        const userProfile = await profilesCollection.findOne({ user: user._id });
        if (userProfile) {
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { profileId: userProfile._id } }
            );
        }
    }
};

export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
