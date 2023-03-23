require("dotenv").config(); //initialize dotenv
const axios = require("axios");
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand) return;

  if (interaction.commandName === "lines") {
    const league = interaction.options.get("games")?.value;
    let sport;

    if (league == "NBA" || league == "NCAAB") sport = "basketball";
    if (league == "NFL" || league == "NCAAF") sport = "football";
    if (league == "NHL") sport = "hockey";
    if (league == "MLB") sport = "baseball";

    console.log(sport, league);

    const createLink = (str) => {
      let team = str.replace(/\s+/g, "-");
      return `https://www.covers.com/sport/${sport}/${league}/teams/main/${team}`;
    };

    try {
      let { data } = await axios.get(
        `https://jsonodds.com/api/odds/${league}`,
        {
          headers: {
            "x-api-key": process.env.APIKEY,
          },
        }
      );

      // let embedsArr = [];

      data.forEach(async (game) => {
        let odds = game.Odds.filter((e) => e.OddType === "Game")[0];

        let awayTeamLink = createLink(game.AwayTeam);
        let homeTeamLink = createLink(game.HomeTeam);

        await interaction.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${game.AwayTeam} @ ${game.HomeTeam}`)
              .setURL(`https://www.covers.com/sports/${league}/matchups`)
              .setDescription("Available lines for this match up")
              .setColor("Random")
              .addFields({
                name: `${game.AwayTeam} ${
                  odds.PointSpreadAway[0] === "-"
                    ? odds.PointSpreadAway
                    : "+" + odds.PointSpreadAway
                }, ${odds.PointSpreadAwayLine}, ML ${
                  odds.MoneyLineAway[0] === "-"
                    ? odds.MoneyLineAway
                    : "+" + odds.MoneyLineAway
                }`,
                value: awayTeamLink,
                inline: true,
              })
              .addFields({
                name: `${game.HomeTeam} ${
                  odds.PointSpreadHome[0] === "-"
                    ? odds.PointSpreadHome
                    : "+" + odds.PointSpreadHome
                }, ${odds.PointSpreadHomeLine}`,
                value: homeTeamLink,
                inline: true,
              })
              .addFields({
                name: "Over/Under",
                value: `Over, ${odds.TotalNumber}, ${odds.OverLine}, Under, ${
                  odds.TotalNumber
                }, ${odds.UnderLine}, ML ${
                  odds.MoneyLineHome[0] === "-"
                    ? odds.MoneyLineHome
                    : "+" + odds.MoneyLineHome
                }`,
                inline: true,
              }),
          ],
        });
      });
    } catch (err) {
      console.log(`There was an error: ${err}`, sport);
    }
  }
});

client.login(process.env.CLIENT); //login bot using token
