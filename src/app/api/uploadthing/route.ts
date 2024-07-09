
//route handler always goes in a route.ts file. 
//need to serve api from api/uploadthing as it is called via webhook to trigger onUploadComplete
//core.ts is for logic, but doesnt do anything itself. 

import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
 
  // Apply an (optional) custom config:
  // config: { ... },
});