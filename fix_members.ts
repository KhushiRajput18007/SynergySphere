import "dotenv/config";
import { db } from "./server/db/index.ts";
import { projects, projectMembers } from "./server/db/schema.ts";
import { eq, and } from "drizzle-orm";

async function fix() {
    console.log("Fixing existing memberships...");
    const allProjects = await db.select().from(projects);

    for (const p of allProjects) {
        console.log(`Processing project: ${p.name}`);
        // For existing data, mark all members as accepted so they keep access
        await db.update(projectMembers)
            .set({ status: 'accepted' })
            .where(eq(projectMembers.projectId, p.id));
    }
    console.log("Finished fixing memberships.");
    process.exit(0);
}

fix().catch(err => {
    console.error(err);
    process.exit(1);
});
