# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


# look at http://todomvc.com/
# http://builtwith.com/

require 'csv'

Classification.delete_all
Lingo.delete_all

csv_text = File.read('db/weblingo - Types.csv')
csv_data = CSV.parse(csv_text, :headers => true)
csv_data.each do |row|
  row = row.to_hash.with_indifferent_access
  Classification.create!(row.to_hash.symbolize_keys)
end

csv_text = File.read('db/weblingo - Data.csv')
lingo_data = CSV.parse(csv_text, :headers => true)
lingo_data.each do |row|
  row = row.to_hash.with_indifferent_access
  if (row[:_include] == '1') then
    row = row.except(:_include, :_classification)
    Lingo.create!(row.to_hash.symbolize_keys)
  end

end




