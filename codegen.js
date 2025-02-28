const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🚀 Starting GraphQL code generation...");

// First compile TypeScript
console.log("📦 Compiling TypeScript...");
exec("npx tsc", (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ TypeScript compilation failed: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`⚠️ TypeScript compilation warnings: ${stderr}`);
  }

  console.log("✅ TypeScript compilation successful");

  // Now run our main.js file to generate the hooks
  console.log("🔮 Generating GraphQL hooks...");
  exec(
    "node --es-module-specifier-resolution=node src/main.js",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Code generation failed: ${error.message}`);
        return;
      }

      console.log(stdout);

      if (stderr) {
        console.error(`⚠️ Warnings during code generation: ${stderr}`);
      }

      console.log("✅ GraphQL hooks generation complete!");
      console.log(
        "📂 Generated hooks are available in the ./generated directory"
      );
    }
  );
});
