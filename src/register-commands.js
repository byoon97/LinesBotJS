require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

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

const rest = new REST({ version: "10" }).setToken(process.env.CLIENT);

(async () => {
  try {
    console.log("registering slash commands");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("slash commands done");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
