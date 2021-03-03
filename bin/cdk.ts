#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { CustomResourceStack } from "../lib/custom-resource-stack";

const app = new App();
new CustomResourceStack(app, "CustomResourceStack", {
  tags: {
    service: "CustomResource stack",
  },
});
