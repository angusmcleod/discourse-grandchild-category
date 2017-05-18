import Category from 'discourse/models/category';

var grandchildSlug = function(slug) {
  let category = Category.list().find(c => c.slug === slug);
  if (parent = Category.list().find(c => c.id === category.parent_category_id)) {
    slug = parent.get('slug').concat(`/${slug}`);
    if (grandparent = Category.list().find(c => c.id === parent.parent_category_id)) {
      slug = grandparent.get('slug').concat(`/${slug}`);
    }
  }
  return slug;
}

export { grandchildSlug }
