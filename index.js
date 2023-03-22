require("dotenv").config(); //initialize dotenv
const { Client, Events, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on("message", (message) => {
  if (message.content === "!greetings") {
    message.channel.send("hello");
  }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
