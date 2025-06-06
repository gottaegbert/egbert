import config from '../config.json';

type Config = {
  readonly base_url: string;
  readonly site_title: string;
  readonly site_description: string;
  readonly site_keywords: string[];
  readonly github_account: string;
};

export default config as Config;
