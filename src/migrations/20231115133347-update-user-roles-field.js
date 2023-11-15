export const up = async (db, client) => {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.collection('users').updateMany(
        {},
        {
            $set: {
                roles: ['user'], // Set the default value or adjust based on your logic
            },
        }
    );
};

export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('users').updateMany(
        {},
        {
            $set: {
                roles: 'user', // Set the original default value for a single string
            },
        }
    );
};
