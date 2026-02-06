import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "dns/promises";
import dns from "dns";

// Force Google DNS to bypass ISP DNS issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config({ path: ".env.local" });

const DB_URI = process.env.DB_URI || "";

if (!DB_URI) {
  console.error("❌ DB_URI not found in .env.local");
  process.exit(1);
}

console.log("🔍 Testing MongoDB Connection...\n");
console.log("📋 Connection Details:");
console.log(`   Database URL: ${DB_URI.substring(0, 50)}...`);
console.log(`   Environment: ${process.env.NODE_ENV || "development"}\n`);

async function testDNS() {
  try {
    console.log("🔗 Testing DNS resolution...");
    const ips = await resolve("cluster0.5xpwkre.mongodb.net");
    console.log(`✓ DNS resolved successfully: ${ips.join(", ")}\n`);
    return true;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`✗ DNS resolution failed: ${errorMsg}\n`);
    return false;
  }
}

async function testConnection() {
  const dnsOk = await testDNS();

  try {
    console.log("🔗 Attempting to connect...");
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });

    console.log("✓ Connection successful!\n");
    console.log("📊 Connection Details:");
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(
      `   State: ${mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"}\n`,
    );

    // List databases
    const admin = mongoose.connection.db?.admin();
    if (admin) {
      const dbs = await admin.listDatabases();
      console.log("📦 Available Databases:");
      dbs.databases.forEach((db: { name: string }) => {
        console.log(`   - ${db.name}`);
      });
    }

    console.log("\n✅ All tests passed!");
    process.exit(0);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorCode = error instanceof Error ? (error as any).code : undefined;
    console.error("❌ Connection failed!\n");
    console.error("Error Message:", errorMsg);
    console.error("Error Code:", errorCode);

    if (errorMsg.includes("ECONNREFUSED") || errorMsg.includes("querySrv")) {
      console.error("\n⚠️  This is a network issue. Check:");
      console.error("   1. IP address whitelisted in MongoDB Atlas");
      console.error("   2. Firewall settings");
      console.error("   3. Internet connection");
    }

    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

testConnection();
