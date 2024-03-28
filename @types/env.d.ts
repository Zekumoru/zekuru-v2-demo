declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production';
      DISCORD_TOKEN?: string;
      CLIENT_ID?: string;
      GUILD_ID?: string;
    }
  }
}

export {};
