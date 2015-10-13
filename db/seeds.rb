# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Lingo.delete_all

Lingo.create(name: 'Capistrano',
             url: 'capistranorb.com',
             tagline: 'A remote server automation and deployment tool written in Ruby.')

Lingo.create(name: 'Cucumber',
             url: 'cucumber.io',
             tagline: 'Simple, human collaboration')



