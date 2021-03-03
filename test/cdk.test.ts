import { App } from "@aws-cdk/core";
import { CustomResourceStack } from "../lib/custom-resource-stack";

test("Empty Stack", () => {
  const app = new App();
  // WHEN
  const stack = new CustomResourceStack(app, "CustomResourceStack");
});
