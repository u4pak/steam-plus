// DotENV Setup (so my stuff doesn't get leaked lol)
require("dotenv").config();
console.log("\nDOTENV started with 0 errors!");

// Discord Setup
const { Client, MessageEmbed, Intents } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});
console.log("Discord started with 0 errors!");

// Steam API Setup
const SteamAPI = require("steamapi");
const steam = new SteamAPI(process.env.STEAM_API_KEY);
console.log("Steam started with 0 errors!");

// Bot Login Confirmation
client.on("ready", () => {
  console.log(`\nSteam+ started as ${client.user.tag}! | Prefix is ">"\n`);
  client.user.setStatus("dnd");
  setTimeout(() => {
    client.user.setActivity(`${client.guilds.cache.size} servers | >help`, {
      type: "COMPETING",
    });
  }, 60000);
});

// Extra Thingys (TESTING PURPOSES ONLY, REMOVE ON RELEASE)

// Command Handler
client.on("messageCreate", (message) => {
  var args = message.content.split(" ");
  var cmd = args[0];

  // >userid - Get's a Steam user's SteamID64.
  if (cmd === ">userid") {
    if (args.length > 1) {
      var acc = message.content.replace(">userid ", "");
      steam.resolve("https://steamcommunity.com/id/" + acc + "/").then((id) => {
        let steamIDEmbed = new MessageEmbed()
          .setTitle("ID Found!")
          .addFields({
            name: "User ID:",
            value:
              "[" + id + "](https://steamcommunity.com/profiles/" + id + "/)",
          })
          .setColor("BLUE");
        try {
          message.channel.send({ embeds: [steamIDEmbed] });
        } catch (err) {
          console.log(err.name);
        }
      });
    }
  }

  // >gamelist - Get's a Steam user's owned games.
  if (cmd === ">gamelist") {
    if (args.length > 1) {
      var acc = message.content.replace(">gamelist ", "");
      steam.resolve("https://steamcommunity.com/id/" + acc + "/").then((id) => {
        steam.getUserSummary(id).then((summary) => {
          steam.getUserOwnedGames(id).then((userGames) => {
            let steamUserGamesEmbed = new MessageEmbed()
              .setTitle("User Found!")
              .addFields({
                name: summary.nickname + "'s Owned Games:",
                value:
                  userGames[0].name +
                  "\n" +
                  userGames[1].name +
                  "\n" +
                  userGames[2].name +
                  "\n" +
                  userGames[3].name +
                  "\n" +
                  userGames[4].name +
                  "\n" +
                  userGames[5].name +
                  "\n" +
                  userGames[6].name +
                  "\n" +
                  userGames[7].name +
                  "\n" +
                  userGames[8].name +
                  "\n" +
                  userGames[9].name +
                  "",
              })
              .setThumbnail(summary.avatar.large)
              .setColor("BLUE");
            message.channel.send({ embeds: [steamUserGamesEmbed] });
            console.log(
              "Command !gamelist has been executed successfully by " +
                message.author.username +
                "#" +
                message.author.discriminator +
                " in #" +
                message.channel.name +
                "."
            );
          });
        });
      });
    } else {
      steam.getAppList().then((appList) => {
        let steamGameListEmbed = new MessageEmbed()
          .setTitle("All Steam Games / Apps")
          .addFields({
            name: "App List:",
            value:
              "**1:** " +
              appList[0].name +
              " (App ID: " +
              appList[0].appid +
              ")\n**2:** " +
              appList[1].name +
              " (App ID: " +
              appList[1].appid +
              ")\n**3:** " +
              appList[2].name +
              " (App ID: " +
              appList[2].appid +
              ")\n**4:** " +
              appList[3].name +
              " (App ID: " +
              appList[3].appid +
              ")\n**5:** " +
              appList[4].name +
              " (App ID: " +
              appList[4].appid +
              ")\n**6:** " +
              appList[5].name +
              " (App ID: " +
              appList[5].appid +
              ")\n**7:** " +
              appList[6].name +
              " (App ID: " +
              appList[6].appid +
              ")\n**8:** " +
              appList[7].name +
              " (App ID: " +
              appList[7].appid +
              ")\n**9:** " +
              appList[8].name +
              " (App ID: " +
              appList[8].appid +
              ")\n**10:** " +
              appList[9].name +
              " (App ID: " +
              appList[9].appid +
              ")",
          })
          .setColor("BLUE");
        message.channel.send({ embeds: [steamGameListEmbed] });
      });
    }
  }
  // >baninfo - Get's various information about the ban status of a user.
  if (cmd === ">baninfo") {
    if (args.length > 1) {
      var acc = message.content.replace(">baninfo ", "");
      steam.resolve("https://steamcommunity.com/id/" + acc + "/").then((id) => {
        steam.getUserBans(id).then((userBans) => {
          let steamBanInfoEmbed = new MessageEmbed()
            .setTitle("User Found!")
            .addFields(
              {
                name: "Ban Info:",
                value:
                  "VAC Banned: " +
                  userBans.vacBanned +
                  "\nCommunity Banned: " +
                  userBans.communityBanned +
                  "\nEco Ban Type: " +
                  userBans.economyBan +
                  "\nDays Since Last Ban: " +
                  userBans.daysSinceLastBan +
                  "",
                inline: true,
              },
              {
                name: "Ban Count:",
                value:
                  "Total VAC Bans: " +
                  userBans.vacBans +
                  "\nTotal Game Bans: " +
                  userBans.gameBans +
                  "",
                inline: true,
              }
            )
            .setColor("BLUE");
          message.channel.send({ embeds: [steamBanInfoEmbed] });
          console.log(
            "Command !baninfo has been executed successfully by " +
              message.author.username +
              "#" +
              message.author.discriminator +
              " in #" +
              message.channel.name +
              "."
          );
        });
      });
    }
  }
  // >help - Lists all of the bot's commands.
  if (cmd === ">help") {
    let helpEmbed = new MessageEmbed()
      .setTitle("Steam+ Commands")
      .addFields(
        {
          name: ">userid <username>",
          value: "Gets a Steam user's Steam64ID, AKA Account ID.",
        },
        {
          name: ">gamelist <username>",
          value: "Gets a list of a Steam user's owned games.",
        },
        {
          name: ">baninfo <username>",
          value: "Gets various information about the ban status of a user.",
        }
      )
      .setColor("BLUE");
    message.channel.send({ embeds: [helpEmbed] });
  }
});

client.login(process.env.BOT_TOKEN);
