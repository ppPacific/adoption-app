import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { dogs } from "./db/schema.js";
import {desc} from "drizzle-orm";
// import rateLimiter from "./middleware/rateLimiter.js";

// import job from "./config/cron.js";


const app = express();

// if (process.env.NODE_ENV === "production") job.start();

// // middleware
// app.use(rateLimiter);
app.use(express.json()); //so to destructure from req body

// our custom simple middleware
// app.use((req, res, next) => {
//   console.log("Hey we hit a req, the method is", req.method);
//   next();
// });

const PORT = ENV.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});
app.post("/api/dog", async (req, res) => {
  try {
    const { name, slug, sex, breed, ageMonths,size,color,description,searchTags,adoptionStatus,kennelLocation, featured } = req.body;

    if (!name || !slug || !sex || !breed ||!description ||!searchTags ||!adoptionStatus ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newDog = await db
        .insert(dogs)
        .values({
          name,
          slug,
          sex,
          breed,
          ageMonths,
          size,
          color,
          description,
          searchTags,
          adoptionStatus,
          kennelLocation, featured
        })
        .returning();

    res.status(201).json(newDog[0]);
  } catch (error) {
    console.log("Error adding dog", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get("/api/dogs", async (req, res) => {
    try {

        const allDogs = await db.select().from(dogs).orderBy(desc(dogs.createdAt));

        res.status(200).json({
            success: true,
            data: allDogs,
        });

    } catch (error) {
        console.log("Error fetching the dogs", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
// app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
//     try {
//         const { userId, recipeId } = req.params;
//
//         await db
//             .delete(favoritesTable)
//             .where(
//                 and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
//             );
//
//         res.status(200).json({ message: "Favorite removed successfully" });
//     } catch (error) {
//         console.log("Error removing a favorite", error);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

// initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT)
  });
// });
