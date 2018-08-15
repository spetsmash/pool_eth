import Ember from 'ember';
import Block from "../models/block";
import config from '../config/environment';


export default Ember.Route.extend({
  intl: Ember.inject.service(),

  beforeModel() {
    this.get('intl').setLocale('en-us');
  },

	model: function() {
    var url = config.APP.ApiUrl + 'api/stats';
    var main = Ember.$.getJSON(url).then(function(data) {
      return Ember.Object.create(data);
    });
    var url1 = config.APP.ApiUrl + 'api/blocks';
    var block = Ember.$.getJSON(url1).then(function(data) {
      if (data.candidates) {
        data.candidates = data.candidates.slice(0, 10);
        data.candidates = data.candidates.map(function(b) {
          return Block.create(b);
        });
      }
      if (data.immature) {
        data.immature = data.immature.map(function(b) {
          return Block.create(b);
        });
      }
      if (data.matured) {
        data.matured = data.matured.map(function(b) {
          return Block.create(b);
        });
      }

      return data;
    });

    var priceUsd = Ember.$.getJSON("https://cex.io/api/last_price/ETH/USD").then(function(data) {
      return Ember.Object.create(data);
    });

    var priceBtc = Ember.$.getJSON("https://cex.io/api/last_price/ETH/BTC").then(function(data) {
      return Ember.Object.create(data);
    });


    var promises = {
      main: main,
      block: block,
      priceUsd: priceUsd,
      priceBtc: priceBtc
    };

    return Ember.RSVP.hash(promises).then(function(data) {
      // data.main.candidates = data.main.candidates.map(function(b) {
      //   Ember.$.getJSON('https://api.etherscan.io/api?module=block&action=getblockreward&blockno='+ b.height + '&apikey=SVI12T5A9B8JW6SA2D44NFW165VHP2AW4I').then(function(data) {
      //     b.minerMine = data.result.blockMiner;
      //     return Block.create(b);
      //   });

      // });
      return data;

    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    Ember.run.later(this, this.refresh, 5000);
  }
});
