import editCategoryGeneral from 'discourse/components/edit-category-general';

export default {
  name: 'grandchild-edits',
  initialize(container){
    editCategoryGeneral.reopen({
      parentCategories: function() {
        return Discourse.Category.list()
      }.property()
    })
  }
}
