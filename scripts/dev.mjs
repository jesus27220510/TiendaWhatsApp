import concurrently from "concurrently";
const { result } = concurrently(
  [
    { command: "npm run dev -w @tienda/client", name: "client" },
    { command: "npm run dev -w @tienda/server", name: "server" },
  ],
  { killOthersOn: ["failure", "success"] },
);
result.catch(() => {
  process.exitCode = 1;
});
