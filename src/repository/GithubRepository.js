export default class GithubRepository {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUri = 'https://api.github.com/repos/'
  }

  initializeConfigRepository() {

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
    const labels = ['status:' + statusCode, 'point:' + storyPoint];
    return fetch(this.baseUri + repository + '/issues/' + number, {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify({
        labels: labels
      }),
      headers: authHeader
    }).then(res => res.json());
  }

  createIssue(issue) {
    const authHeader = this.accessToken ? {'Authorization': 'token ' + this.accessToken} : {};
    const { repository, title, description, storyPoint } = issue;
    const pointLabel = 'point:' + storyPoint;
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