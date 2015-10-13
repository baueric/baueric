class CreateLingos < ActiveRecord::Migration
  def change
    create_table :lingos do |t|
      t.string :name
      t.string :url
      t.string :tagline

      t.timestamps null: false
    end
  end
end
