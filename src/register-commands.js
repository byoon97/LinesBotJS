require("dotenv").config();
const {
  Client,
  REST,
  Routes,
  ApplicationCommandOptionType,
  IntentsBitField,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const commands = [
  {
    name: "lines",
    description:
      "returns a selection of different sports where a user can select for its corresponding betting lines",
    options: [
      {
        name: "games",
        description: "Select a sport",
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: "NBA", value: "NBA" },
          { name: "NFL", value: "NFL" },
          { name: "NHL", value: "NHL" },
          { name: "MLB", value: "MLB" },
          { name: "NCAAF", value: "NCAAF" },
          { name: "NCAAB", value: "NCAAB" },
        ],
        required: true,
      },
    ],
  },
];

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Send the slash command payload to all servers the bot is a member of
  for (const guild of client.guilds.cache.values()) {
    try {
      const rest = new REST({ version: "10" }).setToken(process.env.CLIENT);
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, guild.id),
        { body: commands }
      );
      console.log(`Slash command registered in server ${guild.name}`);
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(process.env.CLIENT); //login bot using token
