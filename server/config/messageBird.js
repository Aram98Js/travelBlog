import { BirdClient } from "@messagebird/sdk";


console.log(
  "BIRD API KEY:",
  process.env.BIRD_API_KEY
);

const bird = new BirdClient({
  apiKey: process.env.BIRD_API_KEY
});

export default bird