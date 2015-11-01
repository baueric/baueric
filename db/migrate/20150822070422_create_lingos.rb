class CreateLingos < ActiveRecord::Migration
  def change
    create_table :lingos do |t|
      t.string :name
      t.string :website_url
      t.string :tagline
      t.string :logo_url
      t.integer :classification_id

      t.timestamps null: false
    end
  end
end
