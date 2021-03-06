
/**
 * @package     neatline
 * @subpackage  text
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Event Publications', function() {
  jasmine.getFixtures().fixturesPath = 'tests/jasmine/fixtures/';


  var model1, model2, span1, span2, span3, vent, slug;


  beforeEach(function() {

    TEXT.loadNeatline();

    model1 = TEXT.getTextRecordBySlug('slug-1');
    model2 = TEXT.getTextRecordBySlug('slug-2');

    span1 = TEXT.find('span[data-neatline-slug="slug-1"]');
    span2 = TEXT.find('span[data-neatline-slug="slug-2"]');
    span3 = TEXT.find('span[data-neatline-slug="slug-3"]');

    vent = spyOn(Neatline.vent, 'trigger').and.callThrough();
    slug = Neatline.Text.__controller.slug;

  });


  describe('highlight', function() {

    it('should publish model when one exists', function() {

      // ----------------------------------------------------------------------
      // When the cursor hovers on a tagged element, `highlight` should be
      // published with the corresponding model.
      // ----------------------------------------------------------------------

      var e = $.Event('mouseenter');
      span1.trigger(e);

      expect(vent).toHaveBeenCalledWith('highlight', {
        model: model1, event: e, source: slug
      });

    });

    it('should not publish when model does not exist', function() {

      // ----------------------------------------------------------------------
      // When no model exists, `highlight` should not be published.
      // ----------------------------------------------------------------------

      span3.trigger('mouseenter');

      expect(vent).not.toHaveBeenCalledWith();

    });

  });


  describe('unhighlight', function() {

    it('should publish model when one exists', function() {

      // ----------------------------------------------------------------------
      // When the cursor leaves a tagged element, `unhighlight` should be
      // published with the corresponding model.
      // ----------------------------------------------------------------------

      var e = $.Event('mouseleave');
      span1.trigger(e);

      expect(vent).toHaveBeenCalledWith('unhighlight', {
        model: model1, event: e, source: slug
      });

    });

    it('should not publish when model does not exist', function() {

      // ----------------------------------------------------------------------
      // When no model exists, `unhighlight` should not be published.
      // ----------------------------------------------------------------------

      span3.trigger('mouseleave');

      expect(vent).not.toHaveBeenCalled();

    });

  });


  describe('select', function() {

    _.each(['click', 'touchstart'], function(event) {

      describe(event, function() {

        it('should publish model when one exists', function() {

          // ------------------------------------------------------------------
          // When a tagged element is clicked / tapped, `select` should be
          // published with the corresponding model.
          // ------------------------------------------------------------------

          var e = $.Event(event);
          span1.trigger(e);

          expect(vent).toHaveBeenCalledWith('select', {
            model: model1, event: e, source: slug
          });

        });

        it('should not trigger unselect', function() {

          // ------------------------------------------------------------------
          // When a tagged element is pressed, event propagation should stop
          // at the level of the span. Otherwise, the event would bubble up to
          // the container and trigger the click-off unselect.
          // ------------------------------------------------------------------

          var e = $.Event(event);
          span1.trigger(e);

          expect(vent).not.toHaveBeenCalledWith('unselect', {
            model: model1, event: e, source: slug
          });

        });

        it('should not publish when model does not exist', function() {

          // ------------------------------------------------------------------
          // When no model exists, `select` should not be published.
          // ------------------------------------------------------------------

          span3.trigger(event);
          expect(vent).not.toHaveBeenCalledWith();

        });

      });

    });

  });


  describe('unselect', function() {

    it('should unselect on click-off', function() {

      // ----------------------------------------------------------------------
      // When a span is unselected by a click inside the container but not on
      // a tagged element, the selected model should be unselected.
      // ----------------------------------------------------------------------

      span1.trigger('click');

      var e = $.Event('click');
      Neatline.Text.__controller.view.$el.trigger(e);

      expect(vent).toHaveBeenCalledWith('unselect', {
        model: model1, event: e, source: slug
      });

    });

  });


});
