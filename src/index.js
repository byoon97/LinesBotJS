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

    // Getting the sport to be able to create a link to covers.com
    if (league == "NBA" || league == "NCAAB") sport = "basketball";
    if (league == "NFL" || league == "NCAAF") sport = "football";
    if (league == "NHL") sport = "hockey";
    if (league == "MLB") sport = "baseball";

    // Function to create the covers.com link for every team
    const createLink = (str) => {
      let team = str.replace(/\s+/g, "-");
      return `https://www.covers.com/sport/${sport}/${league}/teams/main/${team}`;
    };

    // fetching the lines data
    try {
      let { data } = await axios.get(
        `https://jsonodds.com/api/odds/${league}`,
        {
          headers: {
            "x-api-key": process.env.APIKEY,
          },
        }
      );

      if (data.length == 0) {
        interaction.reply("There are no available lines");
      } else {
        data.forEach(async (game) => {
          console.log(game);
          let odds = game.Odds.filter((e) => e.OddType === "Game")[0];

          // creating the links with the conversion function above
          let awayTeamLink = createLink(game.AwayTeam);
          let homeTeamLink = createLink(game.HomeTeam);

          // converting the time to EST
          const utcDate = new Date(game.MatchTime);
          const options = {
            timeZone: "America/New_York",
            timeZoneName: "short",
            hour12: true,
          };
          const estDate = new Date(utcDate.toLocaleString("en-US", options));
          const fourHoursAgo = new Date(estDate.getTime() - 4 * 60 * 60 * 1000);

          // fetching the live score
          let { data: gameData } = await axios.get(
            `https://jsonodds.com/api/results/${game.ID}`,
            {
              headers: {
                "x-api-key": process.env.APIKEY,
              },
            }
          );

          // creating and sending the embed
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
                  }, ${odds.PointSpreadHomeLine}, ML ${
                    odds.MoneyLineHome[0] === "-"
                      ? odds.MoneyLineHome
                      : "+" + odds.MoneyLineHome
                  }`,
                  value: homeTeamLink,
                  inline: true,
                })
                .addFields({
                  name: "Over/Under",
                  value: `Over ${odds.TotalNumber} ${odds.OverLine}, Under ${odds.TotalNumber} ${odds.UnderLine}`,
                  inline: true,
                })
                .addFields({
                  name: "Tip Off Time",
                  value: `${fourHoursAgo.toLocaleString("en-US", options)}`,
                })
                .addFields({
                  name: "Score",
                  value: `${
                    gameData[0].HomeScore === null &&
                    gameData[0].AwayScore === null
                      ? "Not Yet Started"
                      : `${gameData.AwayScore} - ${game.HomeScore}`
                  }`,
                }),
            ],
          });
        });
        interaction.reply("All available lines currently available");
      }
      // iterating through each game
    } catch (err) {
      console.log(`There was an error: ${err}`, sport);
    }
  }
});

client.login(process.env.CLIENT); //login bot using token
