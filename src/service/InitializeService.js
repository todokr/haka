import GithubRepository from '../repository/GithubRepository';
import config from '../config';

export default class InitializeService {

  constructor() {
    this.githubRepository = new GithubRepository(config);
  }

  static initialize() {
    this.githubRepository.initializeConfigRepository();
  }
}