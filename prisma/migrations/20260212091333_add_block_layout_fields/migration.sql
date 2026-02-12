-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cropType" TEXT,
    "area" REAL,
    "farmId" TEXT NOT NULL,
    "healthStatus" TEXT NOT NULL DEFAULT 'unknown',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "structure" TEXT NOT NULL DEFAULT 'field',
    "color" TEXT NOT NULL DEFAULT 'primary',
    "gridRow" INTEGER NOT NULL DEFAULT 1,
    "gridCol" INTEGER NOT NULL DEFAULT 1,
    "gridRowSpan" INTEGER NOT NULL DEFAULT 1,
    "gridColSpan" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Block_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Block" ("area", "createdAt", "cropType", "farmId", "healthStatus", "id", "name", "progress", "updatedAt") SELECT "area", "createdAt", "cropType", "farmId", "healthStatus", "id", "name", "progress", "updatedAt" FROM "Block";
DROP TABLE "Block";
ALTER TABLE "new_Block" RENAME TO "Block";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
