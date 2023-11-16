export const up = async (db, client) => {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.command({
        collMod: 'users',
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                properties: {
                    email: {
                        bsonType: 'string',
                        // Add other properties as needed
                    },
                    // Add other properties as needed
                },
            },
        },
    });
};

export const down = async (db, client) => {

    const usersWithExistingMatch = await db.collection('users').find({ 'email.match': { $exists: true } }).toArray();

    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});

    if (usersWithExistingMatch.length > 0) {
        await db.collection('users').updateMany(
            { 'email.match': { $exists: true } },
            {
                $unset: {
                    'email.match': 1, // remove the match property
                },
            }
        );
    } else {
        // Handle the case where 'email' field doesn't exist in some documents
        console.log("No 'email.match' property found in some documents");
    }
};
