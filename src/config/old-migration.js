import { MongoClient } from "mongodb";
import { calculateEndTime, convertToTime } from "./utils.js";

async function runMigration() {
    const uri = "mongodb://127.0.0.1:27017/todo";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db();
        const collection = database.collection('reservations');

        // Migartion logic 
        const reservationsToUpdate = await collection.find().toArray();
        console.log("🚀 ~ file: migration.js:15 ~ runMigration ~ reservationsToUpdate:", reservationsToUpdate)

        // Assuming startTime exists, update endTime based on some logic
        for (const reservation of reservationsToUpdate) {
            var startTime;
            if (reservation.time) {
                startTime = convertToTime(reservation.time, 1) // Set a default time if 'time' is not available

            } else {
                startTime = new Date();
            }
            const endTime = calculateEndTime(startTime, 1)

            // update the document
            await collection.updateOne(

                { _id: reservation._id },
                {
                    $set: {
                        // startTime: new Date(reservation.time),
                        startTime,
                        endTime,
                    },
                    // $unset: { time: 1 },
                }

            )
            console.log(`Updated reservation ${reservation._id}: startTime=${startTime}, endTime=${endTime}`);
        }
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed', error);
    } finally {
        await client.close()
    }
}


runMigration();



