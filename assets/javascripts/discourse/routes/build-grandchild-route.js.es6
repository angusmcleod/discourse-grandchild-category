import buildCategoryRoute from 'discourse/routes/build-category-route';
import Category from 'discourse/models/category';

function buildGrandchildRoute(filterArg, params) {
  var route = buildCategoryRoute(filterArg, params);
  route.reopen({
    model(modelParams) {
      const category = Category.list().find(c => c.slug === modelParams.slug);
      if (!category) {
        return Category.reloadBySlug(modelParams.slug, modelParams.parentSlug).then((atts) => {
          if (modelParams.parentSlug) {
            atts.category.parentCategory = Category.findBySlug(modelParams.parentSlug);
          }
          const record = this.store.createRecord('category', atts.category);
          record.setupGroupsAndPermissions();
          this.site.updateCategory(record);
          return { category: Category.findBySlug(modelParams.slug, modelParams.parentSlug) };
        });
      };
      return { category };
    }
  })
  return route;
}

export { buildGrandchildRoute }
