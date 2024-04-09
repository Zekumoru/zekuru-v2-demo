import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';
import keyv from '../../db/keyv';

const data = new SlashCommandBuilder()
  .setName('db')
  .setDescription('Test db. [DEVELOPMENT ONLY]')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('set')
      .setDescription('Set a key')
      .addStringOption((option) =>
        option
          .setName('key')
          .setDescription('The name of the key')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('value')
          .setDescription('The value for the given key')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('get')
      .setDescription('Get the value of the given key')
      .addStringOption((option) =>
        option
          .setName('key')
          .setDescription('The name of the key')
          .setRequired(true)
      )
  );

const handleSetCommand = async (interaction: ChatInputCommandInteraction) => {
  const key = interaction.options.getString('key', true);
  const value = interaction.options.getString('value', true);

  await keyv.testing.set(key, value);
  await interaction.reply({
    content: `Key '${key}' set!`,
    ephemeral: true,
  });
};

const handleGetCommand = async (interaction: ChatInputCommandInteraction) => {
  const key = interaction.options.getString('key', true);
  const value = await keyv.testing.get(key);

  if (value === undefined) {
    await interaction.reply({
      content: `Key \`${key}\` does not exist!`,
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({
    content: `Fetched: \`${value}\``,
    ephemeral: true,
  });
};

const execute = async (interaction: ChatInputCommandInteraction) => {
  const command = interaction.options.getSubcommand() as 'set' | 'get';

  switch (command) {
    case 'set':
      await handleSetCommand(interaction);
      break;
    case 'get':
      await handleGetCommand(interaction);
      break;
  }
};

export default createCommand({
  cooldown: 0,
  devOnly: true,
  data,
  execute,
});
