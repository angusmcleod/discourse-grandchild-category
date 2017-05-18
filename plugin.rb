# name: discourse-grandchild-category
# about: A plugin that allows you to create grandchild categories
# version: 0.1
# authors: Angus McLeod

after_initialize do
  Discourse::Application.routes.append do
    get "c/:grandparent_category_slug/:parent_category_slug/:category_slug/find_by_slug" => "categories#find_by_slug"
    get "c/:grandparent_category/:parent_category/:category.rss" => "list#category_feed", format: :rss
    get "c/:grandparent_category/:parent_category/:category/(:id)" => "list#parent_category_category_latest", constraints: { id: /\d+/ }
    get "c/:grandparent_category/:parent_category/:category/l/top" => "list#parent_category_category_top", as: "grandparent_category_parent_category_category_top"

    TopTopic.periods.each do |period|
      get "c/:grandparent_category/:parent_category/:category/l/top/#{period}" => "list#parent_category_category_top_#{period}", as: "grandparent_category_parent_category_category_top_#{period}"
    end

    Discourse.filters.each do |filter|
      get "c/:grandparent_category/:parent_category/:category/l/#{filter}" => "list#parent_category_category_#{filter}", as: "grandparent_category_parent_category_category_#{filter}"
    end

    scope "/tags" do
      constraints(tag_id: /[^\/]+?/, format: /json|rss/) do
        get '/c/:grandparent_category/:parent_category/:category/:tag_id' => 'tags#show', as: 'tag_grandparent_category_parent_category_category_show'

        Discourse.filters.each do |filter|
          get "/c/:grandparent_category/:parent_category/:category/:tag_id/l/#{filter}" => "tags#show_#{filter}", as: "tag_grandparent_category_parent_category_category_show_#{filter}"
        end
      end
    end
  end

  Category.class_eval do
    def parent_category_validator
      if parent_category_id
        errors.add(:base, I18n.t("category.errors.self_parent")) if parent_category_id == id
        errors.add(:base, I18n.t("category.errors.uncategorized_parent")) if uncategorized?
      end
    end

    def self.query_parent_category(parent_slug)
      self.where(slug: parent_slug).pluck(:id).first ||
      self.where(id: parent_slug.to_i).pluck(:id).first
    end

    def self.find_by_slug(category_slug, parent_category_slug=nil)
      if parent_category_slug
        parent_category_id = self.where(slug: parent_category_slug).pluck(:id).first
        self.where(slug: category_slug, parent_category_id: parent_category_id).first
      else
        self.where(slug: category_slug, parent_category_id: nil).first
      end
    end
  end
end
