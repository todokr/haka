import GithubRepository from '../repository/GithubRepository';
import config from '../config';

export default class ProductBacklogService {

  constructor() {
    this.githubRepository = new GithubRepository(config.github.accessToken);
  }

  listItems() {
    const issues = config.repositories.map(repository => {
      return this.githubRepository.listIssues(repository)
        .then(issues => issues.map(issue => {
          const repository = this._parseRepositoryName(issue.repository_url);
          const number = issue.number;
          const { status, storyPoint } = this._parseLabels(issue.labels);
          const id = JSON.stringify({repository, number});
          return {
            id,
            issueId: issue.id,
            repository,
            number,
            title: issue.title,
            storyPoint,
            status,
          }
        }));
    });
    return Promise.all(issues).then(issues =>
      Array.prototype.concat.apply([], issues));
  }

  _parseRepositoryName(repoUrl) {
    return repoUrl.replace('https://api.github.com/repos/', '')
  }

  _parseLabels(labels) {
    const pointLabel = labels.find(l => l.name.startsWith('point:'));
    const statusLabel = labels.find(l => l.name.startsWith('status:'));
    return {
      status: statusLabel ? config.app.stages[statusLabel.name.replace('status:', '')] : config.app.stages['pbl'],
      storyPoint: pointLabel ? pointLabel.name.replace('point:', '') : '?',
    }
  }
}