<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline-Narrative
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlineNarrativePlugin extends Omeka_Plugin_AbstractPlugin
{


    const ID = 'Narrative';


    protected $_hooks = array(
        'neatline_public_static'
    );


    protected $_filters = array(
        'neatline_exhibit_widgets',
        'neatline_record_widgets',
        'neatline_globals'
    );


    /**
     * Queue public payloads.
     *
     * @param array $args Array of arguments, with `exhibit`.
     */
    public function hookNeatlinePublicStatic($args)
    {
        if ($args['exhibit']->hasWidget(self::ID)) {
            queue_css_file('payloads/narrative-public');
            queue_js_file('payloads/narrative-public');
        }
    }


    /**
     * Register the exhibit widget.
     *
     * @param array $widgets Widgets, <NAME> => <ID>.
     * @return array The modified array.
     */
    public function filterNeatlineExhibitWidgets($widgets)
    {
        return array_merge($widgets, array(
            self::ID => self::ID
        ));
    }


    /**
     * Register the record widget.
     *
     * @param array $widgets Widgets, <NAME> => <ID>.
     * @return array The modified array.
     */
    public function filterNeatlineRecordWidgets($widgets)
    {
        return array_merge($widgets, array(
            self::ID => self::ID
        ));
    }


    /**
     * Bootstrap exhibit narrative models on `Neatline.g`.
     *
     * @param array $globals The array of global properties.
     * @param array $args Contains: `exhibit` (NeatlineExhibit).
     * @return array The modified array.
     */
    public function filterNeatlineGlobals($globals, $args)
    {

        // Query for narrative models.
        $result = $this->_db->getTable('NeatlineRecord')->queryRecords(
            $args['exhibit'], array('widget' => self::ID)
        );

        // Push collection onto `Neatline.g`.
        return array_merge($globals, array('narrative' => array(
            'records' => $result['records']
        )));

    }


}
