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

client.on("guildCreate", (Guild) => {
  const guildId = Guild.id;

  const rest = new REST({ version: "10" }).setToken(process.env.CLIENT);

  (async () => {
    try {
      console.log("registering slash commands");

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: commands }
      );

      console.log("slash commands done");
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  })();
});
