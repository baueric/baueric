/**
 * Created by ericbauer on 9/5/15.
 */

//= require ractive
//= require templates/weblingo.rac.erb
//= require lodash

window.Weblingo = Ractive.extend({
  template: RactiveTemplates['templates/weblingo'],

  computed: {
    currentLingo: {
      get: '${lingos}[${currentQuestion}.lingoId]'
    },
    currentQuestion: {
      get: '${questions}[${questionNum}]'
    },
    correctChoice: {
      get: '${currentQuestion}.correctChoice'
    },
    choicesTagline: {
      get: function() {
        var lingos = this.get('lingos');
        var choiceIds = this.get('currentQuestion').choiceIds;

        var taglines = [];

        for (var i = 0; i < choiceIds.length; i++) {
          taglines.push(lingos[choiceIds[i]].tagline);
        }

        return taglines;
      }
    }
  },

  oninit: function() {
    var self = this;

    this.on('startQuiz', this.startQuiz);
  },

  data: function () { return {
      score: 0,
      questionNum: -1 // -1 is start screen
    };
  },

  startQuiz: function(event) {
    this.set('score', 0);
    this.nextQuestion();
  },

  nextQuestion: function() {
    this.add('questionNum');
  },

  choiceClick: function(num) {
    var correctChoice = this.get('correctChoice');
    if (this.get('correctChoice') == num) {
      this.add('score');
    }
    this.nextQuestion();
  }

});