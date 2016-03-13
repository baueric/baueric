
require 'set'

class WeblingoController < ApplicationController

  def index

    num_questions = 10
    num_choices = 4

    @lingos = Lingo.all

    @questions = []

    lingo_ids = (0...@lingos.length).to_a

    lingo_ids.shuffle.slice(0,num_questions).each do |q_id|

      choice_ids = (lingo_ids - [q_id]).shuffle.slice(0,num_choices-1)
      choice_ids << q_id
      choice_ids = choice_ids.shuffle
      correct_choice = choice_ids.index(q_id)

      new_q = {
        lingoId: q_id,
        choiceIds: choice_ids,
        correctChoice: correct_choice,
        status: 0
      }

      @questions << new_q

    end

    #@taglines = lingos.flat_map(&:tagline)

  end

  def all
    @lingos = Lingo.all
  end

  protected

end

