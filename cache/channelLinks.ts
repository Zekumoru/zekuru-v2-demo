import { Collection } from 'discord.js';
import ChannelLink, { IChannelLink } from '../models/ChannelLink';

const cacheLinks = new Collection<string, IChannelLink>();

const getLink = async (channelId: string) => {
  // fetch from db, if not exists, create new
  const link = await ChannelLink.findOne({ id: channelId })
    .populate('links')
    .exec();
  if (link) return link;

  const newLink = new ChannelLink({
    id: channelId,
    links: [],
  });
  await newLink.save();
  return newLink;
};

const create = async (channelId: string) => {
  // create otherwise fetch
  const link = await getLink(channelId);

  cacheLinks.set(channelId, {
    _id: link._id,
    id: link.id,
    links: link.links,
    createdAt: link.createdAt,
  });
  return cacheLinks.get(channelId)!;
};

const update = async (channelLink: IChannelLink) => {
  // update in db
  const link = await getLink(channelLink.id);
  link.overwrite(channelLink);
  await link.save();

  // update cache
  cacheLinks.set(channelLink.id, channelLink);
};

const get = async (channelId: string) => {
  // get from cache
  const linkCache = cacheLinks.get(channelId);
  if (linkCache) return linkCache;

  // if not exists, fetch from db and set to cache
  const link = await ChannelLink.findOne({ id: channelId })
    .populate('links')
    .exec();
  if (!link) return null;

  cacheLinks.set(channelId, {
    _id: link._id,
    id: link.id,
    links: link.links,
    createdAt: link.createdAt,
  });
  return cacheLinks.get(channelId)!;
};

export default { create, update, get };