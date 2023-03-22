require("dotenv").config(); //initialize dotenv
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand) return;

  if (interaction.commandName === "lines") {
    const sport = interaction.options.get("games")?.value;

    console.log(sport);
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content === "hello") {
    message.reply("hello");
  }
});

client.login(process.env.CLIENT); //login bot using token
