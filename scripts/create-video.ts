#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const TEMPLATE_DIR = path.join(__dirname, "../videos/_template");
const VIDEOS_DIR = path.join(__dirname, "../videos");

interface VideoConfig {
  name: string; // e.g., "feature-launch"
  displayName: string; // e.g., "Feature Launch"
  description: string;
  width: number;
  height: number;
  fps: number;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function processTemplateFiles(dir: string, config: VideoConfig): void {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      processTemplateFiles(fullPath, config);
    } else if (file.name.endsWith(".template")) {
      const newPath = fullPath.replace(".template", "");
      let content = fs.readFileSync(fullPath, "utf-8");

      // Replace template variables
      content = content
        .replace(/\{\{VIDEO_NAME\}\}/g, toPascalCase(config.name))
        .replace(/\{\{DISPLAY_NAME\}\}/g, config.displayName)
        .replace(/\{\{DESCRIPTION\}\}/g, config.description)
        .replace(/\{\{VIDEO_WIDTH\}\}/g, String(config.width))
        .replace(/\{\{VIDEO_HEIGHT\}\}/g, String(config.height))
        .replace(/\{\{VIDEO_FPS\}\}/g, String(config.fps));

      fs.writeFileSync(newPath, content);
      fs.unlinkSync(fullPath); // Remove template file
    }
  }
}

function copyDirectory(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  console.log("\n🎬 Create New Video Project\n");
  console.log("This will scaffold a new Remotion video project in the videos/ directory.\n");

  // Get video name
  const rawName = await prompt("Video name (e.g., feature-launch, product-demo): ");
  if (!rawName) {
    console.error("❌ Video name is required");
    process.exit(1);
  }

  const name = toKebabCase(rawName);
  const videoDir = path.join(VIDEOS_DIR, name);

  if (fs.existsSync(videoDir)) {
    console.error(`\n❌ Video "${name}" already exists at videos/${name}`);
    process.exit(1);
  }

  // Get display name
  const defaultDisplayName = rawName
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const displayNameInput = await prompt(`Display name [${defaultDisplayName}]: `);
  const displayName = displayNameInput || defaultDisplayName;

  // Get description
  const description = await prompt("Description (optional): ") || `${displayName} video`;

  // Get dimensions
  console.log("\nVideo presets:");
  console.log("  1. 1080p (1920x1080) - default");
  console.log("  2. 720p (1280x720)");
  console.log("  3. 4K (3840x2160)");
  console.log("  4. Square (1080x1080)");
  console.log("  5. Vertical (1080x1920)");

  const presetChoice = await prompt("Choose preset [1]: ") || "1";

  let width = 1920;
  let height = 1080;

  switch (presetChoice) {
    case "2":
      width = 1280;
      height = 720;
      break;
    case "3":
      width = 3840;
      height = 2160;
      break;
    case "4":
      width = 1080;
      height = 1080;
      break;
    case "5":
      width = 1080;
      height = 1920;
      break;
  }

  const config: VideoConfig = {
    name,
    displayName,
    description,
    width,
    height,
    fps: 30,
  };

  console.log(`\n📁 Creating video project: ${name}`);
  console.log(`   Display name: ${displayName}`);
  console.log(`   Dimensions: ${width}x${height} @ 30fps`);

  // Copy template
  copyDirectory(TEMPLATE_DIR, videoDir);

  // Process template files
  processTemplateFiles(videoDir, config);

  console.log(`
✅ Video project created successfully!

📂 Location: videos/${name}

Next steps:
  1. cd videos/${name}
  2. pnpm install          # Install dependencies (run from monorepo root)
  3. pnpm remotion         # Open Remotion Studio

Quick commands:
  pnpm remotion --filter=@launchpad/${toPascalCase(name)}   # Open Remotion Studio
  pnpm dev --filter=@launchpad/${toPascalCase(name)}        # Start Next.js preview
  pnpm render --filter=@launchpad/${toPascalCase(name)}     # Render video

Documentation: docs/CREATING_VIDEOS.md
`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
