import { buildGrandchildRoute } from '../routes/build-grandchild-route';
import DiscoverySortableController from 'discourse/controllers/discovery-sortable';
import TagsShowRoute from 'discourse/routes/tags-show';

export default {
  after: 'inject-discourse-objects',
  name: 'grandparent-route-builder',
  initialize(registry, app) {
    app.DiscoveryGrandchildCategoryController = DiscoverySortableController.extend();
    app.DiscoveryGrandchildCategoryRoute = buildGrandchildRoute('default');

    const site = Discourse.Site.current();
    site.get('filters').forEach(filter => {
      const filterCapitalized = filter.capitalize();
      app[`Discovery${filterCapitalized}GrandchildCategoryController`] = DiscoverySortableController.extend();
      app[`Discovery${filterCapitalized}GrandchildCategoryRoute`] = buildGrandchildRoute(filter);
    });

    Discourse.DiscoveryTopGrandchildCategoryController = DiscoverySortableController.extend();
    Discourse.DiscoveryTopGrandchildCategoryRoute = buildGrandchildRoute('top');

    site.get('periods').forEach(period => {
      const periodCapitalized = period.capitalize();
      app[`DiscoveryTop${periodCapitalized}GrandchildCategoryController`] = DiscoverySortableController.extend();
      app[`DiscoveryTop${periodCapitalized}GrandchildCategoryRoute`] = buildGrandchildRoute('top/' + period);
    });

    app["TagsShowGrandchildCategoryRoute"] = TagsShowRoute.extend();

    site.get('filters').forEach(function(filter) {
      app["TagsShowGrandchildCategory" + filter.capitalize() + "Route"] = TagsShowRoute.extend({ navMode: filter });
    });
  }
};
