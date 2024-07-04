"use strict";

const fs = require("fs");
const naturalSort = require("javascript-natural-sort");

function emberVersions() {
  return fs
    .readdirSync("ember")
    .map(function (file) {
      const matched = file.match(/^ember-(\d+\.\d+\.\d+)\.prod/);

      if (matched) {
        return matched[1];
      }
    })
    .filter(Boolean)
    .sort(naturalSort);
}

const walkSync = require("walk-sync");
const path = require("path");

function benchmarks() {
  return walkSync("benchmarks", ["**/bench.json"])
    .map(function (bench) {
      const data = JSON.parse(fs.readFileSync("benchmarks" + "/" + bench));
      data.path = "/" + path.dirname(bench);
      return data;
    })
    .filter(function (data) {
      return data.disabled !== false;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = function (environment) {
  const ENV = {
    LOCAL_EMBER_VERSIONS: emberVersions(),
    BENCHMARKS: benchmarks(),
    modulePrefix: "ember-performance",
    environment,
    rootURL: "/ember-performance",
    locationType: "history",
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === "development") {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  if (environment === "production") {
    // here you can enable a production-specific feature
  }

  return ENV;
};
