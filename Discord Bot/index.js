const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

//discord login...

const client = new Discord.Client();

client.once('ready', () => {
	console.log('${client.user.username} is Ready!');
});

//canvas bild generator

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === config.welchannel);
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
});

client.on('message', message => {
	if (message.content === '!join') {
		client.emit('guildMemberAdd', message.member);
	}
});

//auto reactions
client.on("message", async message => {
	if (message.channel.id === (config.reactsid)){
		message.react(config.areact)
	}
});
client.on("message", async message => {
	if (message.channel.id === (config.reactsid)){
		message.react(config.breact)
	}
});
//für mehr reactions einfach den code copypasten. Achtung falls die emojis eine bestimme reihenfolge haben sollen dann bitte auch in dieser reihenfolge eintragen!

client.login(config.token);
