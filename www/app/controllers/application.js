import Ember from 'ember';
import config from '../config/environment';


export default Ember.Controller.extend({
  get config() {
    return config.APP;
  },

  height: Ember.computed('model.main.nodes', {
    get() {
      var node = this.get('bestNode');
      if (node) {
        return node.height;
      }
      return 0;
    }
  }),

  roundShares: Ember.computed('model.main.stats', {
    get() {

      return parseInt(this.get('model.main.stats.roundShares'));
    }
  }),

  difficulty: Ember.computed('model.main.nodes', {
    get() {
      var node = this.get('bestNode');
      if (node) {
        return node.difficulty;
      }
      return 0;
    }
  }),

  hashrate: Ember.computed('difficulty', {
    get() {
      return this.getWithDefault('difficulty', 0) / config.APP.BlockTime;
    }
  }),

  immatureTotal: Ember.computed('model', {
    get() {
      return this.getWithDefault('model.main.immatureTotal', 0) + this.getWithDefault('model.main.candidatesTotal', 0);
    }
  }),

  bestNode: Ember.computed('model.main.nodes', {
    get() {
      var node = null;
      this.get('model.main.nodes').forEach(function (n) {
        if (!node) {
          node = n;
        }
        if (node.height < n.height) {
          node = n;
        }
      });
      return node;
    }
  }),

  lastBlockFound: Ember.computed('model', {
    get() {
      console.log(parseInt(this.get('model')));
      return parseInt(this.get('model.main.lastBlockFound')) || 0;
    }
  }),

  roundVariance: Ember.computed('model', {
    get() {
      var percent = this.get('model.main.stats.roundShares') / this.get('difficulty');
      if (!percent) {
        return 0;
      }
      return percent.toFixed(2);
    }
  }),

  nextEpoch: Ember.computed('height', {
    get() {
      var epochOffset = (30000 - (this.getWithDefault('height', 1) % 30000)) * 1000 * this.get('config').BlockTime;
      return Date.now() + epochOffset;
    }
  })

});
