import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { MIGRATIONS } from '../src/db/schema';

async function migrate(db: any) {
  for (const sql of MIGRATIONS) await db.execAsync(sql);
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="gatheringmia.db" onInit={migrate}>
      <Stack screenOptions={{ headerTitleStyle: { fontSize: 18 } }} />
    </SQLiteProvider>
  );
}
