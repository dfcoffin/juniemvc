/**
 * Test coverage check script
 *
 * This script can be used to enforce minimum test coverage thresholds
 * and generate coverage reports. It can be integrated into CI/CD pipelines
 * to fail builds that don't meet coverage requirements.
 */

import * as fs from "fs";
import * as path from "path";

// Define types for coverage data
interface CoverageMetric {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

interface FileCoverageData {
  lines: CoverageMetric;
  functions: CoverageMetric;
  statements: CoverageMetric;
  branches: CoverageMetric;
}

interface CoverageSummary {
  total: FileCoverageData;
  [key: string]: FileCoverageData;
}

// Define coverage thresholds
const COVERAGE_THRESHOLDS = {
  lines: 70, // 70% line coverage
  statements: 70, // 70% statement coverage
  functions: 70, // 70% function coverage
  branches: 60, // 60% branch coverage
};

// Define directories to check for coverage
const COVERAGE_DIRECTORIES = [
  "src/components",
  "src/services",
  "src/utils",
  "src/hooks",
];

// Function to parse coverage summary from JSON file
function parseCoverageSummary(filePath: string) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading coverage file: ${filePath}`);
    console.error(error);
    process.exit(1);
  }
}

// Function to check coverage against thresholds
function checkCoverage(summary: CoverageSummary) {
  const failures: string[] = [];

  // Check total coverage against thresholds
  const total = summary.total;

  if (total.lines.pct < COVERAGE_THRESHOLDS.lines) {
    failures.push(
      `Line coverage ${total.lines.pct}% is below threshold ${COVERAGE_THRESHOLDS.lines}%`,
    );
  }

  if (total.statements.pct < COVERAGE_THRESHOLDS.statements) {
    failures.push(
      `Statement coverage ${total.statements.pct}% is below threshold ${COVERAGE_THRESHOLDS.statements}%`,
    );
  }

  if (total.functions.pct < COVERAGE_THRESHOLDS.functions) {
    failures.push(
      `Function coverage ${total.functions.pct}% is below threshold ${COVERAGE_THRESHOLDS.functions}%`,
    );
  }

  if (total.branches.pct < COVERAGE_THRESHOLDS.branches) {
    failures.push(
      `Branch coverage ${total.branches.pct}% is below threshold ${COVERAGE_THRESHOLDS.branches}%`,
    );
  }

  // Check specific directories
  for (const dir of COVERAGE_DIRECTORIES) {
    // Find all entries that match this directory
    const dirEntries = Object.entries(summary).filter(
      ([key]) => key !== "total" && key.startsWith(dir),
    );

    if (dirEntries.length === 0) {
      failures.push(`No coverage data found for directory: ${dir}`);
      continue;
    }

    // Calculate average coverage for this directory
    let lineTotal = 0;
    let lineCount = 0;

    for (const [, data] of dirEntries as [string, FileCoverageData][]) {
      if (data.lines && typeof data.lines.pct === "number") {
        lineTotal += data.lines.pct;
        lineCount++;
      }
    }

    const avgLineCoverage = lineCount > 0 ? lineTotal / lineCount : 0;

    if (avgLineCoverage < COVERAGE_THRESHOLDS.lines) {
      failures.push(
        `Average line coverage for ${dir} is ${avgLineCoverage.toFixed(2)}%, below threshold ${COVERAGE_THRESHOLDS.lines}%`,
      );
    }
  }

  return failures;
}

// Function to generate a readable coverage report
function generateCoverageReport(summary: CoverageSummary) {
  console.log("\n========== COVERAGE REPORT ==========\n");

  // Report total coverage
  const total = summary.total;
  console.log("TOTAL COVERAGE:");
  console.log(
    `  Lines      : ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})`,
  );
  console.log(
    `  Statements : ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})`,
  );
  console.log(
    `  Functions  : ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})`,
  );
  console.log(
    `  Branches   : ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})`,
  );

  console.log("\nDIRECTORY COVERAGE:\n");

  // Group by directory
  const directoryCoverage: Record<
    string,
    { file: string; data: FileCoverageData }[]
  > = {};

  for (const [key, data] of Object.entries(summary)) {
    if (key === "total") continue;

    // Extract directory from the path
    const pathParts = key.split("/");
    if (pathParts.length >= 2) {
      const dir = `${pathParts[0]}/${pathParts[1]}`;
      if (!directoryCoverage[dir]) {
        directoryCoverage[dir] = [];
      }
      directoryCoverage[dir].push({ file: key, data });
    }
  }

  // Print directory coverage
  for (const [dir, files] of Object.entries(directoryCoverage)) {
    let dirLineTotal = 0;
    let dirLineCount = 0;

    for (const { data } of files) {
      if (data.lines && typeof data.lines.pct === "number") {
        dirLineTotal += data.lines.pct;
        dirLineCount++;
      }
    }

    const avgLineCoverage = dirLineCount > 0 ? dirLineTotal / dirLineCount : 0;

    console.log(`${dir} : ${avgLineCoverage.toFixed(2)}% line coverage`);
  }

  console.log("\n======================================\n");
}

// Main function to run the coverage check
function runCoverageCheck() {
  const coveragePath = path.resolve("coverage", "coverage-summary.json");

  if (!fs.existsSync(coveragePath)) {
    console.error("Coverage file not found. Run tests with coverage first.");
    process.exit(1);
  }

  const summary = parseCoverageSummary(coveragePath);
  const failures = checkCoverage(summary);

  // Generate and display the report
  generateCoverageReport(summary);

  // Report failures
  if (failures.length > 0) {
    console.error("\nCOVERAGE CHECK FAILED:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  } else {
    console.log("\nCOVERAGE CHECK PASSED: All thresholds met or exceeded.");
  }
}

// Run the check if this script is executed directly
if (require.main === module) {
  runCoverageCheck();
}

export { runCoverageCheck, checkCoverage, COVERAGE_THRESHOLDS };
