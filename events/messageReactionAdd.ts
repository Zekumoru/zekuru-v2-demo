import {
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { DiscordEvent } from '../types/DiscordEvent';
import { errorDebug } from '../utils/logger';

export default {
  name: Events.MessageReactionAdd,
  execute: async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        errorDebug('Something went wrong when fetching the message: ', error);
        return;
      }
    }

    // Now the message has been cached and is fully available
    console.log(
      `${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`
    );
    // The reaction is now also fully available and the properties will be reflected accurately:
    console.log(`${user.username} has given the reaction to this message!`);
  },
} as DiscordEvent;
