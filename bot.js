const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const YTDL = require("ytdl-core");
const fs = require("fs")

var prefix = ayarlar.prefix;

var servers = {};


function play(connection, msg){
  var server = servers[msg.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  msg.channel.sendMessage(':headphones: Song is playing now(or adding to queue)!')

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, msg);
    else connection.disconnect();
  });
}
client.on('ready', () => {
  console.log(`BOT: ${client.user.tag} have logged in!`);
  client.user.setGame("I :heart: Music")
  //client.user.setStatus("Offline")
});

client.on('message', msg => {
  console.log('LOG: S: ' + msg.guild.name + ' M: ' + msg.content + ' Y: ' + msg.author.tag);
  if (msg.author.id === ayarlar.id) return;
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)){
		return;
	}
  if (msg.content.toLowerCase() === prefix + 'testconnection') {
    msg.reply('connectiontested!');
  }
  if (msg.content.toLowerCase() === prefix + ''){

  }
    if (msg.content.toLowerCase() === prefix + 'help') {
    msg.reply('play +linkofvideo --> plays a muic you must enter the link not the name!' + 'write stop to stop the music');
	msg.reply('New Commands will be added soon: Our website: ');
  }

   var args = msg.content.substring(ayarlar.prefix.length).split(" ")
  switch (args[0].toLowerCase()) {

  case "play":
   if (!args[1]) {
     msg.channel.sendMessage(":satellite: Please provide a link");
 return;
   }
   if(!msg.member.voiceChannel){
     msg.channel.sendMessage(":microphone: Please enter a voice channel")
     return;
   }

   if(!servers[msg.guild.id]) servers[msg.guild.id] = {
     queue: []
   }

   var server= servers[msg.guild.id];

   server.queue.push(args[1]);

   if (!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection){
play(connection, msg);
 });
  break;
  case "skip":
  msg.channel.sendMessage(':track_next: Skipping this song. Going to next song!')
 var server = servers[msg.guild.id];

 if (server.dispatcher) server.dispatcher.end();
  break;
  case "stop":
  var server = servers[msg.guild.id];

  if (server.dispatcher) server.dispatcher.disconnect();
   break;
   case "quit":
   msg.channel.sendMessage(':sob: Why did you close ME!!!')
   var server = servers[msg.guild.id];

   if (server.dispatcher) server.dispatcher.end();
    break;
    case "clear all":
    var server = servers[msg.guild.id];

  if (msg.guild.voiceConnection) msg.guild.voiceConnection.disconnect();
  break;
  default:



}
});

client.login(ayarlar.token);
