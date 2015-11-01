

require 'csv'

namespace :import_weblingo do

  task :import => :environment do

    CSV.foreach('weblingo.csv', :headers => true) do |row|



    end

  end

end