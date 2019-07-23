import Path from "path";
import Server from "../src";

const appConfig = {
  middleware: [],
  routes: [
    {
      name: "api",
      method: "post",
      middleware: [],
      models: {}
    }
  ]
};

const app = new Server({
  paths: { src: Path.join(__dirname, "./src") },
  config: appConfig
});

app.run(3000, () => {
  console.log("the server listening");
});
