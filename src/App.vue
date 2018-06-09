<template>
  <div id="app">
    <sui-grid>
        <sui-grid-column :width="13">
          <kanban-board :stages="stages" :blocks="blocks" @update-block="updateBlock">
            <div v-for="block in blocks" :slot="block.id" v-bind:key="block.id">
              <div class="card-title">
                {{ block.title }} <i class="pill">{{ block.storyPoint }}</i>
              </div>
              <div>
                <small>#{{ block.number }} {{ block.repository }}</small>
              </div>
            </div>
          </kanban-board>
        </sui-grid-column>
        <sui-grid-column :width="3">
            <RepositoryList></RepositoryList>
        </sui-grid-column>
    </sui-grid>
    <sui-button v-shortkey="['ctrl', 'n']" @shortkey="openCreateModal">Add Story (Ctrl + n)</sui-button>
    <sui-modal v-model="createModal.open">
      <sui-modal-content>
        <sui-form>
          <sui-grid>
            <sui-grid-column :width="12">
              <sui-form-field>
                <label>Title</label>
                <input ref="title" v-model="createModal.title" >
              </sui-form-field>
              <sui-form-field>
                <label>Description</label>
                <textarea v-model="createModal.description"></textarea>
              </sui-form-field>
            </sui-grid-column>
            <sui-grid-column :width="4">
              <sui-form-field>
                <label>Repository</label>
                <select v-model="createModal.repository">
                  <option v-for="repository in repositories" :key="repository" :value="repository">{{ repository  }}</option>
                </select>
              </sui-form-field>
              <sui-form-field>
                <label>Story Point</label>
                <select v-model="createModal.storyPoint">
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="13">13</option>
                  <option value="21">21</option>
                  <option value="?">?</option>
                </select>
              </sui-form-field>
            </sui-grid-column>
          </sui-grid>
        </sui-form>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-checkbox v-model="createModal.createAnother">Create another</sui-checkbox>
        <sui-button positive @click.native="createStory" v-shortkey="['ctrl', 'enter']" @shortkey="createStory">Create Story (Ctrl + Enter)</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import RepositoryList from './components/RepositoryList';
import GithubService from './service/GithubService';

export default {
  name: 'app',
  components: {
    RepositoryList,
  },
  data: function () {
    return {
      githubService: null,
      repositories: [],
      stageMap: {
        pbl: 'Product Backlog',
        sbl: 'Sprint Backlog',
        doing: 'Doing',
        inReview: 'In Review',
        done: 'Done!',
      },
      stages: [],
      blocks: [],
      createModal: {
        open: false,
        createAnother: false,
        title: '',
        description: '',
        repository: '',
        storyPoint: '?'
      },
    }
  },
  methods: {
    updateBlock(id, status) {
      const { repository, number } = JSON.parse(id);
      const block = this.blocks.find(b => b.id === id);
      block.status = status;

      const statusCode = this._findKeyByValue(this.stageMap, status);
      this.githubService.updateStatus(repository, number, statusCode, block.storyPoint);
    },
    initCreateModal() {
      this.createModal.title = '';
      this.createModal.description = '';
      this.createModal.storyPoint = '?';
    },
    openCreateModal() {
      this.initCreateModal();
      this.createModal.open = true;
    },
    closeCreateModal() {
      this.createModal.open = false;
    },
    createStory() {
      if (this.createModal.open) {
        this.githubService.createIssue({
          repository: this.createModal.repository,
          title: this.createModal.title,
          description: this.createModal.description,
          storyPoint: Number(this.createModal.storyPoint)
        }).then(res => this.fetchRepositories());
        if (this.createModal.createAnother) {
          this.initCreateModal();
        } else {
          this.closeCreateModal();
        }
      }
    },
    fetchRepositories() {
      this.blocks = [];
      this.repositories.forEach(repository => {
        this.githubService.listIssues(repository)
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
          }))
          .then(issues => this.blocks = issues.concat(this.blocks));
      });
    },
    _parseRepositoryName(repoUrl) {
      return repoUrl.replace('https://api.github.com/repos/', '')
    },
    _parseLabels(labels) {
      const pointLabel = labels.find(l => l.name.startsWith('point-'));
      const statusLabel = labels.find(l => l.name.startsWith('status-'));
      return {
        status: statusLabel ? this.stageMap[statusLabel.name.replace('status-', '')] : this.stageMap['pbl'],
        storyPoint: pointLabel ? pointLabel.name.replace('point-', '') : '?'
    }
    },
    _findKeyByValue(obj, value) {
      return Object.keys(obj).find(key => obj[key] === value);
    }
  },
  created() {
    this.githubService = new GithubService(); // TODO
    this.repositories = ['todokr/todos']; // TODO
    this.createModal.repository = this.repositories[0];
    this.stages = Object.values(this.stageMap);
  },
  mounted() {
    this.fetchRepositories();
  }
}
</script>

<style lang="scss">
@import './assets/kanban.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.card-title {
  padding-right: 20px;
}
</style>
