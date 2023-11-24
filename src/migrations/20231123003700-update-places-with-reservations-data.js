import { ObjectId } from 'mongodb';
export const up = async (db, client) => {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    // Retrieve all reservations from the database
    const reservations = await db.collection('reservations').find({}).toArray();
    // Update each reservation's associated place
    for (const reservation of reservations) {
        const placeId = reservation.placeId;
        console.log(`Updating place with ID ${placeId} with reservation ID ${reservation._id}`);

        const result = await db.collection('places').updateOne(
            { _id: placeId },
            { $addToSet: { reservations: reservation._id } },
        )

        if (result.matchedCount === 0) {
            console.error(`No matching document found for place ID ${placeId}`);
        } else if (result.modifiedCount === 0) {
            console.error(`No documents were modified for place ID ${placeId}`);
        } else {
            console.log('Update Result:', result);
        }
    }
    console.log('Migration completed.');
};

export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    console.log('Rollback not implemented for this migration');
};
