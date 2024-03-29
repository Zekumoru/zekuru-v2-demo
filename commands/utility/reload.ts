import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCommand } from '../../types/DiscordCommand';

const data = new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Reloads a command')
  .addStringOption((option) =>
    option
      .setName('command')
      .setDescription('The command to reload.')
      .setRequired(true)
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  const commandName = interaction.options
    .getString('command', true)
    .toLowerCase();
  const command = interaction.client.commands.get(commandName);

  if (!command) {
    interaction.reply(`There is no command with name \`${commandName}\`!`);
    return;
  }

  delete require.cache[require.resolve(`./${command.data.name}.ts`)];

  try {
    interaction.client.commands.delete(command.data.name);
    const newCommand = require(`./${command.data.name}.ts`);
    interaction.client.commands.set(newCommand.data.name, newCommand);
    await interaction.reply(
      `Command \`${newCommand.data.name}\` was reloaded!`
    );
  } catch (error) {
    console.error(error);
    await interaction.reply(
      `There was an error while reloading a command \`${
        command.data.name
      }\`:\n\`${(error as { message: string }).message}\``
    );
  }
};

export default createCommand({
  data,
  execute,
});
