export const up = async (db, client) => {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    // Loop through existing users without a profile
    const usersWithoutProfile = await db.collection('users').find({ profileId: { $exists: false } }).toArray();
    const profiles = usersWithoutProfile.map(user => ({
        user: user._id,
        firstName: 'Default',
        lastName: 'User',
    }))
    await db.collection('profiles').insertMany(profiles);
};

export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
