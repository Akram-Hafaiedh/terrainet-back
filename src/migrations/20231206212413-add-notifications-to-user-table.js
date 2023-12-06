export const up = async (db, client) => {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.collection('users').updateMany(
        {},
        {
            $set: { notifications: [] , notificationPreferences:[]},
        }
    );
};

export const down = async (db, client) => {
    await db.collection('users').updateMany(
        {},
        {
            $unset: { notifications: [] , notificationPreferences:[]},
        }
    );
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
