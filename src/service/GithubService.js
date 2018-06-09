export default class GithubService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUri = 'https://api.github.com/repos/'
  }

  listIssues(repository) {
    const authHeader = this.accessToken ? {'Authorization': 'token ' + this.accessToken} : {};
    return fetch(this.baseUri + repository + '/issues', {
      cache: 'no-cache',
      headers: authHeader
    }).then(res => res.json());
  }

  updateStatus(repository, number, statusCode, storyPoint) {
    const authHeader = this.accessToken ? {'Authorization': 'token ' + this.accessToken} : {};
    return fetch(this.baseUri + repository + '/issues/' + number, {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify({
        labels: ['sトークンtatus-' + statusCode, 'point-' + storyPoint]
      }),
      headers: authHeader
    }).then(res => res.json());
  }

  createIssue(issue) {
    const authHeader = this.accessToken ? {'Authorization': 'token ' + this.accessToken} : {};
    const { repository, title, description, storyPoint } = issue;
    const pointLabel = 'point-' + storyPoint;
    const statusLabel = 'status-pbl';
    return fetch(this.baseUri + repository + '/issues', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        title,
        body: description,
        labels: [pointLabel, statusLabel]
      }),
      headers: authHeader
    });
  }
}