export default {
  resource: 'discovery',
  map() {
    this.route('grandchildCategory', { path: '/c/:grandparentSlug/:parentSlug/:slug' })
    this.route('topGrandchildCategory', { path: '/c/:grandparentSlug/:parentSlug/:slug/l/top' })
    Discourse.Site.currentProp('periods').forEach(period => {
      const top = 'top' + period.capitalize();
      this.route(top + 'Grandchildcategory', { path: '/c/:grandparentSlug/:parentSlug/:slug/l/top/' + period });
    })
    Discourse.Site.currentProp('filters').forEach(filter => {
      this.route(filter + 'GrandchildCategory', { path: '/c/:grandparentSlug/:parentSlug/:slug/l/' + filter });
    })
  }
}
