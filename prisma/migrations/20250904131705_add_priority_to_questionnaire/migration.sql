-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Questionnaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "visibility" TEXT NOT NULL DEFAULT 'LOGGED_IN',
    "requiredPlans" TEXT NOT NULL DEFAULT '',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Questionnaire" ("category", "createdAt", "description", "id", "requiredPlans", "slug", "status", "title", "updatedAt", "visibility") SELECT "category", "createdAt", "description", "id", "requiredPlans", "slug", "status", "title", "updatedAt", "visibility" FROM "Questionnaire";
DROP TABLE "Questionnaire";
ALTER TABLE "new_Questionnaire" RENAME TO "Questionnaire";
CREATE UNIQUE INDEX "Questionnaire_slug_key" ON "Questionnaire"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
